import mongoose, { Document, Schema, Model } from "mongoose";

interface TransactionDoc extends Document {
  student: string;

  donationValue: number;

  status: string;

  paymentResponse: string;
}

const TransactionSchema = new Schema(
  {
    student: String,

    donationValue: Number,

    status: String,

    paymentResponse: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },

    timestamps: true,
  }
);
const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);

export { Transaction };
