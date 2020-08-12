import React, { Component } from 'react'
import axios from 'axios'
const crypto = require('crypto')
const CryptoJS = require('crypto-js')

class ResetPassword extends Component {
    constructor() {
        super()
        this.state = { newPassword: '', verifyPassword: '' }
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
        event.preventDefault()
        console.log('handleSubmit')
        var token = this.props.match.params.token
        var lePass = this.hashPassword(this.state.newPassword)
		var pswd = lePass.hash
        var salt = lePass.salt.toString('base64');
        var lePass = this.hashPassword(this.state.verifyPassword, salt)
		var verify = lePass.hash
        axios.post('/api/reset_password', {
          newPassword: pswd,
          verifyPassword: verify,
          newSalt: salt, 
          token: token
        }).then(response => {
          if (response.status === 200) {
            alert("Success")
          }
          else if (response.status > 400) {
            alert("Something went wrong...\n" + response.data)
          }
        }).catch(error => {
            alert('Error:\n' + error);
        })
    }
    
    render () {
        return (
        <div>
            <h1><b>You're one step away from your recovering your account!</b></h1>
            <h4>Just enter a new password, verify it, and click reset password.</h4>
            <h5 className="invisible">Token: {this.props.match.params.token}</h5>
            <form className="form-horizontal container">
                <div className="form-group">
                    <div className="col-2 col-ml-auto">
                        <label className="form-label" htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="col-5 col-mr-auto">
                        <input className="form-input"
                            type="text"
                            id="newPassword"
                            name="newPassword"
                            placeholder="A new password for your account"
                            value={this.state.newPassword}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-2 col-ml-auto">
                        <label className="form-label" htmlFor="verifyPassword">Verify Password</label>
                    </div>
                    <div className="col-5 col-mr-auto">
                        <input className="form-input"
                            type="text"
                            id="verifyPassword"
                            name="verifyPassword"
                            placeholder="Verify the password you entered above"
                            value={this.state.verifyPassword}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="form-group ">
                    <div className="col-md-5"></div>
                    <button
                        className="btn-success btn-cool col-md-2 col-mr-auto"
                        onClick={this.handleSubmit}
                        type="submit">Reset Password</button>
                </div>
            </form>
        </div>
        )
    }
}

export default ResetPassword