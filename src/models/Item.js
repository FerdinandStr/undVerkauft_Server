import mongoose from "mongoose"
import User from "./User"
import { OfferSchema } from "./Offer"

const ItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        picList: { type: String },
        detailList: { type: Object },
        creationUser: { type: mongoose.Schema.ObjectId, ref: User, required: true, index: true },
        offer: OfferSchema,
    },
    { timestamps: true }
)

const Item = mongoose.model("Item", ItemSchema)
export default Item
