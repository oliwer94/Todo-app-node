var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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
            res.sendStatus(400).send(e);
        }
    );
});

//GET TODOS 
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    },
        (e) => {
            res.sendStatus(400).send(e);
        }
    );
});

//GET ONE TODO
app.get('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findById(req.params.id).then((todos) => {
        if (todos) {
            res.send({ todos });
        }
        else {
            res.sendStatus(404);
        }
    },
        (e) => {
            res.sendStatus(400).send(e);
        }
    );
});

app.delete('/todos/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findByIdAndRemove(req.params.id).then((todos) => {
        if (todos) {
            res.send('Item has been removed: '+JSON.stringify(todos,undefined,2) );
        }
        else {
            res.sendStatus(404);
        }
    },
        (e) => {
            res.sendStatus(400).send(e);
        }
    );
});


app.listen(PORT, () => {
    console.log("Started on port ", PORT);
});

module.exports = { app };