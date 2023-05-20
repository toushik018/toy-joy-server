const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qesst1e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const toysCollection = client.db('toyJoy').collection('toys');

    app.post('/addtoys', async (req, res) => {
      const toy = req.body;

      const result = await toysCollection.insertOne(toy);
      res.send(result);

    });

    app.get('/alltoys', async (req, res) => {
      try {
        const result = await toysCollection.find({}).limit(20).toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to retrieve toys from the database" });
      }
    });



    app.get('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query);
      res.send(result);


    });


    // Load mytoys data

    app.get('/mytoys', async(req, res) => {
      console.log(req.query.sellerEmail);
      let query = {};
      if(req.query?.sellerEmail){
        query = {sellerEmail: req.query.sellerEmail}
      }

      const result = await toysCollection.find(query).toArray();
      res.send(result)

    })

    // app.get('/mytoys/:id', async (req, res) => {
    //   const id = req.params._id;

    //   try {
    //     const result = await toysCollection.find({ id }).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: "Failed to retrieve toys for the user from the database" });
    //   }
    // });





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Toy server is running.....');
});

app.listen(port, () => {
  console.log(`Toy server is running on port ${port}`);
});
