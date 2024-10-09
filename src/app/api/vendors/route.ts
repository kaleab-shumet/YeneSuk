import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Vendor from "@/models/vendorModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();


const searchVendors = async (searchText: string) => {
  try {
      const vendors = await Vendor.find({
          $or: [
              { name: { $regex: searchText, $options: 'i' } }, // Search name
              { email: { $regex: searchText, $options: 'i' } }, // Search email
              { phone: { $regex: searchText, $options: 'i' } }, // Search phone
          ]
      })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
      
      return vendors;
  } catch (error) {
      console.error('Error searching vendors:', error);
      throw error; // Rethrow error for further handling if needed
  }
};



export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if vendor already exists
    const reqBody = await request.json();
    const vendorExists = await Vendor.findOne({
      email: reqBody.email,
    });
    if (vendorExists) {
      throw new Error("Vendor already exists");
    }

    reqBody.createdBy = userId;
    const vendor = new Vendor(reqBody);
    await vendor.save();

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
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || ""
 

    
    const vendors = await searchVendors(search)
      
    return NextResponse.json({
      data: vendors,
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
