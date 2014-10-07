var mongoose = require('mongoose');

mongoose.connect("mongodb://" + (process.env.IP || 'localhost') + '/test');
console.log('connected!');

var testSchema = new mongoose.Schema({
    name: String,
    age: Number,
    DOB: Date,
    isAlive: Boolean
});

var test = mongoose.model('test', testSchema);

var trial = new test({
    name : 'John Doe',
    age : 23,
    DOB : '09/17/2014',
    isAlive : true
});

trial.save( function(err, data){
    if (err) console.log(err);
    console.log("Saved: ",  data);
});
