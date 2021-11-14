import mongoose from "mongoose"
import Item from "./Item"

const OfferSchema = new mongoose.Schema(
    {
        // idItem: { type: mongoose.Schema.ObjectId, ref: Item, required: true, index: true },
        picList: { type: String },
        detailList: { type: Object },
        soldPrice: { type: Number },
        soldUser: { type: mongoose.Schema.ObjectId, ref: User, index: true },
        askPrice: { type: Number },
    },
    { timestamps: true }
)

const Offer = mongoose.model("Offer", OfferSchema)
export { Offer, OfferSchema }
