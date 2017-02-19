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
/*var MongoStore = require('connect-mongo')(express);*/

app.use(bodyParser.json());
/*app.use(express.session({
  store: new MongoStore({
    url: process.env.MONGODB_URI
  }),
  secret: jwt.sign(new Date().getTime(),'s7fzdfsh9df23')
}));*/


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
    user.verified = false;

    user.save().then(() => {
        return user.generateAuthToken();
    })
        .then((token) => {
           sendVerificationEmail(user.email,token);
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

function sendVerificationEmail(email,token)
{
    // setup email data with unicode symbols
    
    let mailOptions = {
        from: 'Oliwer <bananbaszo@gmail.com>', // sender address
        to: `oliwer94@gmail.com`,//`${email}`, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: `<b>Hello world ?</b> <a href="http://localhost:3000/users/verify/${token}" > verify account</a>`   // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return Promise.reject(error);
       // return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    Promise.resolve();
});

}

app.get('/users/verify/:id', (req,res) => {

     var token = req.params.id;

    User.findByToken(token).then((user) =>
    {
        if(!user)
        {
            return Promise.reject();
        } 
        user.verified  = true;
        user.tokens.shift();

        user.save().then((user) => {
            res.status(200).send("User has been verified");
        });        


    }).catch((e) => {
        res.sendStatus(401);
    });   
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
app.get('/users/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => { res.status(400).send();});
});


app.listen(PORT, () => {
    console.log("Started on port ", PORT);
});

module.exports = { app };