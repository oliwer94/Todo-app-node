var fs = require("fs");
const properties = require('properties');

var data = fs.readFileSync("./server/properties/gmail", { encoding: "utf8" });
var options = {
    sections: true,
    comments: ";",
    separators: "=",
    strict: true
};

var obj = properties.parse(data, options);
var gmail = obj.gmail;

module.exports = {gmail};