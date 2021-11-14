function errorController(err, req, res, next) {
    console.log("this is the error middleware!")
    console.log(err.name, err.code)

    if (err.code && err.code == 11000) {
        handleDuplicateKeyError(err, res)
    }
    if (err.name == "ValidationError") {
        handleValidationError(err, res)
    }

    console.log(err)
    res.status(500).send("ERROCONTROLLER LAST RESORT 500")
}

function handleDuplicateKeyError(err, res) {
    const errCode = 409 //Conflict
    const errors = formatErrors(err)

    res.status(errCode).send(errors)
}

function handleValidationError(err, res) {
    const code = 400
    const errors = formatErrors(err)

    res.status(code).send(errors)
}

function formatErrors(err) {
    const messages = Object.values(err.errors).map((el) => el.message)
    const fields = Object.values(err.errors).map((el) => el.path)

    return { messages: messages, fields }
}

export default errorController
