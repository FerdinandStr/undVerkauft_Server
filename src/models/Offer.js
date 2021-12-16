import mongoose from "mongoose"
import Item from "./Item"
import User from "./User"

const OfferSchema = new mongoose.Schema(
    {
        // idItem: { type: mongoose.Schema.ObjectId, ref: Item, required: true, index: true },
        startDate: { type: Date, default: Date.now(), required: true },
        endDate: { type: Date, required: true, default: new Date(Date.now() + 900000) },
        askPrice: { type: Number, default: 1, required: true },
        soldPrice: Number,
        soldUser: { type: mongoose.Schema.ObjectId, ref: User }, //index: true
        bidList: { type: [{ userId: Number, bid: Number, date: Date }] },
    },
    { timestamps: true }
)

const Offer = mongoose.model("Offer", OfferSchema)
export { Offer, OfferSchema }
