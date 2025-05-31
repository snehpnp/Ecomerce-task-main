const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
     product_id: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    order_id: {
      type: String,
        ref: "orders",
    },
    payment_method: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("payments", paymentSchema);
