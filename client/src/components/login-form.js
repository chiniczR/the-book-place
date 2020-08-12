import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
const crypto = require('crypto')
const CryptoJS = require('crypto-js')

class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirectTo: null
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
        event.preventDefault()
        console.log('handleSubmit')
        var salt = "";
        axios.post('/user/find', {
          username: this.state.username
        }).then(response => {
          if (response.status === 200) {
            salt = response.data.leSalt
            var lePass = this.hashPassword(this.state.password, salt)
            var pswd = lePass.hash
            // alert('Hashed pass')
            axios
              .post('/user/login', {
                  username: this.state.username,
                  password: pswd
              })
              .then(response => {
                  // alert('login response: ')
                  // alert(JSON.stringify(response))
                  if (response.status === 200) {
                      // update App.js state
                      this.props.updateUser({
                            loggedIn: true,
                            username: response.data.username,
                            password: document.getElementById('passwordInput').value,
                            userId: response.data._id,
                            firstName: response.data.firstName,
                            lastName: response.data.lastName,
                            role: response.data.role,
                            email: response.data.email,
                            address: response.data.address,
                            cardNum: response.data.cardNum,
                            profile: response.data.profilePic,
                            statusPhrase: response.data.statusPhrase
                      })
                      // update the state to redirect to home
                      this.setState({
                          redirectTo: '/'
                      })
                      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
                        document.getElementById('contactTab').classList.remove('active')
                        if (!document.getElementById('aboutTab').classList.contains('active')) {
                          document.getElementById('aboutTab').classList.add('active')
                        }
                      }
                      alert('Welcome, ' + response.data.firstName + '!')
                  }
              }).catch(error => {
                  alert('Login failed\n' + error);
              })
          }
          else if (response.status === 401) {
            alert("Login unauthorized: invalid passowrd.")
          }
        }).catch(error => {
            alert('Find user error:\n' + error);
        })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div>
                    <h4>Login</h4>
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
                                    placeholder="password"
                                    type="password"
                                    name="password"
                                    id="passwordInput"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group ">
                            <div className="col-7"></div>
                            <button
                                className="btn btn-primary col-1 col-mr-auto"
                                onClick={this.handleSubmit}
                                type="submit">Login</button>
                        </div>
                    </form>
                    <section>
                        <small>Forgot your password? Click <Link to="/forgot-password" >here</Link></small>
                    </section>
                </div>
            )
        }
    }
}

export default LoginForm
