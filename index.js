const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
//middewore
app.use(cors());
app.use(express.json());
require("dotenv").config();


const uri = `mongodb://toyMarketplace:33WbCeGUAMMdgk8w@ac-o6iroya-shard-00-00.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-01.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-02.wymoxsw.mongodb.net:27017/?ssl=true&replicaSet=atlas-puyajh-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("toyMarketplace").collection("allCar");
    app.get("/allToy", async (req, res) => {
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/Toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.findOne(query);
      res.send(result);
    });
    app.get("/allToys/:category", async (req, res) => {
      console.log(req.params.id);
      const toys = await database.find({
          status: req.params.category
        })
        .toArray();
      res.send(toys);
    });
    
    app.post("/post-toys", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      console.log(body);
      const result = await database.insertOne(body);
      if (result?.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "can not insert try again leter",
          status: false,
        });
      }
    });

    app.get("/myToys/:email", async (req, res) => {
      console.log(req.params.id);
      const jobs = await database.find({
          seller_email: req.params.email,
        })
        .toArray();
      res.send(jobs);
    });

    app.get("/toySearchText/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await database.find({
          $or: [
            { toy_name: { $regex: searchText, $options: "i" } },
            { seller_email: { $regex:searchText, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee making server is runing");
});

app.listen(port, () => {
  console.log(`coffee server is running on port: ${port} `);
});
