require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var {authenticate} = require('./middleware/authenticate');

var PORT = process.env.PORT;
var app = express();

app.use(bodyParser.json());

//CREATE TODO
app.post('/todos', (req, res) => {

    var todo = new Todo({ text: req.body.text });

    todo.save().then((todos) => {
        res.send(todos);
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

//GET TODOS 
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});



//GET ONE TODO
app.get('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findById(req.params.id).then((todo) => {
        if (todo) {
            res.send({ todo });
        }
        else {
            res.sendStatus(404);
        }
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

app.delete('/todos/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if (todo) {
            res.send({ todo });
        }
        else {
            res.sendStatus(404);
        }
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID is invalid");
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (todo) {
            res.send({ todo });
        }
        else {
            res.sendStatus(404);
        }

    }).catch((e) => res.status(400).send(e));

});


//CREATE TODO
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    })
        .then((token) => {
            res.header('x-auth', token).send(user)
        }).catch((e) => {
            res.status(400).send(e);
        });
});

//GET USERS 
app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users });
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

//GET USER ME 
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);


    User.findByCredentials(body.email, body.password).then((user) => {       
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });        
    })
        .catch((e) =>  {res.sendStatus(400);});
});

//Delte users/me/logout
app.delete('/users/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => { res.status(400).send();});
});


app.listen(PORT, () => {
    console.log("Started on port ", PORT);
});

module.exports = { app };