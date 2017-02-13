const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require('./../server/model/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../server/model/user');
 
var id = '58a0f0cd6df29108d02fb2ee';
var user_id = '589d79c05f0bc418442abbb7';

//dont get the docs back
/*Todo.remove({}).then((result) =>
{
    console.log(result);
});*/

//yo get the docs back in resolve
Todo.findByIdAndRemove('58a183298e568e7f24411e1e').then((result) => 
{
    console.log(result);
});

