const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		bvn: {
			type: String,
			required: true,
		},
		password: {
			type: String,
      required: true,
      maxlength: 255
		},
		email: {
			type: String,
			required: true,
		},
		emailConfirmToken: {
			type: String,
			required: true,
		},
		email_isVerified: {
			type: Boolean,
			default: false,
		},
		reference: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

userSchema.methods.bcryptHash = async function (password) {
	try {
		const salt = await bcrypt.genSalt(10);
		return  await bcrypt.hash(password, salt);
	} catch (error) {
		console.error("could not hash password ", error);
		return error;
	}
};

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedJWT = async function (id) {
	return await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

module.exports = mongoose.model("User", userSchema);
