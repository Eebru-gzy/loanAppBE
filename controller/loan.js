const successResponse = require("../utils/success");
const errorResponse = require("../utils/errorRes");
const Loan = require("../models/loan");

// @desc    user take a loan
// @route   POST /api/takeloan
// @access  private

const takeLoan = async (req, res) => {
	try {
		const {
			principalAmount,
			interestAmount,
			amountDue,
			dueDate,
			loanPeriod,
		} = req.body;

		const createLoan = await Loan.create({
			principalAmount,
			interestAmount,
			amountDue,
			dueDate,
			loanPeriod,
		});
		console.log(createLoan);
		successResponse(200, createLoan, res);
	} catch (error) {
		console.log(error);
		return errorResponse(500, "Internal server error", res);
	}
};

module.exports = takeLoan;
