const express = require('express');
const app=express();
const cors=require('cors')
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port =process.env.port||3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster5070.oxrvsh3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster5070`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const plantcollection=client.db("plant_tracker").collection("plantcollection");
    app.post('/plants',async(req,res)=>{
        const plants=req.body
        const result=await plantcollection.insertOne(plants)
        res.send(result)
        console.log(plants)
    })
    app.get('/plants',async(req,res)=>{
      const result=await plantcollection.find().toArray()
      res.send(result)
    })

    app.get('/plants/:id',async(req,res)=>{
      const id=req.params.id
      const selectedid={_id:new ObjectId(id)}
      const result=await plantcollection.findOne(selectedid)
      res.send(result)
    })

    app.patch('/update/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const updatedoc={
        $set:req.body
      }
      const result=await plantcollection.updateOne(filter,updatedoc)
      res.send(result)
    })

    app.delete('/plants/:id',async(req,res)=>{
      const id=req.params.id
      const selectedid={_id:new ObjectId(id)}
      const result=await plantcollection.deleteOne(selectedid);
      res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("plant care server")
})
app.listen(port,()=>{console.log(`the server is running at ${port}`)})
