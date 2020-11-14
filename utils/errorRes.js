const errorResponse = (statusCode, error, res) => {
	res.status(statusCode).json({
		success: false,
		error: error,
	});
};

module.exports = errorResponse;
