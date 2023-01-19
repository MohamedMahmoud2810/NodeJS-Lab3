const express = require ("express");
const bodyParser = require ("body-parser");
const bodyParserJson = bodyParser.json();
const fs = require("fs");

const app = express();

app.use(bodyParserJson);


let contacts =[];

let settings = {
    contactsLastID:1
};

// get contacts 
app.get("/contacts",function(req,res){
    res.send(contacts);
    
})

// get specific contact 
app.get ("/contacts/:Id",function(req,res){
    let contact = contacts.find(x=>x.Id==req.params.Id);
    res.send(contact);
})

// add contact 
app.post("/contacts",function(req,res){
    req.body.Id = settings.contactsLastID++;
    contacts.push(req.body);
    saveToDB();
    res.send(req.body);
})


//delete contact
app.delete("/contacts/:Id",function(req,res){
    let contactIndex = contacts.findIndex(x=>x.Id==req.params.Id);
    contacts.splice(contactIndex,1)
    saveToDB();
    res.send({success:true,deletedId:req.params.Id});
})

// save contact

function saveToDB (){
    fs.writeFile("contacts.db",JSON.stringify(contacts),function(err){
        if(err){
            console.log(err);
        }
    })

    fs.writeFile("settings.db" , JSON.stringify(settings),function(err){
        if(err){
            console.log(err);
        }
    })


}

function loadFromDB (){
    fs.readFile("contacts.db",function(err,data){
        if(err){
            console.log(err);
        }else{
            contacts = JSON.parse(data);
        }
    })

    fs.readFile("settings.db",function(err,data){
        if(err){
            console.log(err);
        }else{
            settings = JSON.parse(data);
        }
    })
    
}

loadFromDB();




app.listen(8080);