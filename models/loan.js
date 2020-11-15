const mongoose = require("mongoose");
const { Schema } = mongoose;

const loanSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		principalAmount: {
			type: String,
			required: true,
		},
		interestAmount: {
			type: String,
			required: true,
		},
		amountDue: {
			type: String,
			required: true,
		},
		dueDate: {
			type: String,
			required: true,
		},
		loanPeriod: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: "In-progress",
			enum: ["In-progress", "Settled", "Default"],
		},
		startDate: {
			type: Date,
			default: Date.now(),
		},
	},
	{ timestamps: true }
);



module.exports = mongoose.model("Loan", loanSchema);
