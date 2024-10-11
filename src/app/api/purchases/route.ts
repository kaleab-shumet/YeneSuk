import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Purchase, { IPurchase, PurchaseItem } from "@/models/purchaseModel";
import { validateJWT } from "@/helpers/validateJWT";
import Product from "@/models/productModel";
import vendorModel from "@/models/vendorModel";

connectDB();




export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if vendor already exists
    const reqBody = await request.json();

    const purchasedBy = userId;

    const vendor = reqBody.vendorId
    const vendorExists = await vendorModel.find({ _id: vendor })

    if (!vendorExists)
      throw new Error("Vendor does not exist")

    const items: PurchaseItem[] = reqBody.items.map((item: any) => ({
      product: item.productId,
      quantity: Number(item.quantity),
      purchasingPrice: Number(item.purchasingPrice),
      sellingPrice: Number(item.sellingPrice),
    }))

    const productIds = items.map(item => item.product);
    const quantities = items.map(item => item.quantity);
    const prices = items.map(item => item.sellingPrice);
    const purchasingPrices = items.map(item => item.purchasingPrice);

    const updates = productIds.map((productId, index) => ({
      updateOne: {
        filter: { _id: productId },
        update: {
          $inc: { quantity: quantities[index] },
          $set: {
            sellingPrice: prices[index],
            purchasingPrice: purchasingPrices[index]
          }
        },
        upsert: false,
      }
    }));

    // Check if all product IDs are valid
    const invalidProductIds = await Product.find({ _id: { $nin: productIds } }, { _id: 1 }).distinct('_id');

    if (invalidProductIds.length > 0) {
      throw new Error('Invalid product IDs: ' + JSON.stringify(invalidProductIds))
    }

    // Execute the bulk write operation if all product IDs are valid
    const result = await Product.bulkWrite(updates, { ordered: false });

    // Check for errors
    const errors = result.getWriteErrors();
    if (errors.length > 0) {
      // Handle errors here
      throw new Error('Errors occurred during bulk write: ' + JSON.stringify(errors));
    }

    const totalAmount = items.reduce((acc: number, currItem: any) => acc + currItem.purchasingPrice, 0)

    const purchase = new Purchase({
      purchasedBy,
      items,
      vendor,
      totalAmount

    });
    await purchase.save();

    return NextResponse.json({
      message: "Items Successfully Purchased",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await validateJWT(request);

    const purchases = await Purchase.find({})
      .populate({ path: 'purchasedBy', select: 'name' }) // Populate user details
      .populate('vendor') // Populate vendor details
      .populate({
        path: 'items.product',
        select: 'name price purchasingPrice quantity'
      });

    return NextResponse.json({
      data: purchases,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
