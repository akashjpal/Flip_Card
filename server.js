const express = require('express');
const bodypar = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const app = express();
// const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.use(bodypar.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(bodypar.json());

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('session'));

mongoose.connect("mongodb://127.0.0.1:27017/memoryGameDB");

const Registeration = new mongoose.Schema ({
  name: String,
  email:String,
  password: String,
  score:String
});
const Contacts = new mongoose.Schema({
  firstname:String,
  lastname:String,
  email:String,
  mobile_no:String,
  message:String
});

Registeration.plugin(passportLocalMongoose);
// Registeration.plugin(findOrCreate);

const User = new mongoose.model("User", Registeration);
const Contact = mongoose.model("Contact",Contacts);
passport.use(User.createStrategy());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


app.get("/", function(req,res){
  res.sendFile(__dirname+"/landing.html");
})

app.get("/login.html",function(req,res){
  res.sendFile(__dirname+"/login.html");
})

app.post("/login.html", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
 

  req.login(user, function(err){
    if (err) {
      console.log(err);
      res.redirect("/login.html");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/index.html");
      });
    }
  });
})

app.post("/Registeration.html",function(req,res){
  const password = (req.body.password);
  console.log(password);
   User.register({username: req.body.username,name:req.body.name}, password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/Registeration.html");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/index.html");
      });
    }
  });
});

app.get("/Registeration.html",function(req,res){
  res.sendFile(__dirname+"/Registeration.html");
})

app.get("/index.html",function(req,res){
  if(req.isAuthenticated()){
  res.sendFile(__dirname+"/index.html");
  }else{
    res.redirect("/Registeration.html");
  }
})

app.post("/submit",function(req,res){
const score = req.body.score;
// console.log(req.user);
User.findById(req.user.id) 
  .exec()
  .then(foundUser => {
    // Handle success
    foundUser.score = score;
    foundUser.save()
    .then(
      res.redirect("/index.html")
    )
  })
  .catch(err => {
    // Handle error
    console.error(err);
  });
// User.findById(req.user.id, (err, foundUser) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else { if (foundUser) {
//         foundUser.score = score;
//         foundUser.save(function(){
//           res.redirect("/index.html");
//         });
//       }
//   }
// });



//  User.findById(req.user.id, function(err, foundUser){
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         foundUser.score = score;
//         foundUser.save(function(){
//           res.redirect("/index.html");
//         });
//       }
//     }
//   });

})


app.get("/contact.html",function(req,res){
  res.sendFile(__dirname+"/Contact.html");
})

app.post("/contact.html",function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var message = req.body.feedback;

  //   let transporter =  nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: "587",
  //   secure:false,
  //   auth: {
  //       user: 'apj752003@gmail.com',
  //       pass: 'lzwfmkgoeiquvroy'
  //   }
  // });

  //  let info =  transporter.sendMail({
  //   from: "apj752003@gmail.com", // sender address
  //   to: email, // list of receivers
  //   subject: "Turf Booking Website Team", // Subject line
  //   html: "<b>Hi! Thanks for Contacting Us! Thank you for your feedback !!</b>", // html body
  // });

  // console.log("Message sent is %s",info.messageId);

    const b5 = new Contact({
    firstname:firstname,
    lastname:lastname,
    email:email,
    mobile_no:mobile,
    message:message
});
b5.save();

res.redirect("/")

})

app.get("/Scoreboard",function(req,res){
  const query = {}; // Empty query object to retrieve all users
const projection = { name: 1, score: 1  }; // Projection to specify the fields to be retrieved
const options = { sort: { score: 1 } }; // Sorting option to sort users by score in descending order

User.find(query, projection, options) // Query for all users with specified projection and sorting
  .then(users => {
        res.render("Scoreboard", {usersWithSecrets: users});
      // console.log('List of users:');
      // users.forEach(user => {
      //   console.log(`Username: ${user.username}, Score: ${user.score}`);
      // });
  })
  .catch(err => {
    console.error(err);
  });
})

app.listen(3000,function(err){
  if(err){
    console.log(err);
  }else{
  console.log("Server has Started on port 3000!");
  }
});