var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer  = require('multer');

var Page = require('../models/page.js');
var adminUser = require('../models/admin-users.js');
var Photo = require('../models/photo.js');
var Counter = require('../models/counters.js');
var bcrypt = require('bcrypt-nodejs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});
var upload = multer({ storage: storage }).single('profileImage');

function sessionCheck(request, response, next){
  if(request.session.user)
  next();
  else
  response.status(401).send('Authorization failed');
}

/*Photo Gallery*/
router.post('/profile', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return res.send(err);
    }
    // Everything went fine
    /* create new record in mongoDB*/
    var fullpath = "uploads/"+ req.file.filename;
    Counter.findByIdAndUpdate(
      'pho_id',
      {$inc: { seq: 1} },
      {new: true, upsert: true},
      function(error, counter)   {
        if(error)
          return res.send(error);

        var document = {
          auto_inc_id: counter.seq,
          path: fullpath,
          caption: 'Testing'
        };
        var photo = new Photo(document);
        photo.save(function(err){
          if (err) {
            // An error occurred when uploading
            return res.send(err);
          }
          return res.send('Uploaded successfully !!!');
        });
      });
    })
  });

  router.get('/photos', function(request, response){
    return Photo.find(function(err, photos) {
      if (!err) {
        return response.send(photos);
      } else {
        return response.status(500).send(err);
      }
    });
  });
  /*Photo Gallery*/

  /* Add Admin User */
  router.post('/add-user', function(request, response){
    var salt, hash, password;
    password = request.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
      username: request.body.username,
      password: hash
    });
    AdminUser.save(function(err){
      if(!err){
        return response.send('Admin user successfully created');
      } else {
        return response.send(err);
      }
    });
  });

  //Login
  router.post('/login', function(request, response){
    var username = request.body.username;
    var password = request.body.password;

    adminUser.findOne({username: username}, function(err, data){
      if (err | data === null) {
        return response.status(401).send("User Doesn't exist");
      } else {
        var usr = data;
        if(username == usr.username && bcrypt.compareSync(password, usr.password)){
          request.session.regenerate(function() {
            request.session.user = username;
            return response.send(username);
          });
        } else {
          return response.status(401).send( "Bad Username or Password");
        }
      }
    });
  });

  //Logout
  router.get('/logout', function(request, response){
    request.session.destroy(function(){
      return response.status(401).send('User logged out');
    });
  });

  /* User Routes. */

  router.get('/', function(req, res) {
    res.send('Welcome to the API zone');
  });

  //LIST
  router.get('/pages', sessionCheck, function(request, response) {
    return Page.find(function(err, pages) {
      if (!err) {
        return response.send(pages);
      } else {
        return response.status(500).send(err);
      }
    });
  });

  //CREATE
  router.post('/pages/add', sessionCheck, function(request, response) {
    var page = new Page({
      title: request.body.title,
      url: request.body.url,
      content: request.body.content,
      menuIndex: request.body.menuIndex,
      date: new Date(Date.now())
    });

    page.save(function(err) {
      if (!err) {
        return response.status(200).send(page);
      } else {
        return response.status(500).send(err);
      }
    });
  });

  //UPDATE
  router.post('/pages/update', sessionCheck, function(request, response) {
    var id = request.body._id;
    Page.update({_id: id}, {
      $set: {
        title: request.body.title,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        date: new Date(Date.now())
      }
    }).exec();
    response.send('Page Updated');
  });

  //DELETE
  router.get('/pages/delete/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.remove({_id: id}, function(err){
      return console.log(err);
    });
    return response.send('Page id ' + id + 'has been deleted');
  });

  //READ
  router.get('/pages/view/:id', sessionCheck, function(request, response){
    var id = request.params.id;
    Page.findOne({_id: id}, function(err, page){
      if(err)
      return console.log(err);

      return response.send(page);
    });
  });

  //READ - Front end
  router.get('/pages/details/:url', function(request, response){
    var url = request.params.url;
    Page.findOne({url: url}, function(err, page){
      if(err)
      return console.log(err);

      return response.send(page);
    });
  });


  module.exports = router;
