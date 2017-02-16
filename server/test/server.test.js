const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');

var dummyTodos = [
    { _id: new ObjectID(), text: 'first' },
    { _id: new ObjectID(), text: 'first', completed: false },
    { _id: new ObjectID(), text: 'first', completedAt: 333 }];

var dummyUsers = [
    { _id: new ObjectID(), email: 'first@first.com', password: '123456', 'tokens': { access: 'auth', token: '' } },
    { _id: new ObjectID(), email: 'second@first.com', password: '234567', 'tokens': { access: 'auth', token: '' } },
    { _id: new ObjectID(), email: 'third@first.com', password: '456789', 'tokens': { access: 'auth', token: '' } }];

dummyUsers[0].tokens.token = jwt.sign({ _id: dummyUsers[0]._id.toHexString(), access: dummyUsers[0].tokens.access }, 'abc123').toString();
dummyUsers[1].tokens.token = jwt.sign({ _id: dummyUsers[1]._id.toHexString(), access: dummyUsers[1].tokens.access }, 'abc123').toString();
dummyUsers[2].tokens.token = jwt.sign({ _id: dummyUsers[2]._id.toHexString(), access: dummyUsers[2].tokens.access }, 'abc123').toString();

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos);
    }).then(() => done());
});
beforeEach((done) => {
    User.remove({}).then(() => {
        return User.insertMany(dummyUsers);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    return done();
                }).catch((e) => done(e));
            });
    });

    it('should not create with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {

    it('should return all todo objects', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                Todo.find().then(() => {
                    expect(res.body.todos.length).toBe(3);
                });
            })
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {

    it('should remove todo objects', (done) => {

        var hexID = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err)
                { return done(err); }

                Todo.find({ _id: hexID }).then((doc) => {
                    expect(doc.type).toBe(undefined);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 400 is invalid', (done) => {

        request(app)
            .delete(`/todos/asd`)
            .expect(400)
            .end(done);
    });
    it('should return 404 if objectID was not found', (done) => {

        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });
});

describe('UPDATE /todos/:id', () => {

    it('should update todo objects', (done) => {

        var hexID = dummyTodos[1]._id.toHexString();
        var body = { text: "update to this", completed: true };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(body.text);
            }).end((err, res) => {

                Todo.find({ text: body.text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(body.text);
                    return done();
                }).catch((e) => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {

        var hexID = dummyTodos[2]._id.toHexString();
        var body = { completed: false };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(body)
            .expect(200)
            .end(() => {

                Todo.find({ _id: hexID }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].completedAt).toBe(null);
                    return done();
                }).catch((e) => done(e));
            });
    });
});
describe('POST /users', () => {

    it('should create a new user', (done) => {
        var email = 'valid@valid.com';
        var password = 'vallidpw';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.find({ email, password }).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe(email);
                    return done();
                }).catch((e) => done(e));
            });
    });

    it('should not create user with an existing email', (done) => {

        var email = dummyUsers[0].email;;
        var password = 'vallidpw';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should not create user without an email', (done) => {

        var password = 'vallidpw';

        request(app)
            .post('/users')
            .send({ password })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should not create user without a password', (done) => {

        var email = dummyUsers[0].email;

        request(app)
            .post('/users')
            .send({ email })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});


describe('GET /users', () => {

    it('should return all user objects', (done) => {

        request(app)
            .get('/users')
            .expect(200)
            .expect((res) => {
                User.find().then(() => {
                    expect(res.body.users.length).toBe(3);
                });
            })
            .end(done);
    });
    });

    describe('GET /users/me', () => 
    {
        it('should return me as a user', (done) => {

            var base = { 'x-auth': dummyUsers[0].tokens.token };

            request(app)
                .get('/users/me')
                .set(base)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).toBe(dummyUsers[0].email);
                })
                .end(done);
        });


        it('should return a 401', (done) => {

            var base = { 'x-auth': '' };

            request(app)
                .get('/users/me')
                .set(base)
                .expect(401)
                .end(done);
        });

    });
