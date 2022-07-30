const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqquk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("food-delivery");
        const foods = database.collection("foods");
        const orders = database.collection("orders");

        // GET API
        app.get('/foods', async (req, res) => {
            const cursor = foods.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        app.get('/getOrders', async (req, res) => {
            const cursor = orders.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        //POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orders.insertOne(order);
            res.json(result);
        });

        app.post('/newFood', async (req, res) => {
            const newFood = req.body;
            const result = await foods.insertOne(newFood);
            res.json(result);
        })

        // DELETE API
        app.delete('/cancelOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello food delivery');
})

app.listen(port, () => {
    console.log('listening to port', port);
})