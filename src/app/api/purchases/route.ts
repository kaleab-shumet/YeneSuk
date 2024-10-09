import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Purchase from "@/models/purchaseModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();



export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if vendor already exists
    const reqBody = await request.json();

    reqBody.createdBy = userId;


    const purchase = new Purchase(reqBody);
    await purchase.save();

    return NextResponse.json({
      message: "Vendor created successfully",
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
      .populate('purchasedBy') // Populate user details
      .populate('vendorId') // Populate vendor details
      .populate({
        path: 'items.productId',
        select: 'name price countInStock'
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
