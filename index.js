const express = require("express")
const app = express();


const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json()) // Middleware for convert into json
require('dotenv').config()
const jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
    res.send('ass-10 server is running...');
})
//-----------------------



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tr6mdf5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verfiyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' });
        }
        req.decoded = decoded;
        next();
    })

}

const date = new Date();
const getTime = date.getTime()

async function run() {
    try {
        const serviceCollection = client.db('ass10').collection('services');
        const reviewCollection = client.db('ass10').collection('reviews');

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })



        app.post('/services', async (req, res) => {
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
            // const query = {price: {$gte : 1000}}
            // const query = { price: { $gt: 100, $lt: 300 } }
            // const query = { price: { $eq: 200 } }
            // const query = { price: { $lte: 200 } }
            // const query = { price: { $ne: 150 } }
            // const query = { price: { $in: [20, 40, 150] } }
            // const query = { price: { $nin: [20, 40, 150] } }
            // const query = { $and: [{price: {$gt: 20}}, {price: {$gt: 100}}] }
            const search = req.query.search;
            console.log(search);
            let query = {}
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }
            }

            const order = req.query.order === 'asc' ? 1 : -1;
            const cursor = serviceCollection.find(query).sort({ price: order });
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            // console.log(service);
            res.send(service)
        })

        //post a single post
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            // console.log(result);
            res.send(result);
        })

        // get all reviews


        // get reviews of specific services
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.service_id) {
                query = {
                    service_id: req.query.service_id
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //get reviews for specifit user/user email
        app.get('/myreviews', verfiyJWT, async (req, res) => {

            const decoded = req.decoded;
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'unauthorized access' })
            }
            let query = {}
            if (req.query.email) {
                query = {
                    user_Email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // delete a review
        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            // console.log(result);
            res.send(result);
        })




        // get single review then update
        app.get('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        app.put('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query, id);
            const review = req.body;
            console.log(review.reviewPost);
            // const option = {upsert:true} ;
            const updateReview = {
                $set: {
                    reviewPost: review.reviewPost
                }
            }
            console.log(updateReview);
            const result = await reviewCollection.updateOne(query, updateReview)
            console.log(result);
            res.send(result);

        })


    }

    finally {

    }

}
run().catch(e => console.log(e.message))








//----------------------
app.listen(port, () => {
    console.log('ass-10 server running on port', port);
})