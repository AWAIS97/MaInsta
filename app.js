/** @format */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURL } = require("./config/keys");
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected with mongoo DB");
});

mongoose.connection.on("error", (error) => {
  console.log("Connected with mongoo DB", error);
});

require("./models/user");
require("./models/post");
app.use(express.json());
app.use(require("./routers/auth"));
app.use(require("./routers/post"));
app.use(require("./routers/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
