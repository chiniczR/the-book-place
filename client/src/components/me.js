import React, { Component } from 'react'
import axios from 'axios'
import Payment from 'payment'
const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const $ = window.$

const fileServer = 'http://localhost:8080/images/'

class Me extends Component {
    constructor() {
        super()
        this.state = {
            password: null,
            role: null,
            email: null,
            firstName: null,
            lastName: null,
            cardNum: null,
            address: null,
            profilePic: null,
            statusPhrase: null,
            posCount: 0,    // Positive votes on the user's posts
            negCount: 0,    // Negative votes on the user's posts
            groups: null,   // All groups available
            jrs: null, // Requests to Join this user's groups
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleLoad = this.handleLoad.bind(this)
        this.getGroups = this.getGroups.bind(this)

        setTimeout(() => {
            this.setState({
                username: this.props.username,
                password: this.props.password,
                role: this.props.role,
                email: this.props.email,
                firstName: this.props.firstName,
                lastName: this.props.lastName,
                cardNum: this.props.cardNum,
                address: this.props.address,
                profilePic: this.props.profilePic,
                statusPhrase: this.props.statusPhrase
            })
            if (!this.props.password || this.props.password === "") {
                this.setState({ password: sessionStorage.getItem('password') })
            }
            this.handleLoad()
        }, 100)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getJrs() {
        if (!this.state.username) {
            return
        }
        else {
            var user = this.state.username;
            axios
            .post('/api/requests', { username: user })
            .then((response) => {
                if (response.status < 400) {
                    if (response.data.message.startsWith('Error'))
                    {
                        alert("Something went wrong when retrieving join requests:\n" + response.data.message)
                    }
                    else if (response.data.message.startsWith('No')) {
                        var p = document.createElement('p');
                        p.textContent = response.data.message;
                        document.getElementById("requestsDiv").appendChild(p)
                    }
                    else {
                        this.setState({ jrs: response.data.jrs })
                        // alert("JRS:\n" + JSON.stringify(response.data.jrs))
                        var elems = response.data.jrs.map(jr => {
                            var tr = document.createElement('tr')
                            tr.style.textAlign = 'center'
                                var requesterTd = document.createElement('td')
                                requesterTd.classList.add('row', 'first')
                                    var profileCol = document.createElement('div')
                                    profileCol.classList.add('col-2')
                                        var img = document.createElement('img')
                                        img.classList.add('jr-profile')
                                        img.src = fileServer + 'user_profiles/' + jr.requester.profilePic
                                    profileCol.appendChild(img)
                                requesterTd.appendChild(profileCol)
                                    var deetsCol = document.createElement('div')
                                    deetsCol.classList.add('col-10')
                                        var div = document.createElement('div')
                                        div.classList.add('container', 'deets');
                                            var uname = document.createElement('h6');
                                            uname.classList.add('text-bold')
                                            uname.textContent = jr.requester.username
                                        div.appendChild(uname)
                                            var name = document.createElement('h6');
                                            name.textContent = jr.requester.firstName + ' ' + jr.requester.lastName;
                                        div.appendChild(name)
                                            var email = document.createElement('h6');
                                            email.textContent = jr.requester.email
                                        div.appendChild(email)
                                            var phrase = document.createElement('h6');
                                            phrase.classList.add('quote')
                                            phrase.textContent = '"' + jr.requester.statusPhrase + '"'
                                        div.appendChild(phrase)
                                    deetsCol.appendChild(div)
                                requesterTd.appendChild(deetsCol)
                            tr.appendChild(requesterTd)
                                var groupTd = document.createElement('td')
                                groupTd.textContent = this.state.groups.filter((g) => { return g._id === jr.groupId })[0].name
                            tr.appendChild(groupTd)
                                var dateTd = document.createElement('td')
                                dateTd.textContent = jr.requestDate
                            tr.appendChild(dateTd)
                            var btnTd = document.createElement('td')
                                var btn = document.createElement('button')
                                    btn.classList.add("btn-success", "text-light", "btn-cool")
                                    btn.textContent = "Accept"
                                    btn.onclick = () => {
                                        axios
                                        .post('/api/accept-join', { reqId: jr._id })
                                        .then((res) => {
                                            if (res.status < 400) {
                                                alert("Join request accepted!");
                                                tr.remove();
                                            }
                                        })
                                        .catch((err) => {
                                            alert("Something went wrong when trying to accept join request:\n" + err)
                                        });
                                    }
                                btnTd.appendChild(btn)
                            tr.appendChild(btnTd)
                            return tr;
                        })
                        elems.forEach((elem) => { document.getElementById('jrsBody').appendChild(elem) })
                    }
                }
            })
            .catch((err) => {
                alert("Something went wrong when retrieving join requests:\n" + err)
            });
        }
    }

    getGroups() {
        if (!this.state.username) {
            return
        }
        else {
            axios
            .get('/api/groups')
            .then((response) => {
                if (response.status < 400) {
                    this.setState({ groups: response.data })
                    var elems = response.data.map((group) => {
                        var div = document.createElement('div');
                        div.classList.add("card", "group");
                            var img = document.createElement('img')
                            img.classList.add('card-img-top')
                            img.src = fileServer + 'groups/' + group.groupPhoto
                        div.appendChild(img)
                            var body = document.createElement('div')
                            body.classList.add('card-body')
                                var title = document.createElement('h5')
                                title.classList.add('card-title', 'text-bold', 'tab-down')
                                title.textContent = group.name
                            body.appendChild(title)
                                var btn = document.createElement('a')
                                var isUserInGroup = group.members.includes(this.state.username)
                                var btnClass = isUserInGroup ? 'bg-secondary' : 'bg-info';
                                var btnText = isUserInGroup ? "Leave" : "Request to Join"
                                if (!isUserInGroup) {
                                    btn.setAttribute("data-toggle", "tooltip")
                                    btn.setAttribute("title", "The group's admin will receive a copy of your profile including your: profile picture, username, full name, email address and status phrase.")
                                }
                                btn.classList.add("btn", btnClass, "text-light", "btn-cool", "bind-bottom");
                                btn.textContent = btnText;
                                btn.onclick = () => {
                                    if (!isUserInGroup) {
                                        var user = this.state.username
                                        var email = this.state.email
                                        var firstName = this.state.firstName
                                        var lastName = this.state.lastName
                                        var profilePic = this.state.profilePic
                                        var statusPhrase = this.state.statusPhrase
                                        axios
                                        .post('/api/join', {
                                            requester: {
                                                username: user,
                                                email: email,
                                                firstName: firstName,
                                                lastName: lastName,
                                                profilePic: profilePic,
                                                statusPhrase: statusPhrase
                                            },
                                            groupId: group._id
                                        })
                                        .then(res => {
                                            if (res.status < 400) {
                                                alert(res.data.message)
                                            }
                                        })
                                        .catch(err => { 
                                            alert('Something went wrong when trying to request to join:\n' + err)
                                        });
                                    }
                                    else {
                                        var user = this.state.username;
                                        axios
                                        .post('/api/leave', {
                                            username: user,
                                            groupId: group._id
                                        })
                                        .then((res) => {
                                            if (res.status < 400) {
                                                alert("Left group");
                                                window.location.reload();
                                            }
                                        })
                                        .catch((err) => {
                                            alert("Something went wrong when trying to leave group:\n" + err)
                                        })
                                    }
                                }
                            body.appendChild(btn)
                        div.appendChild(body)
                        return div;
                    });
                    elems.forEach((elem) => { document.getElementById('groupsDiv').appendChild(elem); })
                }
            })
            .catch((err) => {
                alert('Somethig went wrong when trying to retrieve groups:\n' + err)
            })
        }
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
        if (!this.validateEmail(this.state.email)) {
			alert("Please enter a valid email address")
			return
		}
		var lePass = this.hashPassword(this.state.password)
		var pswd = lePass.hash
        var salt = lePass.salt.toString('base64');
        var role = this.state.role ? this.state.role : this.props.role;
        var email = this.state.email ? this.state.email : this.props.email;
        var firstName = this.state.firstName ? this.state.firstName : this.props.firstName;
        var lastName = this.state.lastName ? this.state.lastName : this.props.lastName;
        var cardNum = this.state.cardNum ? this.state.cardNum : this.props.cardNum;
        var addr = this.state.address ? this.state.address : this.props.address;
        var profilePic = this.props.profilePic;
        var altPass = this.state.password ? this.state.password : sessionStorage.getItem('password');
        var statusPhrase = this.state.statusPhrase ? this.state.statusPhrase : this.props.statusPhrase;
        axios
            .post('/user/update', {
                username: this.props.username,
                    password: pswd,
                    passSalt: salt,
                    role: role,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    cardNum: cardNum,
                    address: addr,
                    profilePic: profilePic,
                    altPass: altPass,
                    statusPhrase: statusPhrase
            })
            .then(response => {
                if (response.status === 200) {
                    alert('Your profile has been successfully updated!')
                }
            }).catch(error => {
                alert("An error occured:\n" + error.toString())
            })
    }

    componentDidMount() {
        if (document.getElementById('meTab') && !document.getElementById('meTab').classList.contains('active')) {
    		document.getElementById('meTab').classList.add('active')
    	}
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab') && document.getElementById('catalogTab').classList.contains('active')) {
            document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab') && document.getElementById('catalogTab').classList.contains('active')) {
            document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
            document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
            document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
            document.getElementById('ordersTab').classList.remove('active')
        }
    }

    handleLoad() {
        if (this.props.username) {
            var user = this.props.username
            axios
                .post('/api/score', {
                    username: user
                })
                .then((response) => {
                    if (response.status < 400) {
                        this.setState({
                            posCount: response.data.posCount,
                            negCount: response.data.negCount
                        })
                    }
                })
                .catch((err) => {
                    alert("An error occured:\n" + err.toString())
                })
            $('#groupsDiv').ready(() => {
                this.getGroups()
            });
            $('#requestsDiv').ready(() => {
                this.getJrs()
            });
        }
    }

    render() {
        return (
        <div className="container-fluid">
            <div className="row margin-sides">
                <div className="col-6">
                    <h4>Groups</h4>
                    <div className="container row scrollable tab-down-lg" id="groupsDiv">
                    </div>
                    <h5>Requests to Join Your Groups</h5>
                    <div className="container scrollable-sm" id="requestsDiv">
                        <table className="jrs-table">
                                <thead className="bg-dark text-light">
                                    <tr>
                                        <th className="lg">Requester</th>
                                        <th>Group</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="jrsBody" style={{ textAlign: 'center' }}>

                                </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-6 col-fill">
                    <div className="container-fluid">
                        <h4>My Profile</h4>
                        <form className="form-horizontal col-fill">
                            <div className="form-group pull-up">
                                <div className="container"> 
                                    <div className="row">
                                        <div className="form-group col-6 text-danger">
                                            <div className="col-3 col-ml-auto">
                                                <label className="form-label" htmlFor="statusPhrase"><i className="fa fw fa-thumbs-down"></i></label>
                                            </div>
                                            <div className="col-9 col-mr-auto">
                                                <input className="form-input text-light no-border bg-danger text-center text-bold"
                                                    type="text"
                                                    name="negVotes"
                                                    value={this.state.negCount + ' Points'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group col-6 text-success">
                                            <div className="col-3 col-ml-auto">
                                                <label className="form-label" htmlFor="statusPhrase"><i className="fa fw fa-thumbs-up"></i></label>
                                            </div>
                                            <div className="col-9 col-mr-auto">
                                                <input className="form-input no-border bg-success text-center text-bold"
                                                    type="text"
                                                    name="posVotes"
                                                    value={this.state.posCount + ' Points'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="username">Username</label>
                                </div>
                                <div className="col-9 col-mr-auto">
                                    <input className="form-input"
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Username"
                                        value={this.state.username}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="password">Password: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
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
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="Name">Name: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
                                    <div className="row">
                                        <div className="col-6">
                                            <input className="form-input"
                                                placeholder="First Name"
                                                type="text"
                                                name="firstName"
                                                value={this.state.firstName}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="col-6">
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
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="email">Email: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
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
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="address">Address: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
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
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="cardNum">Card number: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
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
                            <div className="form-group">
                                <div className="col-3 col-ml-auto">
                                    <label className="form-label" htmlFor="statusPhrase">Status Phrase: </label>
                                </div>
                                <div className="col-9 col-mr-auto">
                                    <input className="form-input"
                                        placeholder="Status phrase"
                                        type="text"
                                        name="statusPhrase"
                                        value={this.state.statusPhrase}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="container" style={{ fontSize: 'small', width: '70%', textAlign: 'left' }}>
                                <p>Please note that:</p>
                                <ul style={{ marginTop: '-1%' }}>
                                    <li>Changes take effect immediately.</li>
                                    <li>Your profile picture can be changed from the "Social Corner".</li>
                                </ul>
                            </div>
                            <div className="form-group ">
                                <div className="col-10"></div>
                                <button
                                    className="btn btn-primary col-2 col-mr-auto"
                                    onClick={this.handleSubmit}
                                    type="submit"
                                >Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Me
