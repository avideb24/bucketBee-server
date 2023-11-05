const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://bucketbee:UZzBDK1UXNWbaPtU@cluster0.em2vhup.mongodb.net/?retryWrites=true&w=majority`;


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

    const blogCollection = client.db("BucketBee").collection("blogs");

    // blog add
    app.post('/blogs', async(req, res)=> {
      const {title, photo, shortDescription, longDescription, category } = req.body;
      const timeStamp = new Date();
      const blog = {title, photo, shortDescription, longDescription, category, date: timeStamp };
      // console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    })

    // blog get
    app.get('/blogs', async(req, res)=> {
      const result = await blogCollection.find().toArray();
      res.send(result);
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


app.get('/', (req, res)=> {
    res.send('BucketBee Server Is Running Successfully!!!')
})
app.listen(port, ()=>{
    console.log('Port: ' , port);
})