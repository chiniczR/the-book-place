const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')

router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', (req, res) => {
    console.log('user signup');
    const pic = 'default' + (Math.floor(Math.random() * 5) + 1) + '.jpg'
    const phrase = 'I\'m on The Book Place!'
    const { username, password, passSalt,
      role, email, firstName, lastName,
      cardNum, address } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password,
                passSalt: passSalt,
          		role: role,
          		email: email,
          		firstName: firstName,
          		lastName: lastName,
          		cardNum: cardNum,
                address: address,
                statusPhrase: phrase,
                profilePic: pic
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post('/find', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('user find');
  //console.log('req.body = ' + JSON.stringify(req.body))
  const username = req.body.username
  User.findOne({ username: username }, (err, user) => {
      if (err) {
          console.log('User.js post error: ', err)
      } else if (user) {
          console.log('Found user salt: ' + user.passSalt)
          var salt = user.passSalt
          res.json({
              leSalt: salt
          })
      }
      else {
        error: `Sorry, no user with the username: ${username}`
      }
  })
});

router.post(
    '/login',
    function (req, res, next) {
        console.log('routes/user.js, login, ')//req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in')//, req.user);
        var userInfo = {
            username: req.user.username,
            userId: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role,
            profilePic: req.user.profilePic,
            address: req.user.address,
            email: req.user.email, 
            cardNum: req.user.cardNum,
            statusPhrase: req.user.statusPhrase
        };
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        User.update({ username: req.user.username }, 
            { online: false },
            (err, user) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Set user offline')
                }
            }
        )
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

router.get('/all', function (req, res, next) {
    console.log('------------------ user find -------------------');
    console.log('req.body = ' + JSON.stringify(req.body))
    User.find((err, users) => {
        if (err) {
            console.log('User.js get all error: ', err)
        } else if (users) {
            console.log('Found users')
            res.json(users)
        }
        else {
          error: `Sorry, no users`
        }
    })
})

router.post('/update', function(req,res,next) {
    console.log('------------------ user update -------------------');
    console.log('req.body = ' + JSON.stringify(req.body))
    const user = req.body
    if (user.altPass) {
        User.update(
        { username: user.username },
        { firstName: user.firstName, lastName: user.lastName, role: user.role, 
        address: user.address, email: user.email, cardNum: user.cardNum,
        passSalt: user.passSalt, password: user.password, profilePic: user.profilePic, statusPhrase: user.statusPhrase },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    }
    else {
        User.update(
        { username: user.username },
        { firstName: user.firstName, lastName: user.lastName, role: user.role, 
        address: user.address, email: user.email, cardNum: user.cardNum, profilePic: user.profilePic, statusPhrase: user.statusPhrase },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
    }
})

router.post('/delete', function(req,res,next) {
    console.log('------------------ user delete -------------------');
    console.log('req.body = ' + JSON.stringify(req.body))
    const uname = req.body.username
    User.deleteOne({ username: uname }, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
})

module.exports = router
