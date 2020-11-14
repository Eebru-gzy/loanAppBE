const crypto = require('crypto');
const User = require("../models/user");
const errorResponse = require("../utils/errorRes");
const successResponse = require("../utils/success");

// @desc    Register a company
// @route   POST /api/signup
// @access  Public
const signUp = async(req, res) => {
  const {name, email, bvn, phone, password, confirmPass} =req.body;

  try {
    if (!name || !email || !password || !bvn || !phone) {
			return errorResponse(400, "Please fill all fields", res);
    }
    if (password !== confirmPass) {
      return errorResponse(400, "Password does not match", res);
    }
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegexp.test(email)) {
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
    
    const foundUser = await User.findOne({
      where: {
        phone,
      },
    });
    if (foundUser) {
      return errorResponse(
        400,
        "A user with that email and phone number already exist. Please login",
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
    return errorResponse(500, "An error occured!", res);
  }
}


// @desc    Email confirmation
// @route   GET /api/confirm_signup/:confirmToken
// @access  Public
const confirmEmail = async (req, res) => {
  const { confirmToken } = req.params;
  const user = await User.findOne({
		where: {
			emailConfirmToken: confirmToken,
		},
	});
  if (user === null) {
    return errorResponse(400, "Invalid confirmation token", res);
  }
  if (user.emai_isVerified) {
		res.redirect(`https://remi-hr-app.herokuapp.com/confirmemail`);
	}

  user.emai_isVerified = true;
  user.save();
  res.redirect(`https://remi-hr-app.herokuapp.com/confirmemail`);
  res.status(200)
};

module.exports ={ signUp, confirmEmail };