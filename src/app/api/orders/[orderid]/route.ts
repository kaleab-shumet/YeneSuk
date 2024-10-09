import { connectDB } from "@/configs/dbConfig";
import { validateJWT } from "@/helpers/validateJWT";
import { NextRequest, NextResponse } from "next/server";
import Order, { OrderStatus, PaymentStatus } from "@/models/orderModel";
import Product from '@/models/productModel'

connectDB();

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      orderid: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const order = await Order.findById(params.orderid).populate(
      "user",
      "name email"
    );
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      orderid: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();

    const dbOrder = await Order.findById(params.orderid).exec();

    const { orderStatus } = reqBody;

    let orderUpdate;

    if (dbOrder?.orderStatus == OrderStatus.CANCELLED) {
      throw new Error("can not modify canceled order")
    }

    if (orderStatus == OrderStatus.CREATED) {
      throw new Error("can not update order status to created")
    }

    else if (orderStatus == OrderStatus.CANCELLED) {

      // Items operation
      const dboItems = dbOrder?.items

      if (dboItems && dboItems?.length > 0) {
        for (const orderItem of dboItems) {

          const product = await Product.findById(orderItem._id).exec();

          if (!product) {
            console.error(`Product with ID ${orderItem.productId} not found.`);
            continue; // Skip if the product does not exist
          }

          product.countInStock += orderItem.quantity;
          // Save the updated product
          await product.save();

        }
      }



      const paymentStatus = dbOrder?.paymentStatus == PaymentStatus.PAID ? PaymentStatus.REFUNDED : dbOrder?.paymentStatus
      orderUpdate = {
        orderStatus,
        paymentStatus
      }

    }

    else if (orderStatus == OrderStatus.COMPLETED) {

      const paymentStatus = PaymentStatus.PAID;
      orderUpdate = {
        orderStatus,
        paymentStatus
      }

    }

    await Order.findByIdAndUpdate(params.orderid, orderUpdate);
    return NextResponse.json({
      message: "Order updated successfully",
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
