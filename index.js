const express = require('express');
require('dotenv').config() 
const morgan = require("morgan");
const connectDB = require("./config/db");
const router = require('./routes/api/user');



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


app.use('/api', router);



const PORT = process.env.PORT || 2222;

const server = app.listen(
	PORT, ()=>
	console.log(`Server started in ${process.env.NODE_ENV} at port ${PORT}`)
);


// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

process
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });