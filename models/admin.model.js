const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username?"],
            unique: true,
        },
        password:{
            type: String,
            required: [true, "password?"]
        }
    }
);

// hash password before saving
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;