import mongoose from "mongoose"
import User from "./User"
import { OfferSchema } from "./Offer"

const ItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Ein Artikelname wird benötigt"] },
        name_lower: { type: String, index: true },
        description: { type: String, required: [true, "Eine Beschreibung wird benötigt"] },
        picList: [{ filename: String, filepath: String }],
        detailList: { type: Object }, // => Schema.Types.Mixed , {}, mongoose.Mixed //probably should be MongooseMap!
        creationUser: { type: mongoose.Schema.ObjectId, ref: User, required: true, index: true },
        offer: {
            type: OfferSchema,
            // default: {},
        },
    },
    { timestamps: true }
)

//schema middleware to apply on before saving
ItemSchema.pre("save", async function (next) {
    this.name_lower = this.name.toLowerCase()
    next()
})

const Item = mongoose.model("Item", ItemSchema)
export default Item
