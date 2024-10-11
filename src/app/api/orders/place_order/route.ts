import { connectDB } from "@/configs/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import Order from "@/models/orderModel";
import { validateJWT } from "@/helpers/validateJWT";
import Product from "@/models/productModel";

connectDB();

interface RequestOrderItem {
  productId: string; // Changed to string
  quantity: number;
}

// This is product information to be saved in order
interface OrderItem {
  productId: string; // Changed to string
  name: string; // Changed to string
  sellingPrice: number;
  purchasingPrice: number;
  quantity: number;
}


type HashMap<T> = {
  [key: string]: T;
};

async function processOrder(userId: string, reqOrderItemsList: RequestOrderItem[]): Promise<void> {
  const productsToUpdate: any[] = [];
  const productsQuantHashmap: HashMap<number> = {}; // Changed to number

  // First pass: Verify all products exist and have sufficient stock
  for (const item of reqOrderItemsList) {
    try {
      const product = await Product.findById(item.productId).exec();

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`${product.name} is out of stock.`);
      }

      // Store the product to update later
      productsToUpdate.push(product);
      productsQuantHashmap[product._id.toString()] = item.quantity;
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      throw error
    }
  }

  const orderItems: OrderItem[] = productsToUpdate.map(e => ({
    productId: e._id.toString(), // Ensure _id is a string
    name: e.name,
    sellingPrice: e.sellingPrice,
    purchasingPrice: e.purchasingPrice,
    quantity: productsQuantHashmap[e._id.toString()]
  }));

  const totalAmount = orderItems.reduce((acc, ci) => acc + (ci.sellingPrice * ci.quantity), 0);

  try {
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: totalAmount,
    });

    await newOrder.save(); // Await save to handle potential errors
  } catch (err) {
    console.error(err);
    throw err
  }

  // Second pass: Update quantities
  for (const item of reqOrderItemsList) {
    const product = productsToUpdate.find(p => p._id.toString() === item.productId);

    if (product) {
      product.quantity -= item.quantity; // Subtract the ordered quantity
      await product.save(); // Save the updated product
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const reqBody = await request.json();
    reqBody.user = userId;

    const orderItemsList: RequestOrderItem[] = reqBody.items.map((e: any) => ({
      productId: e._id,
      quantity: e.quantity,
    }));

    await processOrder(userId, orderItemsList);

    return NextResponse.json({
      message: "Order placed successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}