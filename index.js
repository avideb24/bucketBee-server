const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const usersCollection = client.db("BucketBee").collection("users");
    const blogCollection = client.db("BucketBee").collection("blogs");
    const wishlistCollection = client.db("BucketBee").collection("wishlist");
    const commentCollection = client.db("BucketBee").collection("comments");

    // users post
    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // users get
    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    // blog add
    app.post('/blogs', async(req, res)=> {
      const {title, photo, shortDescription, longDescription, category,  userName, userPhoto } = req.body;
      const timeStamp = new Date();
      const blog = {title, photo, shortDescription, longDescription, category, userName, userPhoto,  date: timeStamp };
      // console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    })

    // blog get
    app.get('/blogs', async(req, res)=> {
      const result = await blogCollection.find().toArray();
      res.send(result);
    })

    // single blog get
    app.get('/blogs/:id', async(req, res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await blogCollection.findOne(query);
      res.send(result)
    })
    
    // wishlist add
    app.post('/wishlist', async(req, res) => {
      const wishlistedBlog = req.body;
      const result = await wishlistCollection.insertOne(wishlistedBlog);
      res.send(result);
    })

    // wishlist get
    app.get('/wishlist', async(req, res) => {
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email};
      }
      const result = await wishlistCollection.find(query).toArray();
      res.send(result);
    })

    // wishlist delete
    app.delete('/wishlist/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    })


    // comment post
    app.post('/comments', async(req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    })

    // comments get
    app.get('/comments', async(req, res) => {
      const result = await commentCollection.find().toArray();
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