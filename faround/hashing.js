const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = "123abc";

/*bcrypt.genSalt(10,(err,salt) => {

    bcrypt.hash(password,salt,(err,hash) =>
    {
        console.log(hash);
    });
});*/

var hashedpassword = '$2a$10$ob.n5rT8APvqs3OvOaNOaOg99PBoSIO6LSth//SVL2frJsaB67sHO';

bcrypt.compare(password,hashedpassword,(err,res) => {
    console.log(res);
});


/*var hash = SHA256(message).toString();

var data =
{
    id: 4
}

var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token,'123abc');
console.log('decoded',decoded);
*/
/*
console.log('Message: ',message);
console.log('Hash: ',hash);

var data =
{
    id: 4
}
var token =
{
    data,
    hash:SHA256(JSON.stringify(data)+"somesecret").toString()
} 


var resultHash= SHA256(JSON.stringify(token.data) + "somesecret").toString();
console.log('Hash: ',resultHash);

if(resultHash === token.hash)
{
    console.log("DATA WASNT CHANGED");
}
else
{console.log("DATA WAS CHANGED");}
*/