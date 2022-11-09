const express = require("express")
const app = express();


const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json()) // Middleware for convert into json
require('dotenv').config()
const jwt = require('jsonwebtoken');

app.get('/', (req,res)=>{
    res.send('ass-10 server is running...');
})
//-----------------------



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tr6mdf5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection = client.db('ass10').collection('services');
        const reviewCollection = client.db('ass10').collection('reviews');

        app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.send(result);
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            // console.log(services);
            res.send(services);
        });
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            console.log(service);
            res.send(service)
        })

        


    }
    finally{

    }
    
}
run().catch(e=>console.log(e.message))








//----------------------
app.listen(port, ()=>{
    console.log('ass-10 server running on port', port);
})