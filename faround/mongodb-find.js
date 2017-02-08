const {MongoClient, ObjectID} = require('mongodb');

/*object destructring
var user = {name:'Oliwer', age:25};

var {name}= user;
*/

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server: ' + err);
    }
    console.log('Connected to MongoDB');

  /*  db.collection('Todos').find({completed: false}).toArray().then((docs) => 
    {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>
    {
        console.log('Unable to fetch Todos. ',err);
    });


    db.collection('Todos').find().count().then((count) => 
    {
        console.log('Todos count: ',count);
    },(err)=>
    {
        console.log('Unable to fetch Todos. ',err);
    });
*/

    db.collection('Users').find({name:"Oliwer"}).toArray().then(
        (docs) =>{console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));},
        (err) => {
            console.log('Unable to fetch Todos. ',err);
        }
    );
    then.

    db.close();
});