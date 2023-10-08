const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.x4eccmn.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    // __________Database collection__________
    const treeCollection = client
      .db("leafy-Universe")
      .collection("treeCollection");
    const orderCollection = client.db("orderCollection").collection("orders");

    // __________Trees api_________
    app.get("/trees", async (req, res) => {
      const result = await treeCollection.find().toArray();
      res.send(result);
    });
    // find single tree api get
    app.get("/trees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await treeCollection.findOne(query);
      res.send(result);
    });
    // add tree api post
    app.post("/trees", async (req, res) => {
      const tree = req.body;
      // console.log(tree)
      const result = await treeCollection.insertOne(tree);
      console.log(result);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const order = await orderCollection.find().toArray();
      res.send(order);
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
  res.send("leafy universe");
});

app.listen(port, () => {
  console.log(`listening on port${port}`);
});
