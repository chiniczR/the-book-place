import React, { Component } from 'react'
import axios from 'axios'
import Payment from 'payment'
const crypto = require('crypto')
const CryptoJS = require('crypto-js')

class Signup extends Component {
	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
			confirmPassword: '',
			email: '',
			firstName: '',
			lastName: '',
			cardNum: '',
			address: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	hashPassword(password, leSalt = null) {
		// alert('--- Inside hashPassword ---\npassword=' + password + '\tleSalt=' + leSalt)
		var salt = leSalt !== null ? leSalt : crypto.randomBytes(16).toString('base64');
		// alert('salt = ' + salt)
		var hash = CryptoJS.PBKDF2(password, salt).toString();
		// alert('hash = ' + hash)

		return {
			salt: salt,
			hash: hash
		};
  	}

	handleSubmit(event) {
		console.log('sign-up handleSubmit, username: ')
		console.log(this.state.username)
		event.preventDefault()
		if (!this.validateEmail(this.state.email)) {
			alert("Please enter a valid email address")
			return
		}
		var lePass = this.hashPassword(this.state.password)
		var pswd = lePass.hash
		var salt = lePass.salt.toString('base64');

		//request to server to add a new username/password
		axios.post('/user/', {
			username: this.state.username,
			password: pswd,
			passSalt: salt,
			role: 'client',
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			cardNum: this.state.cardNum,
			address: this.state.address
		})
			.then(response => {
				console.log(response)
				if (!response.data.errmsg) {
					alert('Sign up successful. Go to the \'login\' page to log in.')
					this.setState({ //redirect to login page
						redirectTo: '/login'
					})
				} else {
					alert('This username is already taken.')
				}
			}).catch(error => {
				console.log('signup error: ')
				console.log(error)

			})
	}

	clearNumber(value = '') {
		return value.replace(/\D+/g, '')
	}

	formatCreditCardNumber(value) {
	  if (!value) {
	    return value
	  }

	  const issuer = Payment.fns.cardType(value)
	  const clearValue = this.clearNumber(value)
	  let nextValue

	  switch (issuer) {
	    case 'amex':
	      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
	        4,
	        10
	      )} ${clearValue.slice(10, 15)}`
	      break
	    case 'dinersclub':
	      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
	        4,
	        10
	      )} ${clearValue.slice(10, 14)}`
	      break
	    default:
	      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
	        4,
	        8
	      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
	      break
	  }

	  return nextValue.trim()
	}
	validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

render() {
	return (
		<div className="SignupForm">
			<h4>Sign up</h4>
			<form className="form-horizontal">
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="username">Username</label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							value={this.state.username}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="password">Password: </label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder="Password"
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="Name">Name: </label>
					</div>
					<div className="col-3 col-mr-auto">
						<div class="row">
							<div class="col-6">
								<input className="form-input"
									placeholder="First Name"
									type="text"
									name="firstName"
									value={this.state.firstName}
									onChange={this.handleChange}
								/>
							</div>
							<div class="col-6">
								<input className="form-input"
									placeholder="Last Name"
									type="text"
									name="lastName"
									value={this.state.lastName}
									onChange={this.handleChange}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="password">Email: </label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder="Email address"
							type="text"
							name="email"
							value={this.state.email}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="address">Address: </label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder="Shipping/delivery address"
							type="text"
							name="address"
							pattern=",#-/ !@$%^*(){}|[]\\"
							value={this.state.address}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="col-1 col-ml-auto">
						<label className="form-label" htmlFor="address">Card number: </label>
					</div>
					<div className="col-3 col-mr-auto">
						<input className="form-input"
							placeholder="Credit card number"
							type="text"
							name="cardNum"
							value={this.state.cardNum}
							pattern="[\d| ]{16,22}"
							format={this.formatCreditCardNumber}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div class="container" style={{ fontSize: 'small', width: '30%', textAlign: 'left' }}>
					<p>Please note that:</p>
					<ul style={{ marginTop: '-1%' }}>
						<li>All new users are registered as clients.</li>
						<li>If you are a new supplier or employee, contact an admin to have your role updated.</li>
						<li>The information you have entered can be changed later, except your username.</li>
					</ul>
				</div>
				<div className="form-group ">
					<div className="col-7"></div>
					<button
						className="btn btn-primary col-1 col-mr-auto"
						onClick={this.handleSubmit}
						type="submit"
					>Sign up</button>
				</div>
			</form>
		</div>
	)
}
}

export default Signup
