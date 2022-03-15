import { Router } from "express"
import path from "path"
import multer from "multer"
import Item from "../models/Item"
import { v1 as uuidv1 } from "uuid"

const ITEM_IMG_PATH = "public/images"
const router = Router()

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, ITEM_IMG_PATH)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "_" + uuidv1() + path.extname(file.originalname))
        },
    }),
})

router.get("/itemImg/:filename", (req, res) => {
    const { filename } = req.params
    const dirname = path.resolve() //TODO will this work on webserver?
    const fullfilepath = path.join(dirname, ITEM_IMG_PATH + "/" + filename)
    return res.sendFile(fullfilepath)
})

router.post("/itemImg/:itemId", upload.array("itemImg", 6), async (req, res, next) => {
    const { itemId } = req.params
    const files = req.files

    console.log("HELLO FILES", files)
    if (!files || !itemId) {
        return res.status(400).json("ERROR no file or itemId")
    }
    const picList = files.map((file) => ({ filename: file.filename, filepath: file.path.replace(/\\\\/g, "/").replace(/\\/g, "/") }))
    console.log("picList", picList)

    // check ITEM exists?
    Item.updateOne({ _id: itemId }, { $set: { picList } })
        .then((result) => res.status(201).json(result))
        .catch(next)
})

export default router
