const User = require('../database/models/user')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' })
			}
			if (!user.checkPassword(password)) {
				console.log('Incorrect password	')
				return done(null, false, { message: 'Incorrect password' })
			}
			User.update({ username: username }, 
				{ online: true },
				(err, user) => {
					if (err) {
						console.log(err)
					}
					else {
						console.log('Set user online')
					}
				})
			return done(null, user)
		})
	}
)

module.exports = strategy
