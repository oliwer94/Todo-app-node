const mongoose = require('mongoose');
const validator = require('validator');


/*{
    email:'asd@asd.com',
    password: 'BCRIPT HASH',
    tokens:[{
        access:'auth',
        token:'HASH'
    }]
}*/

var User = mongoose.model("User",
    {
        email: {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            unique: true,
            validate: {
                validator: function (value) {
                    //discard some providers
                    validator.isEmail(value);                    
                },
                message:'{VALUE} is not a valid email'
            }
        },
        password: {
            type:String,
            required:true,
            minlength:6
        },
        tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]

    });

module.exports = { User };