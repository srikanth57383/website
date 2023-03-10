// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mysql = require("mysql");
// const { query } = require("express");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "view",
// });

// app.use(cors());
// app.use(express.json());
// // parse application/json
// app.use(bodyParser.urlencoded({ extended: true }));

// // //connect to database
// // conn.connect((err) =>{
// //   if(err) throw err;
// //   console.log('Mysql Connected...');
// // });

// //  //-----------------------create api----------------------->
// app.get("/api/get", (req, res) => {
//   const sqlGet = "SELECT * FROM client";
//   db.query(sqlGet, (error, result) => {
//     res.send(result);
//   });
// });
// //<-------------view--------->
// app.get("/api/get/:id", (req, res) => {
//   const {id} = req.params;
//   const sqlGet = "SELECT * FROM client WHERE id = ?";
//   db.query(sqlGet, id,(error, result) => {
//     if (error) {
//       console.log(error)
//     }
//     res.send(result);
//   });
// });

// app.put("/api/put/:id", (req, res) => {
//   const {id} =req.params;
//   const {name,emai,phoneNo,query} = req.body;
//   const sqlUpdate = "UPDATE client  SET name = ?,email=?,phoneNo=?,query=?  WHERE id = ?";
//   db.query(sqlGet, [name,email,phoneNo,query],(error, result) => {
//     if (error) {
//       console.log(error)
//     }
//     res.send(result);
//   });
// });
// //<----------------------------post api--------------------->
// app.post("/api/post", (req, res) => {
//   const { name, email, phoneNo, query } = req.body;
//   const sqlInsert =
//     "INSERT INTO client (name,email,phoneNo,query) VALUES (?,?,?,?)";
//   db.query(sqlInsert, [name, email, phoneNo, query], (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//   });
// });

// // //add new user
// app.get("/", (req, res) => {
//    const sqlInsert = "INSERT INTO client (name,email,phoneNo,query) VALUES ('varsha','gfi@gmail','9999999','KILL')";
//     db.query(sqlInsert,(error, result) => {
//       console.log("error",error);
//       console.log("results",result  );
//       res.send('hello srikanth ');
//     });
// });

// app.listen(5000, () => {
//   console.log("Server running successfully on 5000");
// });

///<---------------------Mongooes---------------------------->


const express = require('express');
const { default: mongoose } = require('mongoose');
const mongooes = require('mongoose');
const Registeruser = require('./model');
const cors = require("cors");
const middleware = require("./middleware");
const jwt = require('jsonwebtoken');


const app = express();
mongoose.connect('mongodb+srv://Srikanth:Srikanth@cluster0.ecee6vq.mongodb.net/?retryWrites=true&w=majority').then(
  () => console.log("DB Connected")
)
app.get("/", (req, res) => {
  res.send('hi srikanth');
})
app.use(express.json());
app.use(cors({ origin: '*' }))

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email })
    if (exist) {
      return res.status(400).send('user Already Exist')
    }
    if (password !== confirmpassword) {
      return res.status(400).send('Passwords are not matching');

    }
    let newUser = new Registeruser({
      username,
      email,
      password,
      confirmpassword
    })
    await newUser.save();
    res.status(200).send('Register Successfully')

  }
  catch (err) {
    console.log(err)
    return res.status(500).send('internal Server Error')
  }

})
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (!exist) {
      return res.status(400).send('User Not Found');
    }
    if (exist.password !== password) {
      return res.status(400).send('Invalid Credentials');
    }
    let playload = {
      user: {
        id: exist.id
      }
    }
    jwt.sign(playload, 'jwtSecret', { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token })
      }
    )
  }
  catch (err) {
    console.log(err);
    return res.status(5000).send('Server Error')

  }
})
app.get('/myprofile', middleware, async (req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send('User Not Found');
    }
    res.json(exist);
  }
  catch (err) {
    console.log(err);
    return res.status(500).send('server Error')
  }
})
app.listen(5000, () => console.log('Server running....'));