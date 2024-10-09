import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { validateJWT } from "@/helpers/validateJWT";
import Vendor from "@/models/vendorModel";

connectDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const vendor = await Vendor.findById(params.vendorId);
    return NextResponse.json(vendor);
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
      vendorId: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();
    await Vendor.findByIdAndUpdate(params.vendorId, reqBody);
    return NextResponse.json({
      message: "Vendor updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    await validateJWT(request);
    await Vendor.findByIdAndDelete(params.vendorId);
    return NextResponse.json({
      message: "Vendor deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
