const express = require('express');
const cors = require('cors');


const app = express()
const port = process.env.PORT || 5000;
//middewore
 app.use(cors());
 app.use(express.json())
 require('dotenv').config()

 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-o6iroya-shard-00-00.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-01.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-02.wymoxsw.mongodb.net:27017/?ssl=true&replicaSet=atlas-puyajh-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("toyMarketplace").collection("allCar");
    app.get('/allToy',async(req,res)=>{
        const cursor = database.find();
        const result = await cursor.toArray()
        res.send(result) 
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



 app.get('/',(req,res)=>{
    res.send('coffee making server is runing')
 })

 app.listen(port,()=>{
    console.log(`coffee server is running on port: ${port} `);
 })