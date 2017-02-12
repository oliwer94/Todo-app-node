var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var PORT = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

//CREATE TODO
app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });

    todo.save().then((todos) => {
        res.send(todos);
    },
        (e) => {
            res.status(400).send(e);
        }
    );
});

//GET TODOS 
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    },
        (e) => {
            res.status(400).send(e);
        }
    );
});

//GET ONE TODO



app.listen(PORT, () => {
    console.log("Started on port ", PORT);
});

module.exports = { app };