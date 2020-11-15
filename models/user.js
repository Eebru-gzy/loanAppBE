const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
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
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    return next();
    } catch (error) {
      logger.error("could not hash password ", error);
      return error;
    }
});


userSchema.methods.comparePassword = async function(data) {
  return await bcrypt.compare(data, this.password);
};

userSchema.methods.getSignedJWT = async function(id) {
  return await jwt.sign({ id, }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
}



module.exports = mongoose.model("User", userSchema);