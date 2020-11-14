const sendEmail = async (
	sender_email,
	receiver_email,
	receiver_name,
	subject,
	message
) => {
	try {
		await axios({
			method: "post",
			url: "https://api.sendinblue.com/v3/smtp/email",
			headers: {
				accept: "application/json",
				"api-key": process.env.MAIL_API_KEY,
				"content-type": "application/json",
			},
			data: {
				sender: {
					name: "LoanApp",
					email: sender_email,
				},
				to: [
					{
						email: receiver_email,
						name: receiver_name,
					},
				],
				subject: subject,
				htmlContent: message,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = sendEmail;
