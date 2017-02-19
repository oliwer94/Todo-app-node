const {ObjectID} = require("mongodb");
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');

const bcrypt = require('bcryptjs');

var password = "123abc";

var dummyTodos = [
    { _id: new ObjectID(), text: 'first' },
    { _id: new ObjectID(), text: 'first', completed: false },
    { _id: new ObjectID(), text: 'first', completedAt: 333 }];

var dummyUsers = [
    { _id: new ObjectID(), email: 'first@first.com', password: 'asd123', 'tokens': { access: 'auth', token: '' } },
    { _id: new ObjectID(), email: 'second@first.com', password: 'asd123', 'tokens': { access: 'auth', token: '' } },
    { _id: new ObjectID(), email: 'third@first.com', password: 'asd123', 'tokens': { access: 'auth', token: '' } }];

dummyUsers[0].tokens.token = jwt.sign({ _id: dummyUsers[0]._id.toHexString(), access: dummyUsers[0].tokens.access }, 'abc123').toString();
dummyUsers[1].tokens.token = jwt.sign({ _id: dummyUsers[1]._id.toHexString(), access: dummyUsers[1].tokens.access }, 'abc123').toString();
dummyUsers[2].tokens.token = jwt.sign({ _id: dummyUsers[2]._id.toHexString(), access: dummyUsers[2].tokens.access }, 'abc123').toString();


const populateTodos = (done) => {
 Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos);
    }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(dummyUsers[0]).save();
    var userTwo = new User(dummyUsers[1]).save();
    var userThree = new User(dummyUsers[2]).save();

    return Promise.all([userOne, userTwo,userThree])
  }).then(() => done());
};

module.exports = {
    populateTodos,populateUsers,dummyTodos,dummyUsers
}