import mongoose from "mongoose"
import bcrypt from "bcrypt"
import validator from "validator"

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Enter a username"],
            validate: [validator.isAlphanumeric, "Only letters and numbers are allowed for the Username"],
        },
        email: {
            type: String,
            unique: [true, "This E-Mail is already connected to an account."],
            required: [true, "Enter an E-Mail address."],
            validate: [validator.isEmail, "Enter a valid E-Mail address."],
        },
        password: {
            type: String,
            required: [true, "Enter a password."],
            minlength: [8, "Password should be at least 8 characters"],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Retype your password."],
            validate: {
                validator: function (passwordConfirm) {
                    console.log("THIS!!!!", this)
                    return passwordConfirm === this.password
                },
                message: "Passwords don't match.",
            },
        },
        ip: String,
    },
    { timestamps: true }
)

//schema middleware to apply on before saving
UserSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

//find by username or email
UserSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({ $or: [{ username: login }, { email: login }] }).select("+password")
    return user
}

// userSchema.pre("remove", function (next) {
//     this.model("Message").deleteMany({ user: this._id }, next)
// })

const User = mongoose.model("User", UserSchema)
// User.cleanIndexes()

export default User
