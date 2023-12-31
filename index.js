const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//meddilwere
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig));

app.use(express.json());

app.use(cors())

console.log(process.env.SP_pass);

app.get("/", (req, res) => {
  res.send("super hero is running");
});

const uri = `mongodb+srv://${process.env.SP_USER}:${process.env.SP_pass}@cluster10.dn0f8be.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("superHero").collection("toys");
    const transformerToys = client.db("superHero").collection("transformer");

    const orderCollection = client.db("superHero").collection("order");

    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.get("/transformer", async (req, res) => {
      const result = await transformerToys.find().toArray();
      res.send(result);
    });

    app.get("/transformer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await transformerToys.findOne(query);
      res.send(result);
    });

    //order

    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const orders = req.body;
      console.log(orders);
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    });
    app.put("/orders/id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDetail = req.body;
      console.log(updateDetail);
      const update = {
        $set: {
          status: updateDetail.status,
        },
      };
      const result = await updateDetail.updateOne(filter, update);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`super hero is running port:${port}`);
});
