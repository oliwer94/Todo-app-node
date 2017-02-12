const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

var dummyTodos = [{text:'first'},{text:'first'},{text:'first'}];



beforeEach((done) => {
    Todo.remove({}).then(() =>
    {   
        return Todo.insertMany(dummyTodos);         
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
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
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
            .expect((res) =>{
                 Todo.find().then(() => {
                    expect(res.body.todos.length).toBe(3);
                    done();
                });
            })
            .end(done);
    });
});