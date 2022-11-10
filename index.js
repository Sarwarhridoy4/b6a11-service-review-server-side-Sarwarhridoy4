const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
const app = express();
const port = process.env.PORT || 5000;

//middlewires in use

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Weblogic server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//database connection

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9rpk71q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("Weblogic").collection("Services");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/home", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await userCollection.findOne(query);

      res.send(service);
    });
  } finally {
  }
}

run().catch((err) => {
  console.error(err);
});
