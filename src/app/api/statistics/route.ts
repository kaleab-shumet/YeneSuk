import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Order, { OrderStatus } from "@/models/orderModel";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import Category from "@/models/categoryModel";
import Purchase from "@/models/purchaseModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();


export async function GET(request: NextRequest) {
  try {
    await validateJWT(request);
    


    const numOrders = await Order.countDocuments({orderStatus: OrderStatus.COMPLETED}).exec()
    const numUsers = await User.countDocuments({isAdmin: false}).exec()
    const products = await Product.find({}).exec()
    const numProducts = products.reduce((acc, pr)=> acc + pr.quantity, 0 )
    const numCategories = await Category.countDocuments({}).exec()

    const purchases = await Purchase.find({}).exec()
    const purchasesAmount = purchases.reduce((acc, purchase)=> (acc + purchase.totalAmount), 0)


    const sales = await Order.find({orderStatus: OrderStatus.COMPLETED}).exec()
    const salesAmount = sales.reduce((acc, order)=> (acc + order.total), 0)
    
    const profit = sales.reduce((acc, order)=> (acc + ( 
      order.items.reduce((iacc, itm)=>(iacc + itm.sellingPrice), 0 ) - 
      order.items.reduce((iacc, itm)=>(iacc + itm.purchasingPrice), 0 )    
    )), 0)
    
    return NextResponse.json({
      data: {
          numOrders,
          numUsers,
          numProducts,
          numCategories,
          purchasesAmount,
          salesAmount,
          profit        
      },
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
