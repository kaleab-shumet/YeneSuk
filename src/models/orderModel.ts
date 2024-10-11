import mongoose from "mongoose";

// Define enums
const PaymentStatus = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

const OrderStatus = {
  CREATED: 'created',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const OrderItemSchema: mongoose.Schema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  purchasingPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    items: [OrderItemSchema],
    paymentStatus: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models["orders"])
  delete mongoose.models["orders"];

export default mongoose.model("orders", orderSchema);

// Export the enums for use in other parts of your application
export { PaymentStatus, OrderStatus };