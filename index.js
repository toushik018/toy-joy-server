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
        await client.connect();

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



          app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
      
            try {
              const toy = await toysCollection.findOne({ _id: new ObjectId(id) });
              res.send(toy);
            } catch (error) {
              console.log(error);
              res.status(500).json({ message: "Failed to retrieve toy from the database" });
            }
          });
          
          

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
