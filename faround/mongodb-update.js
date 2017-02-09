const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server: ' + err);
    }
    console.log('Connected to MongoDB');

    //FindOneAndUpdate
    db.collection('Users').findOneAndUpdate({name:"Jen"},{$inc:{age:+1},  $set:{name:"Lali"}},{returnOriginal:false}).then((res)=>{

        console.log(res);

    });



   // db.close();
});