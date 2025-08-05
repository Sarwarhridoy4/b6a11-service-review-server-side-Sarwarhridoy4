const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Weblogic server is running!");
});

// MongoDB URI & Client
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9rpk71q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("Weblogic");
    const servicesCollection = db.collection("Services");
    const reviewsCollection = db.collection("Reviews");

    // 🔹 Get all services
    app.get("/services", async (req, res) => {
      try {
        const services = await servicesCollection.find({}).toArray();
        res.send(services);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch services" });
      }
    });

    // 🔹 Get top 3 services for home
    app.get("/services/home", async (req, res) => {
      try {
        const services = await servicesCollection.find({}).limit(3).toArray();
        res.send(services);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch home services" });
      }
    });

    // 🔹 Get single service by ID
    app.get("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const service = await servicesCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(service);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch service" });
      }
    });

    // 🔹 Add a new service
    app.post("/services", async (req, res) => {
      try {
        const service = req.body;
        const result = await servicesCollection.insertOne(service);
        res.status(201).send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to add service" });
      }
    });

    // 🔹 Add a new review
    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.status(201).send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to add review" });
      }
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

run().catch(console.error);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
