const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const router = require("./routes/api/user");

//load db
connectDB();

//initialize express
const app = express();
const allowedOrigins = [
	"http://localhost:3000",
	"https://needloan.herokuapp.com/",
];
app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin
			// (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				var msg =
					"The CORS policy for this site does not " +
					"allow access from the specified Origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static("loanapp/build"));
}

//morgan logging in dev
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api", router);
app.use("*", (req, res) => {
	res.send("Redirect Route");
});

const PORT = process.env.PORT || 2222;

const server = app.listen(PORT, () =>
	console.log(`Server started in ${process.env.NODE_ENV} at port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
	console.error(err, "Uncaught Exception thrown");
	process.exit(1);
});
