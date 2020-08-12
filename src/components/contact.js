import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class Contact extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            subject: '',
            content: ''
        }
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
        console.log('handleMessageSubmit')
        // alert('Message to send:\n{ name: \"' + this.state.name + '\",\nemail: \"' +
        //       this.state.email + '\",\nsubject: \"' + this.state.subject + '\",\n' +
        //       'content: ' + this.state.content + ' }')
        axios
            .post('/api/message', {
                name: this.state.name,
                email: this.state.email,
                subject: this.state.subject,
                content: this.state.content
            })
            .then(response => {
                //alert('contact response: ')
                //alert(response)
                if (response.status === 200) {
                    alert('Your message was received, ' + this.state.name + '.\nWe\'ll get back to you ASAP!')
                }
            }).catch(error => {
                alert("An error occured:\n" + error.toString())
            })
    }

    componentDidMount() {
      if (!document.getElementById('contactTab').classList.contains('active')) {
    		document.getElementById('contactTab').classList.add('active')
    	}
    	document.getElementById('aboutTab').classList.remove('active')
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div>
                    <div class="container-flex">
                      <div class="row" style={{ textAlign: 'left', left: 0 }}>
                        <div class="col-lg-5" style={{ textAlign: 'left', left: 0, marginLeft: '2%' }}>
                          <div class="container" style={{ textAlign: 'left', alignSelf: 'left' }}>
                          <h4 style={{ position: 'relative', marginLeft: '10%' }}>Send us a message and we will get back to you ASAP!</h4>
                            <form className="form-horizontal" style={{ marginLeft: '15%', width: '200%' }}>
                                <div className="form-group">
                                    <div className="col-1">
                                        <label className="form-label" htmlFor="name">Name</label>
                                    </div>
                                    <div className="col-3">
                                        <input className="form-input"
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Name"
                                            value={this.state.name}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-1">
                                        <label className="form-label" htmlFor="email">Email</label>
                                    </div>
                                    <div className="col-3">
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
                                    <div className="col-1">
                                        <label className="form-label" htmlFor="subject">Subject</label>
                                    </div>
                                    <div className="col-3">
                                        <input className="form-input"
                                            placeholder="Subject"
                                            type="text"
                                            name="subject"
                                            value={this.state.subject}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-1">
                                        <label className="form-label" htmlFor="message">Message</label>
                                    </div>
                                    <div className="col-3">
                                        <textArea className="form-input"
                                            placeholder="Your message"
                                            type="text"
                                            style={{ height: '150%' }}
                                            name="content"
                                            value={this.state.content}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-3"></div>
                                    <button
                                        className="btn btn-primary col-1"
                                        style={{ marginTop: '3%' }}
                                        onClick={this.handleSubmit}
                                        type="submit">Send</button>
                                </div>
                            </form>
                          </div>
                        </div>
                        <div class="col-lg-1" style={{ textAlign: 'right', marginLeft: '3%' }}>
                          <div class="vl"></div>
                        </div>
                        <div class="col-lg-6" style={{ textAlign: 'left', marginLeft: '-5%' }}>
                          <div class="container">
                            <img src="images/contact.jpg" style={{ maxHeight: '500px' }} alt="Contact"/>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            )
        }
    }
}

export default Contact
