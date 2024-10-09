import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { validateJWT } from "@/helpers/validateJWT";
import Purchase from "@/models/purchaseModel";

connectDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const purchase = await Purchase.findById(params.purchaseId)
    .populate('purchasedBy') // Populate user details
    .populate('vendorId') // Populate vendor details
    .populate({
      path: 'items.productId',
      select: 'name price countInStock'
    }); 
    
    return NextResponse.json(purchase);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      purchaseId: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();
    await Purchase.findByIdAndUpdate(params.purchaseId, reqBody);
    return NextResponse.json({
      message: "Purchase updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    await validateJWT(request);
    await Purchase.findByIdAndDelete(params.purchaseId);
    return NextResponse.json({
      message: "Purchase deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
