const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;



app.get("/", (req, res) => {
  res.send("Hello from nodemongo CRUD server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
