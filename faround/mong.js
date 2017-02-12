var newTodo = new Todo({text:'Cook cat',completed:false});
newTodo.save().then((doc) => {
    console.log('Saved ',doc);
}
, (err) => {
    console.log(err);
});



var newUser = new User({email:"asd@asd.com"});
newUser.save().then((doc) => {
    console.log('Saved ',doc);
}
, (err) => {
    console.log(err);
});

var badUser = new User({email:"asd"});
badUser.save().then((doc) => {
    console.log('Saved ',doc);
}
, (err) => {
    console.log(err);
});