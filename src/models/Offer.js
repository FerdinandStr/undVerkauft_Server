import mongoose from "mongoose"
import Item from "./Item"
import User from "./User"

const OfferSchema = new mongoose.Schema(
    {
        // idItem: { type: mongoose.Schema.ObjectId, ref: Item, required: true, index: true },
        startDate: { type: Date, default: Date.now(), required: false },
        endDate: { type: Date, required: false, default: new Date(Date.now() + 900000) },
        askPrice: { type: Number, default: 1, required: true },
        soldPrice: Number,
        soldUser: { type: mongoose.Schema.ObjectId, ref: User }, //index: true
        bidList: { type: [{ userId: { type: mongoose.Schema.ObjectId, ref: User }, bid: Number, date: Date }] },
    },
    { timestamps: true }
)

const Offer = mongoose.model("Offer", OfferSchema)
export { Offer, OfferSchema }
