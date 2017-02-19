
const nodemailer = require('nodemailer');
const {gmail} = require("./../properties/properties");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail.username,// 'bananbaszo@gmail.com',
        pass: gmail.password//'bananbaszo94'
    }
});
module.exports = {
    transporter
};