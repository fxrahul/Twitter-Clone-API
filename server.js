const express = require('express')
const app = express()
const port = 3000;
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let Users = require('./Model/users.model');
const Joi = require('joi');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://fxrahul:Killer514@cluster0.se7al.mongodb.net/FakeTwitter?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());

app.use(session({
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.send("Welcome to Twitter Clone API");
});

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
      res.send("Logged Out!");
  })
});
app.get('/users', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(req.session.username){ // CHECKING IF USER ALREADY LOGGED IN THROUGH SESSION MANAGEMENT...
      res.send(`${username} already LoggedIn`);
    }else{
      // CHECK IF USER EXISTS....
      Users.findOne({username : username}, (err, user) => {
          if(err){
            res.send("Something went Wrong");
          }else{
            if(!user){
              res.send(`User ${username} not found!!`);
            }else{
              bcrypt.compare(password, user.password, (err, result) => {
                if(err){
                  res.send("Something went wrong!!");
                }else{
                  if(!result){
                    res.send("Password Wrong");
                  }else{
                    req.session.username = user.username;
                    res.send(`${user.username} found in database!`);
                  }
                }
              })
            }
          }
      });
    }
});

app.post('/users', (req, res) => {
  if(validateUser(req.body)){
      res.send("Please fill all Fields");
  }else{
        //CHECK IF USER EXISTS....
        Users.findOne({username : req.body.username}, (err, user) => {
          if(err){
            res.send("Something went wrong!");
          }else{
            if(user){
              res.send(`${user.username} already exists!!`);
            }else{
              bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                if(err){
                    res.send("Something went wrong!");
                }else{
                      let users = new Users({
                      name : req.body.name,
                      email : req.body.email,
                      username : req.body.username,
                      password : hash,
                    });
                    users.save(function(err, user){
                      if(err){
                          res.send("Error while adding users");
                      }else{
                          res.send(`User ${req.body.name} added succesfully!`);
                      }
                  });
                }
              })
            }
          }
      });
  }
});



function validateUser(formData){
  const username = formData.username;
  const password = formData.password;
  const email = formData.email;
  const name = formData.name;

  const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .min(1)
        .required(),
    password : Joi.string()
        .min(5)
        .required(),
    name : Joi.string()
        .min(1)
        .required(),  
  });
  const {error, value} = schema.validate({username : username, email : email, password : password, name : name});

  return error ? true : false;
}


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected/
  console.log("Connection Established");
});


module.exports = {app};