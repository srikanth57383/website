const mongooes = require('mongoose');

let Registeruser = new mongooes.Schema({
    username:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        unique: true,
    },
    password:{
        type : String,
        required : true,
       
    },
    confirmpassword:{
        type : String,
        required : true,
        
    }
})
module. exports = mongooes.model('Registeruser',Registeruser)