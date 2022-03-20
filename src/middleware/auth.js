const jwt = require("jsonwebtoken")

const { TOKEN_KEY } = process.env

function checkToken(req, res, next) {
    const token = req.cookies["x-access-token"]

    if (!token) {
        return res.status(401).send({ error: "Sie sind nicht angemeldet (Token missing)" })
    }

    try {
        const decoded = jwt.verify(token, TOKEN_KEY)
        req.user = decoded
        return next()
    } catch (err) {
        return res.status(401).send({ error: "Sie sind nicht angemeldet (Invalid Token)" })
    }
}

export { checkToken }
