const {MongoClient, ObjectID} = require('mongodb');

/*object destructring
var user = {name:'Oliwer', age:25};

var {name}= user;
*/
console.log(obj);
req

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server: ' + err);
    }
    console.log('Connected to MongoDB');

    /*db.collection('Todos').insertOne(
        { text: 'something', completed: false }, (err, result) => {

            if (err) {
                return console.log('unable to insert todo', err);
            }

            console.log(JSON.stringify(result.ops));

        });*/

        //insert into Users name age location

       /* db.collection('Users').insertOne(
            {
                name:"Name",
                age:22,
                location:"CPH"
            },
            (err,result) => 
            {
                if(err)
                {
                    return console.log('Unable to instert into Users: ',err);
                }

                console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
            }
        );*/

    db.close();
});