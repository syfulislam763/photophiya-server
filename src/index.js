const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 8081;



app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('.'));









const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@photophiyaserver.tbhz3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const customersOrderCollection = client.db(`${process.env.DB_NAME}`).collection("customersOrder");
    const userCollection = client.db(`${process.env.DB_NAME}`).collection("users");



    //create user
    app.post('/createUser', (req, res) => {
        let user = req.body;
        if(user){
            userCollection.findOne({email: user?.email}).then(result => {
                if(!result){
                    userCollection.insertOne(user)
                    .then(data => {
                        res?.send(JSON.stringify({message:"Created Successfully"}));
                    })
                    .then(e => console.log(e?.message))
                }else{
                    res.send(JSON.stringify({message:"exists"}));
                }
            }).catch(e => {console.log(e)})
        }
    });

    // app.get('/login', (req, res) => {
        
    //     console.log(req.params)

    //     console.log(req.query)
    //     userCollection.findOne({email: email})
    //         .then(user => {
    //             if(user){
    //                 if(password === user?.password){
    //                     res.send(JSON.stringify({message: "success"}))
    //                 }else{
    //                     res.send(JSON.stringify({message: "failed"}))
    //                 }
    //             }else{
    //                 res.send(JSON.stringify({message:"doesn't exists"}))
    //             }
    //         }).catch(e => {
    //             res.send(JSON.stringify({message:"Errors occured"}))
    //         })
    // });

    //get users
    app.get('/users', (req, res) => {
        userCollection.find({}).toArray((err, products) => {
            res.send(products);
        })
    });

    //delete user
    app.delete('/deleteUser/:id', (req, res) => {
      
        const deleteMsg = {message: "Deleted Successfully"};
        userCollection.deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                res.send(result?.deletedCount>0?JSON.stringify(deleteMsg):null);
            })
            .catch(e => console.log(e?.message))
    })






    //Update Order Status
    app.put('/updateOrderStatus', (req, res) => {

        let query = {_id: req.query.id};
        // delete req.body._id;
        let updateOrder = { $set: req.body};

        customersOrderCollection.updateOne(query, updateOrder, (err, result) => {
            if(err)console.log(err?.message);
            else res.send(JSON.stringify({message: "Updated successfully"}));
        })
    })

    //get customers order
    app.get('/customersOrder', (req, res) => {
        customersOrderCollection.find({}).toArray((err, products) => {
            res.send(products);
        })
    });



    //add order
    app.post('/order', (req, res) => {
        let order = req.body;
        if(order){
            customersOrderCollection.insertOne(order)
                .then(result => {
                    res.send(JSON.stringify({message:"Created Successfully"}));
                })
                .then(e => console.log(e?.message))
        }
    });

    //delete order
    app.delete('/deleteOrder/:id', (req, res) => {
      
        const deleteMsg = {message: "Deleted Successfully"};
        customersOrderCollection.deleteOne({_id: req.params.id})
            .then(result => {
                res.send(result?.deletedCount>0?JSON.stringify(deleteMsg):null);
            })
            .catch(e => console.log(e?.message))
    })

    //post service
    app.post('/addService', (req, res) => {
        let service = req.body;
        if(service){
            serviceCollection.insertOne(service)
                .then(result => {
                    res.send(JSON.stringify({message:"Created Successfully"}));
                })
                .then(e => console.log(e?.message))
        }
    });


    //get services
    app.get('/services', (req, res) => {
        serviceCollection.find({}).toArray((err, products) => {
                res.send(products);
        })
    });

    //delete service
    app.delete('/deleteService/:id', (req, res) => {
      
        const deleteMsg = {message: "Deleted Successfully"};
        serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                res.send(result?.deletedCount>0?JSON.stringify(deleteMsg):null);
            })
            .catch(e => console.log(e?.message))
    })



});






app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+"/index.html"));
})


app.listen(port, () => {
    console.log(`Photophiya running on ${port} port`)
});