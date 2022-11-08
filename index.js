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



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tr6mdf5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

    }
    finally{
        
    }
    
}
run().catch(e=>console.log(e.message))








//----------------------
app.listen(port, ()=>{
    console.log('ass-10 server running on port', port);
})