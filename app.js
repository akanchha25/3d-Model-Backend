const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();

const Routes = require('./routes/route')



//mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected Successfully!"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());


app.use("/api/v1", Routes);


app.listen(4500, () => {
  console.log("Server is running!");
});
