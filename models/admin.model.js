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

// compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;