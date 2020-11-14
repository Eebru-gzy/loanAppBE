const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
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


userSchema.methods.comparePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};



module.exports = mongoose.model("User", userSchema);