import mongoose, {  Schema } from 'mongoose';

// Define the vendor schema
const vendorSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Reference to the Users model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the vendor model
if (mongoose.models && mongoose.models["vendors"])
    delete mongoose.models["vendors"];

export default mongoose.model('vendors', vendorSchema);
