const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port =  3000;





const app = express();
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://Assignment-10:6to4lVU2MypW40yG@cluster0.nhsmrac.mongodb.net/?appName=Cluster0";

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
    // await client.connect();

    const database = client.db('petService');
    const petServices = database.collection('services');
    const ordersCollection = database.collection('orders');
// post services in database
    app.post('/services', async(req,res)=>{
      const service = req.body;
      const createdAt = new Date();
      console.log(service);
      service.createdAt = createdAt;
      const result = await petServices.insertOne(service);
      res.send(result);
    })
// Get services from db

    app.get('/services', async(req,res)=>{
      const {category} = req.query;
      const query = {};
      if(category){
        query.category = category;
      }
      const result = await petServices.find(query).toArray();
      res.send(result);
    })


    app.get('/services/:id', async(req, res)=>{
      const id =req.params;
      const query = {_id : new ObjectId(id)};
      const result = await petServices.findOne(query);
      res.send(result);
      
    })

    app.get('/my-services', async (req, res) => {
      const {email} = req.query;
      const query = {email : email};
      const result = await petServices.find(query).toArray();
      res.send(result);
      
    })

    app.put('/update/:id', async(req, res)=>{
      const data = req.body;
      console.log(data)
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const updatedService = {
        $set: data
      }
      const result = await petServices.updateOne(query, updatedService);
      res.send(result);
    })

    app.delete('/delete/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await petServices.deleteOne(query);
      res.send(result);
    })

    app.post('/orders', async(req, res)=>{
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.status(201).send(result);
      
    })

    app.get('/orders', async(req,res)=>{
      const result = await ordersCollection.find().toArray();
      res.status(200).send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
