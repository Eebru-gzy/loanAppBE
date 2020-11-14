const express = require('express');
require('dotenv').config() 
const morgan = require("morgan");
const connectDB = require("./config/db");



//load db
connectDB();

//initialize express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//morgan logging in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


const PORT = process.env.PORT || 2222;

app.listen(
	PORT,
	console.log(`Server started in ${process.env.NODE_ENV} at port ${PORT}`)
);
