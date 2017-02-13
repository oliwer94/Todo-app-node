const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require('./../server/model/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../server/model/user');
 
var id = '58a0f0cd6df29108d02fb2ee';
var user_id = '589d79c05f0bc418442abbb7';
/*
if(!ObjectID.isValid(id))
{
    console.log('ID not valid');
}*/

/*Todo.find({
    _id:id
}).then((todos) => {
    console.log('Todos ',todos);
});


Todo.findOne({
    _id:id
}).then((todo) => {
    console.log('Tods ',todo);
});*/

/*Todo.findById(id).then((todo) => {
    if(!todo)
    {return console.log('id not found');}
    console.log('Tods ',todo);
}).catch((e) => console.log(e));
*/

User.findById(user_id).then((user) => {
    if(!user)
    {return console.log('user not found');}

    console.log(JSON.stringify(user,undefined,2));
},
(err) => 
{
    console.log(e);
});

