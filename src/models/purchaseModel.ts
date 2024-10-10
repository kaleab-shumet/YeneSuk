import mongoose, { Schema, Model, Document } from 'mongoose';

// Define the purchase item interface
export interface PurchaseItem extends Document {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    purchasingPrice: number;
    sellingPrice: number;
}

// Define the purchase item schema
const purchaseItemSchema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'products' // Assuming you have a Product model
    },
    quantity: {
        type: Number,
        required: true
    },
    purchasingPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    }
});

// Define the purchase interface
export interface IPurchase extends Document {
    purchasedBy: mongoose.Schema.Types.ObjectId;
    vendor: mongoose.Schema.Types.ObjectId;
    items: PurchaseItem[];
    totalAmount: number;
    createdAt: Date;
}

// Define the purchase schema
const purchaseSchema: Schema = new Schema({
    purchasedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users' // Reference to User model, bought by
    },
    vendor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'vendors' // Reference to Vendor model
    },
    items: {
        type: [purchaseItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if the model already exists
const Purchase: Model<IPurchase> = mongoose.models["purchases"] || mongoose.model('purchases', purchaseSchema);

// Export the model
export default Purchase;