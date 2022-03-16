import { Router } from "express"
import Item from "../models/Item"
import { Offer } from "../models/Offer"
const router = Router()

// create bid for offer (keep item unchanged?)
router.post("/:itemId/offer/bid", (req, res, next) => {
    const userId = req.user._id
    const { itemId } = req.params
    const { bid } = req.body

    Item.findById(itemId)
        .then((item) => {
            if (item.creationUser == userId) {
                // throw new Error("Sie können nicht auf Ihren eigenen Artikel bieten!")
            }
            console.log(item.creationUser, userId)

            console.log("Push bid for Item:", item)

            const lastBidFromList = item.offer.bidList[item.offer.bidList.length - 1] ? item.offer.bidList[item.offer.bidList.length - 1].bid : false
            const lastBid = lastBidFromList || item.offer.askPrice || 0

            if (lastBid < bid) {
                item.offer.bidList.push({ userId, bid, date: new Date() })
            } else {
                console.log("ERROR", lastBid, bid, lastBid < bid)
                throw new Error("Das Gebot muss höher sein als das letzte Gebot und höher als der Startpreis")
            }

            item.save(item)
                .then(() => {
                    return res.send(item)
                })
                .catch(next)
        })
        .catch(next)
})

//* get offer for Item ID
router.get("/:itemId/offer", (req, res, next) => {
    Item.findById(req.params.itemId)
        .then((item) => {
            return item.offer ? res.json(item.offer) : res.status(404).send("For this item exists no offer.")
        })
        .catch(next)
})

//create new Offer for Item
router.post("/:itemId/offer", (req, res, next) => {
    // const offer = new Offer({ startDate: req.body.startDate, endDate: req.body.endDate, askPrice: req.body.askPrice })
    const offer = new Offer(req.body)
    Item.updateOne({ _id: req.params.itemId }, { $set: { offer: offer } })
        .then((result) => res.json(result))
        .catch(next)
})

//create new Offer for Item
//update offer and keep item unchanged!
router.patch("/:itemId/offer", (req, res, next) => {
    Item.updateOne({ _id: req.params.itemId }, { $set: { offer: req.body } }) //holy shit :O
        .then((result) => res.json(result))
        .catch(next)
})

export default router
