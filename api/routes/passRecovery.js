'use strict';

var mongoose = require('mongoose')
var User = mongoose.model('User')
var path = require('path')
var async = require('async')
var crypto = require('crypto')
var _ = require('lodash')
var hbs = require('nodemailer-express-handlebars')
var email = process.env.MAILER_EMAIL_ID || 'recovery.thebookplace@gmail.com'
var pass = process.env.MAILER_PASSWORD || 'thebookpalace123'
var nodemailer = require('nodemailer');
var Handlebars = require('handlebars');
var host = '172.18.0.5'


var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});


var handlebarsOptions = {
  viewEngine: {
    handlebars: Handlebars,
    extName: '.html',
    partialsDir: path.resolve('./public/'),
    layoutsDir: path.resolve('./public/'),
    defaultLayout: 'forgot-password-email.html',
  },
  viewPath: path.resolve('./public/'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

/*
** Forgot Password
*/
exports.forgot_password = function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email
        }).exec(function(err, user) {
          if (user) {
            console.log('There was a problem looking for the user.\nThe err: ' + err + '\nThe user' + JSON.stringify(user))
            done(err, user);
          } else {
            console.log('What we got:  ' + req.body.email)
            done('User not found.');
          }
        });
      },
      function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
          var token = buffer.toString('hex');
          console.log('Was there a problem?\nThe err: ' + err + '\nThe user' + JSON.stringify(user))
          done(err, user, token);
        });
      },
      function(user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
          console.log('Was there a problem?\nThe err: ' + err + '\nThe user' + JSON.stringify(user))
          done(err, token, new_user);
        });
      },
      function(token, user, done) {
        var data = {
          to: user.email,
          from: email,
          template: 'forgot-password-email',
          subject: 'Password help has arrived!',
          context: {
            url: 'http://' + host + ':3000/reset-password/' + token,
            name: user.firstName,
            content: 'You requested for a password reset, kindly use the link below to reset your password.'
          }
        };
  
        smtpTransport.sendMail(data, function(err) {
          if (!err) {
            return res.json({ message: 'Kindly check your email for further instructions' });
          } else {
            return done(err);
          }
        });
      }
    ], function(err) {
      console.log('Was there a problem?\nThe err: ' + err)
      return res.status(422).json({ message: err });
    });
  };
  
/*
** Reset Password
*/
exports.reset_password = function(req, res, next) {
    const token = req.body.token.split('#')[0]
    console.log('Token: ' + token + '\nCurrent time: ' + Date.now().toString())
      User.findOne({
      reset_password_token: token,
      reset_password_expires: {
        $gte: Date.now()
      }
    }).exec(function(err, user) {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
            console.log('matched passwords\nUser = ' + JSON.stringify(user))
          user.password = req.body.newPassword;
          user.passSalt = req.body.newSalt
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.save(function(err) {
            if (err) {
              return res.status(422).send({
                message: err
              });
            } else {
              var data = {
                to: user.email,
                from: email,
                template: './reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                  name: user.firstName,
                  content: 'Just letting you know that, as per your request, your password has been reset. You can still use the link you received on the "Forgot Password" email to set your password.'
                }
              };
  
              smtpTransport.sendMail(data, function(err) {
                if (!err) {
                  return res.json({ message: 'Password reset' });
                } else {
                    console.log('Err: ' + err)
                  return res.status(500).send({message: 'Something went wrong'});
                }
              });
            }
          });
        } else {
          return res.status(422).send({
            message: 'Passwords do not match'
          });
        }
      } else {
          console.log('Password reset token is invalid or has expired.\nErr: ' + err)
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }
    });
  };