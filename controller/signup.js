const crypto = require('crypto');
const User = require("../models/user");
const errorResponse = require("../utils/errorRes");
const successResponse = require("../utils/success");


const signUp = async(req, res) => {
  const {name, email, bvn, phone, password} =req.body;

  try {
    if (!name || !email || !password || !bvn || !phone) {
			return errorResponse(400, "Please fill all fields", res);
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

    const message = `Hello ${name},<br><br>To verify your email address (${email}), Please
        <a href="${signupConfirmUrl}"> Click here</a> OR <br><br> Copy and paste the link below in your browser <br>
        <a href="${signupConfirmUrl}">${signupConfirmUrl}</a>
        <br><br>Thank you, <br>REMI`;
    const subject = "Email Confirmation";

    const newCompany = await Company.create({
      name,
      email,
      password,
      logo,
      confirm_token: confirmToken,
      email_verified: false,
    });
    if (newCompany) {
      // send mail and return a response
      sendEmail("no-reply@remi.com", email, newCompany.name, subject, message);

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

module.exports = signUp;