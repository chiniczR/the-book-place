const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const User = require('../database/models/user');
const { pass } = require('./localStrategy');

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ')
	console.log(user.username) // the whole raw user object!
	console.log('---------')
	done(null, { _id: user._id })
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	console.log('DeserializeUser called')
	User.findOne(
		{ _id: id },
		(err, user) => {
	      if (err) {
	          console.log('get logged in user error: ', err)
	      } else if (user) {
	          console.log('*** Found user: ' + user.username)
	          done(null,user)
	      }
	  }
	)
})

//  Use Strategies
passport.use(LocalStrategy)

module.exports = passport
