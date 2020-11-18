const successResponse = require("../utils/success");
const errorResponse = require("../utils/errorRes");
const Loan = require("../models/loan");

// @desc    user take a loan
// @route   POST /api/takeloan
// @access  private
const takeLoan = async (req, res) => {
	try {
		req.body.user = req.user[0]._id;

		const createLoan = await Loan.create(req.body);
		successResponse(200, createLoan, res);
	} catch (error) {
		console.log(error);
		return errorResponse(500, "Internal server error", res);
	}
};

// @desc    get all user's loan
// @route   GET /api/loans
// @access  private
const getLoans = async (req, res) => {
	try {
		const loans = await Loan.find({ user: req.user[0]._id });
		successResponse(200, loans, res);
	} catch (error) {
		console.log(error);
		return errorResponse(500, "Internal server error", res);
	}
};

module.exports = { takeLoan, getLoans, };
