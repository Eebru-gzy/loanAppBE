const errorResponse = (statusCode, error, res) => {
	res.status(statusCode).json({
		success: false,
		message: error,
	});
};

module.exports = errorResponse;
