const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server: ' + err);
    }
    console.log('Connected to MongoDB');

    //DeleteMany

   /* db.collection('Todos').deleteMany({text:'eat lunch'}).then(
        (result) => 
        {
            console.log(result);
        }
    );*/
    //DeleteOne
  /*  db.collection('Todos').deleteOne({text:"eat lunch"}).then((result) =>
        {
            console.log(result);
        }
    );*/
    //findOneAndDelete
    db.collection('Users').findOneAndDelete({_id:new ObjectID('589a55920fe6b831281c34d7')})
    .then((result) => 
    {
        console.log(result);
    });

   // db.close();
});