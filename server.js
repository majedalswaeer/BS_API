const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
require('dotenv').config();
server.use(cors());
server.use(express.json());
const mongolink = process.env.Mongo_Link;
//Connecting to mongo data base
mongoose.connect('mongodb://majed:12345@majeddatabases-shard-00-00.lxke3.mongodb.net:27017,majeddatabases-shard-00-01.lxke3.mongodb.net:27017,majeddatabases-shard-00-02.lxke3.mongodb.net:27017/bs_database?ssl=true&replicaSet=atlas-ajtsf6-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }); 


//_____________________________________________________________________________________________SERVERS
//Servers to preform The CRUD operations
server.get('/getseller',getFuncHandler);
server.get('/getbuyers',getbuyersHandler);
server.get('/getseller/:email',sellerDashBoardHandler);
server.post('/book-app/:email',bookAppsHandler);
server.put('/update-app/:email/:id',updateAppsHandler);


//_____________________________________________________________________________________________SELLERS
//Two schemas for both sellers and buyers
const sellerSchema = new mongoose.Schema({
    email:String,
    role:String,
    appointment:[{booker:String,booked:Boolean,pending:Boolean,accepted:Boolean}]
});

const sellerModel = mongoose.model('seller_db', sellerSchema);

//Seeding some information into our models
const odeh = new sellerModel({
    email:'odeh',
    appointment:[{booker:'ahmed',booked:false,pending:false,accepted:false}]
});

const renad = new sellerModel({
    email:'Renad',
    appointment:[{booker:'amjad',booked:false,pending:false,accepted:false}]
});
const majed2 = new sellerModel({
    email:'majedalswaeer2@gmail.com',
    appointment:[{booker:'mohammed',booked:false,pending:false,accepted:false},{booker:'amjad',booked:false,pending:false,accepted:false}]
});

//_____________________________________________________________________________________________BUYERS

const buyerSchema = new mongoose.Schema({
    email:String,
});
const buyerModel= mongoose.model('buyer_db', buyerSchema);

const majed = new buyerModel({
    email:'majedalswaeer69@gmail.com',
});




//_____________________________________________________________________________________________FUNCTIONS

//functions to communicate with our data base
async function getFuncHandler(req,res){
    await sellerModel.find({},function(err,itemsData){
        if (err){
            res.send('error loading sellers')
        } else {
            res.send(itemsData);
        }
    }).clone().catch(function(err){ console.log(err)})

}

async function sellerDashBoardHandler(req,res){
    let name=req.params.email
    await sellerModel.find({email:name},function(err,itemsData){
        if (err){
            res.send('error loading sellers')
        } else {
            res.send(itemsData[0].appointment);
        }
    }).clone().catch(function(err){ console.log(err)})

}


async function getbuyersHandler(req,res){
    await buyerModel.find({},function(err,itemsData){
        if (err){
            res.send('error loading buyers ')
        } else {
            res.send(itemsData);
        }
    }).clone().catch(function(err){ console.log(err)})

}

async function bookAppsHandler(req,res){
    let email=req.params.email
    
    let bodyData={
        booker:req.body.booker,
        pending:req.body.pending,
        accepted:req.body.accepted,
        booked:req.body.booked,  
    }
    await sellerModel.find({email},function(err,itemsData){
        if (err){
            res.send('error loading buyers ')
        } else {
            console.log('www',itemsData)
            itemsData[0].appointment.push(bodyData)
            console.log('wwwafterrr',itemsData)
            itemsData[0].save()
            res.send(itemsData[0]);
        }
    }).clone().catch(function(err){ console.log(err)})
}

async function updateAppsHandler(req,res){
    let email=req.params.email
    let id=req.params.id
    
    let bodyData={
        booker:req.body.booker,
        pending:req.body.pending,
        accepted:req.body.accepted,
        booked:req.body.booked,  
    }
    await sellerModel.find({email},function(err,itemsData){
        if (err){
            res.send('error loading buyers ')
        } else {
            console.log('www',itemsData)
            itemsData[0].appointment.splice(id,1,bodyData)
            console.log('wwwafterrr',itemsData)
            itemsData[0].save()
            res.send(itemsData[0]);
        }
    }).clone().catch(function(err){ console.log(err)})
}


// majed2.save()
// odeh.save()
// renad.save()

// majed.save()




























server.listen(3001,()=>{})
server.get('/', (req, res) => { res.send(`Listining to 3001`) })