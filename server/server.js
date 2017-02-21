require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var {authenticate} = require('./middleware/authenticate');
var {transporter} = require('./email/email');

var PORT = process.env.PORT;
var app = express();

app.use(bodyParser.json());

//CREATE TODO
app.post('/todos', authenticate, (req, res) => {

    var todo = new Todo({ text: req.body.text, _creator: req.user.id });

    todo.save().then((todos) => {
        res.send(todos);
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

//GET TODOS 
app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user.id }).then((todos) => {
        res.send({ todos });
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

//GET ONE TODO
app.get('/todos/:id', authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findOne({ _id: req.params.id, _creator: req.user.id }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.sendStatus(400);
    }

    Todo.findOneAndRemove({ _id: req.params.id, _creator: req.user.id }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findById(id).then((todos) => {

        if (todos) {

            if (req.user._id.toHexString() !== todos._creator.toHexString()) {
                return res.sendStatus(401);
            }

            Todo.findOneAndUpdate({ _creator: req.user._id, _id: id }, { $set: body }, { new: true }).then((todo) => {

              //  if (todo) {                   
                    res.send({ todo });
              //  }
              //  else {
              //      res.sendStatus(404);
              //  }

            });
        }
        else {
            res.sendStatus(404);
        }

    }).catch((e) => res.status(400).send(e));;

});

//CREATE TODO
app.post('/register', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.verified = false;

    user.save().then(() => {
        return user.generateAuthToken();
    })
        .then((token) => {
            sendVerificationEmail(user.email, token);
            res.header('x-auth', token).send(user);
        }).catch((e) => {
            res.status(400).send(e);
        });
});

//GET ALL USERS 
app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users });
    },
        (e) => {
            res.sendStatus(400);
        }
    );
});

function sendVerificationEmail(email, token) {
    // setup email data with unicode symbols

    let mailOptions = {
        from: 'Oliwer <bananbaszo@gmail.com>', // sender address
        to: `oliwer94@gmail.com`,//`${email}`, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: `<b>Hello world ?</b> <a href="${process.env.SITE_URL}/users/verify/${token}" > verify account</a>`   // html body
    };
    // send mail with defined transport object

    if (process.env.NODE_ENV == 'test') {
        //in test mode I do not send the message
        return Promise.resolve();
    }
    else {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return Promise.reject(error);
                // return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            Promise.resolve();

        });
    }

}

app.get('/users/verify/:id', (req, res) => {

    var token = req.params.id;

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        user.verified = true;
        user.tokens.shift();

        user.save().then((user) => {
            res.status(200).send("User has been verified");
        });


    }).catch((e) => {
        res.sendStatus(401);
    });
});

//GET USER ME 
app.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    })
        .catch((e) => { res.sendStatus(400); });
});

//Delte users/me/logout
app.get('/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => { res.status(400).send(); });
});


app.listen(PORT, () => {
    console.log("Started on port ", PORT);
});

module.exports = { app };