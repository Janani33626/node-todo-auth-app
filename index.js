const todos = require("./routes/todos");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signIn");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { application } = require("express");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/todos", todos);
app.use("/api/signup", signUp);
app.use("/api/signin", signIn);

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("welcome to TO-DO's API.");
});

app.listen(port, () => {
  console.log(`server running at port ${port}.`);
});

mongoose
  .connect(connection_string, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Succesfull");
  })
  .catch((error) => {
    console.log("MongoDB Connection failed:", error.message);
  });
