import React, { Component } from 'react'
import axios from 'axios'

class ForgotPassword extends Component {
    constructor() {
        super()
        this.state = { email: '' }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log('handleSubmit')
        axios.post('/api/forgot_password', {
          email: this.state.email
        }).then(response => {
          if (response.status === 200) {
            alert("Success.")
          }
          else if (response.status > 400) {
            alert("Something went wrong...\n" + response.data)
          }
        }).catch(error => {
            alert('Find user error:\n' + error);
        })
    }
    
    render () {
        return (
        <div>
            <h1><b>Forgot your password?</b></h1>
            <h4>No worries! Just enter your email address below and we'll send you a password recovery email.</h4>
            <form className="form-horizontal container">
                <div className="form-group">
                    <div className="col-1 col-ml-auto">
                        <label className="form-label" htmlFor="email">Email</label>
                    </div>
                    <div className="col-5 col-mr-auto">
                        <input className="form-input"
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Your email address"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="form-group ">
                    <div className="col-md-5"></div>
                    <button
                        className="btn-success btn-cool col-md-2 col-mr-auto"
                        onClick={this.handleSubmit}
                        type="submit">Recover Password</button>
                </div>
            </form>
        </div>
        )
    }
}

export default ForgotPassword