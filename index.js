const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tekyyoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productCollection = client.db('productItemsdb').collection('products');
    const userCollection = client.db('productItemsdb').collection('userProductItem');
    const categoryCollection = client.db('productItemsdb').collection('category');




    app.get('/category', async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result)
})



    // first get those all product 
    app.get('/product', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log('pagination', page, size);
      const id = await productCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(id);
    });
    // get to all query product of base on _id 
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result)
    })

    // pagination
    app.get('/productCount', async (req, res)=>{
      const count = await productCollection.estimatedDocumentCount();
      res.send({count})
    })


    // cart item to add 
    app.post('/carts', async (req, res) => {
      const item = req.body;
      console.log(item.email);
      const cursor = await userCollection.insertOne(item)
      res.send(cursor)
    })
    // get the cart item
    app.get('/carts', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })
    app.get('/carts/:id', async (req, res) => {
      const id = req.body;
      const email = id.email;
      const result = await userCollection.findOne(email);
      res.send(result)
})



    // delete one of usercollection 
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.get('/', async (req, res) => {
 res.send('Kitty Shops is ready now');
})
app.listen(port, () => {
 console.log(`kitty shops is running on port ${port}`);
})