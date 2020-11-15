const crypto = require("crypto");
const User = require("../models/user");
const errorResponse = require("../utils/errorRes");
const sendEmail = require("../utils/sendMail");
const successResponse = require("../utils/success");

// @desc    Register a user
// @route   POST /api/signup
// @access  Public
const signUp = async (req, res) => {
	const { name, email, bvn, phone, password, confirmPass } = req.body;

	try {
		if (!name || !email || !password || !bvn || !phone) {
			return errorResponse(400, "Please fill all fields", res);
		}
		if (password !== confirmPass) {
			return errorResponse(400, "Password does not match", res);
		}
		function validateEmail(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
		if (!validateEmail(email)) {
			return errorResponse(400, "Please enter a valid email", res);
		}
		if (password.length < 8) {
			return errorResponse(400, "Password must be at least 8 characters", res);
		}
		if (password.search(/\d/) == -1) {
			return errorResponse(
				400,
				"Password must contain at least one number",
				res
			);
		}
		if (password.search(/[a-zA-Z]/) == -1) {
			return errorResponse(
				400,
				"Password must contain at least one letter",
				res
			);
		}
		if (password.search(/[^a-zA-Z0-9\@\#\$\&\_\+\.\,\;\:]/) != -1) {
			return errorResponse(
				400,
				"Password may only contain '@', '#', '$', '&', '_', '+' special characters.",
				res
			);
		}

		const foundUser = await User.findOne({ phone }).exec();
		if (foundUser) {
			return errorResponse(
				400,
				"A user with that phone number already exist. Please login",
				res
			);
    }
		// generate confirm token
		const confirmToken = crypto.randomBytes(10).toString("hex");
		// Create signup confirmation url
		const signupConfirmUrl = `${req.protocol}://${req.get(
			"host"
		)}/api/confirm_signup/${confirmToken}`;
		// email message
		const message = `Hello ${name},<br><br>To verify your email address (${email}), Please
        <a href="${signupConfirmUrl}"> Click here</a> <br>
        <br><br>Thank you, <br>Loan App`;
		const subject = "Email Confirmation";

		const newUser = await User.create({
			name,
			email,
			bvn,
			phone,
			password,
			emailConfirmToken: confirmToken,
		});
		if (newUser) {
			// send mail and return a response
			sendEmail("no-reply@loanapp.com", email, newUser.name, subject, message);

			return successResponse(
				201,
				"Account created successfully. Please check your email for confirmation link.",
				res
			);
		}
		return errorResponse(500, "An error occured!", res);
	} catch (error) {
		console.log(error.message);
		return errorResponse(500, error.message, res);
	}
};

// @desc    Email confirmation
// @route   GET /api/confirm_signup/:confirmToken
// @access  Public
const confirmEmail = async (req, res) => {
	const { confirmToken } = req.params;
	const user = await User.findOne({
		emailConfirmToken: confirmToken,
	});
	if (user === null) {
		return errorResponse(400, "Invalid confirmation token", res);
	}
	if (user.email_isVerified) {
		res.redirect(`https://remi-hr-app.herokuapp.com/confirmemail`);
	}

	user.email_isVerified = true;
	user.save();
	res.redirect(`https://remi-hr-app.herokuapp.com/confirmemail`);
	res.status(200);
};


// @desc    Login a user
// @route   POST /api/login
// @access  Public
const Login = async (req, res) => {
	const { phone, password } = req.body;

  try {
    if (!phone || !password) {
			return errorResponse(400, "Please fill all fields.", res);
		}

		const user = await User.findOne({ phone });
		if (!user) {
			return errorResponse(400, `User with phone ${phone} does not exist`, res);
    }
    const confirmPass = await user.comparePassword(password)
		if (!confirmPass) {
			return errorResponse(400, "Either phone or password is incorrect", res);
    }
    if (!user.email_verified) {
			return errorResponse(
				400,
				"Please verify your email. Check your email for verification link.",
				res
			);
		}
  } catch (error) {
    console.log(error);
    return errorResponse(500, "Internal server error", res)
  }
};


// Get token from model, create cookie and send response
const sendTokenResponse = (statusCode, user, model, res) => {
  // Create token
  const token = model.getSignedJwtToken(user.id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: user,
  });
};

module.exports = { signUp, confirmEmail, Login };
