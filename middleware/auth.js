const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// Set token from Bearer token in header
		token = req.headers.authorization.split(" ")[1];
  } 
  // if (req.cookies.token) {
  //   token = req.cookies.token;
  //   console.log('cookies',token);
	// }
	// Make sure token exists
	if (!token) {
		return res.status(401).json({
			error: "Not authorized to access this resource",
		});
  }
	try {
		// verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			req.user = await User.find({_id: decoded.id});
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).json({
			error: "Not authorized to access this resource",
		});
	}
};
