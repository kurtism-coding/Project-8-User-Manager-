const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect mongoose to our database
mongoose.connect('mongodb://localhost/user_manager');
let db = mongoose.connection;

// Check Connection
db.once('open', function(){
    console.log('Connected to MongoDb');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// Init app
const app = express();

//Bring in Models
let User = require('./models/user');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        } else{
            res.render('index', {
                title: 'Users',
                users: users,
            });
        }
    });
});

// Get Single User
app.get('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        res.render('user', {
            user: user
        });
    });
});

// Add Route
app.get('/users/add', function(req, res){
    res.render('add_user', {
       title: 'Add User'
    });
});

// Add Submit POST Route
app.post('/users/add', function(req, res){
    let user = new User();
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;

    user.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

// Update Submit POST Route
app.post('/users/edit/:id', function(req, res){
    let user = {};
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;

    let query = {_id:req.params.id};

    User.update(query, user, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

// Load Edit Form
app.get('/user/edit/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        res.render('edit_user', {
            title:'Edit User',
            user: user
        });
    });
});

// Delete User
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id}

    User.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

// Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000...')
});
