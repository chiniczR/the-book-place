import React, { Component } from 'react'
import axios from 'axios'
const crypto = require('crypto')
const CryptoJS = require('crypto-js')

const $ = window.$

class UserMgmt extends Component {
    constructor() {
        super()
        this.state = {
            users: null,
            books: null,
            showUserModal: false,
            addUserCount: 0
        }

        this.getUsers = this.getUsers.bind(this)
        this.componentDidMount = this.componentDidMount(this)
    }

    componentDidMount() {
        this.getUsers()
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

    getUsers() {
        axios.get('/user/all').then(response => {
            console.log('Get users response: ')
            console.log(response.data)
            if (response.data) {
                // alert('Got users:' + JSON.stringify(response.data))
                this.setState({ users : response.data })
                $('#usersBody').ready(() => {
                    this.state.users.forEach(user => {
                        var tr = document.createElement('tr')
                        tr.style.textAlign = 'center'
                        tr.id = user.username + 'Row'

                        var usernameTd = document.createElement('td')
                            var usernameInput = document.createElement('input')
                            usernameInput.classList.add('form-control')
                            usernameInput.type = 'text'
                            usernameInput.value = user.username
                            usernameInput.readOnly = true
                            usernameInput.id = user.username + 'Username'
                            usernameInput.style.textAlign = 'center'
                        usernameTd.style.width = '10%'
                        usernameTd.appendChild(usernameInput)
                        tr.appendChild(usernameTd)

                        var nameTd = document.createElement('td')
                            var nameInput = document.createElement('input')
                            nameInput.type = 'text'
                            nameInput.value = user.firstName + ' ' + user.lastName
                            nameInput.id = user.username + 'Name'
                            nameInput.style.textAlign = 'center'
                            $(nameInput).keyup(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        nameTd.style.width = '10%'
                        nameTd.appendChild(nameInput)
                        tr.appendChild(nameTd)

                        var emailTd = document.createElement('td')
                            var emailInput = document.createElement('input')
                            emailInput.type = 'text'
                            emailInput.value = user.email
                            emailInput.id = user.username + 'Email'
                            emailInput.style.textAlign = 'center'
                            $(emailInput).keyup(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        emailTd.style.width = '15%'
                        emailTd.appendChild(emailInput)
                        tr.appendChild(emailTd)

                        var roleTd = document.createElement('td')
                            var roleSelect = document.createElement('select')
                            roleSelect.className = 'form-control'
                                var op1 = document.createElement('option')
                                op1.textContent = 'admin'
                                if (user.role === 'admin') {
                                    op1.selected = true
                                }
                                roleSelect.appendChild(op1)
                                var op2 = document.createElement('option')
                                op2.textContent = 'clerk'
                                if (user.role === 'clerk') {
                                    op2.selected = true
                                } 
                                roleSelect.appendChild(op2)
                                var op3 = document.createElement('option')
                                op3.textContent = 'client'
                                if (user.role === 'client') {
                                    op3.selected = true
                                } 
                                roleSelect.appendChild(op3)
                                var op4 = document.createElement('option')
                                op4.textContent = 'supplier'
                                if (user.role === 'supplier') {
                                    op4.selected = true
                                }
                                roleSelect.appendChild(op4)
                            roleSelect.id = user.username + 'Role'
                            roleSelect.style.textAlign = 'center'
                            $(roleSelect).change(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        roleTd.appendChild(roleSelect)
                        roleTd.style.width = '10%'
                        tr.appendChild(roleTd)

                        var addrTd = document.createElement('td')
                            var addrInput = document.createElement('input')
                            addrInput.type = 'text'
                            addrInput.value = user.address
                            addrInput.id = user.username + 'Address'
                            addrInput.style.textAlign = 'center'
                            $(addrInput).keyup(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        addrTd.style = '20%'
                        addrTd.appendChild(addrInput)
                        tr.appendChild(addrTd)

                        var cardTd = document.createElement('td')
                            var cardInput = document.createElement('input')
                            cardInput.type = 'text'
                            cardInput.value = user.cardNum
                            cardInput.id = user.username + 'Card'
                            cardInput.style.textAlign = 'center'
                            $(cardInput).keyup(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        cardTd.style.width = '15%'
                        cardTd.appendChild(cardInput)
                        tr.appendChild(cardTd)

                        var passTd = document.createElement('td')
                            var passInput = document.createElement('input')
                            passInput.type = 'text'
                            passInput.id = user.username + 'Password'
                            passInput.style.textAlign = 'center'
                            $(passInput).keyup(function(){
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                            var changePass = document.createElement('button')
                            changePass.classList.add('btn-outline-secondary')
                            changePass.style.verticalAlign = 'middle'
                            changePass.style.borderRadius = '5px'
                            changePass.style.height = '2%'
                            changePass.style.fontSize = 'large'
                            changePass.textContent = 'Change Password'
                            $(changePass).click(function() {
                                passInput.style.display = 'block'
                                changePass.style.display = 'none'
                                document.getElementById(user.username + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(user.username + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(user.username + 'Icon').click()
                                }
                            })
                        passInput.style.display = 'none'
                        passInput.value = ''
                        passTd.appendChild(passInput)
                        passTd.appendChild(changePass)
                        passTd.style.width = '15%'
                        tr.appendChild(passTd)

                        var delIcon = document.createElement('i')
                        delIcon.classList.add('fa', 'fw', 'fa-trash')
                        var delTd = document.createElement('td')
                        delTd.appendChild(delIcon)
                        delTd.classList.add('btn-outline-danger')
                        delTd.id = user.username + 'Icon'
                        $(delTd).click(function(){
                            if (document.getElementById(user.username + 'Icon').firstChild.classList.contains('fa-trash'))
                            {
                                document.getElementById(user.username + 'Row').style.background = 'rgb(255,200,200,0.7)'
                                document.getElementById(user.username + 'Icon').firstChild.classList.remove('fa-trash')
                                document.getElementById(user.username + 'Icon').firstChild.classList.add('fa-undo')
                                document.getElementById(user.username + 'Icon').classList.remove('btn-outline-danger')
                                document.getElementById(user.username + 'Icon').classList.add('btn-outline-secondary')
                            }
                            else {  // If reset was clicked
                                document.getElementById(user.username + 'Row').style.background = 'inherit'
                                document.getElementById(user.username + 'Row').disabled = true
                                document.getElementById(user.username + 'Icon').firstChild.classList.remove('fa-undo')
                                document.getElementById(user.username + 'Icon').firstChild.classList.add('fa-trash')
                                document.getElementById(user.username + 'Icon').classList.add('btn-outline-danger')
                                document.getElementById(user.username + 'Icon').classList.remove('btn-outline-secondary')
                            }
                        })
                        delTd.style.width = '5%'
                        tr.appendChild(delTd)

                        document.getElementById('usersBody').appendChild(tr)
                    });
                })
            }
        })
    }

    reload(e) {
        e.preventDefault()
        window.location.reload()
    }

    addUser(e) {
        // eslint-disable-next-line
        e.preventDefault
        if (!document.getElementById('usersBody')) {
            return
        }
        // alert('Should add now... ' + this.state.addUserCount)
        const count = this.state.addUserCount + 1

        var tr = document.createElement('tr')
        tr.style.textAlign = 'center'
        tr.id = 'user' + count + 'Row'
        tr.style.background = 'rgb(200,255,200,0.7)'

        var usernameTd = document.createElement('td')
        var usernameInput = document.createElement('input')
            usernameInput.classList.add('form-control')
            usernameInput.type = 'text'
            usernameInput.placeholder = 'Username'
            usernameInput.id = 'user' + count + 'Username'
            usernameInput.style.textAlign = 'center'
        usernameTd.style.width = '10%'
        usernameTd.appendChild(usernameInput)
        tr.appendChild(usernameTd)

        var nameTd = document.createElement('td')
        var nameInput = document.createElement('input')
            nameInput.type = 'text'
            nameInput.placeholder = 'FirstName LastName'
            nameInput.id = 'user' + count + 'Name'
            nameInput.style.textAlign = 'center'
        nameTd.style.width = '10%'
        nameTd.appendChild(nameInput)
        tr.appendChild(nameTd)

        var emailTd = document.createElement('td')
        var emailInput = document.createElement('input')
            emailInput.type = 'text'
            emailInput.placeholder = 'Email Address'
            emailInput.id = 'user' + count + 'Email'
            emailInput.style.textAlign = 'center'
        emailTd.style.width = '15%'
        emailTd.appendChild(emailInput)
        tr.appendChild(emailTd)

        var roleTd = document.createElement('td')
        var roleSelect = document.createElement('select')
            roleSelect.className = 'form-control'
            var op1 = document.createElement('option')
                op1.textContent = 'admin'
            roleSelect.appendChild(op1)
            var op2 = document.createElement('option')
                op2.textContent = 'clerk'
            roleSelect.appendChild(op2)
            var op3 = document.createElement('option')
                op3.textContent = 'client'
                op3.selected = true
            roleSelect.appendChild(op3)
            var op4 = document.createElement('option')
                op4.textContent = 'supplier'
            roleSelect.appendChild(op4)
            roleSelect.id = 'user' + count + 'Role'
            roleSelect.style.textAlign = 'center'
        roleTd.appendChild(roleSelect)
        roleTd.style.width = '10%'
        tr.appendChild(roleTd)

        var addrTd = document.createElement('td')
        var addrInput = document.createElement('input')
            addrInput.type = 'text'
            addrInput.placeholder = 'Physical Address'
            addrInput.id = 'user' + count + 'Address'
            addrInput.style.textAlign = 'center'
        addrTd.style = '20%'
        addrTd.appendChild(addrInput)
        tr.appendChild(addrTd)

        var cardTd = document.createElement('td')
        var cardInput = document.createElement('input')
            cardInput.type = 'text'
            cardInput.placeholder = 'Credit Card Number'
            cardInput.id = 'user' + count + 'Card'
            cardInput.style.textAlign = 'center'
        cardTd.style.width = '15%'
        cardTd.appendChild(cardInput)
        tr.appendChild(cardTd)

        var passTd = document.createElement('td')
        var passInput = document.createElement('input')
            passInput.type = 'text'
            passInput.placeholder = 'Password'
            passInput.id = 'user' + count + 'Password'
            passInput.style.textAlign = 'center'
        passTd.appendChild(passInput)
        passTd.style.width = '15%'
        tr.appendChild(passTd)

        var delIcon = document.createElement('i')
        delIcon.classList.add('fa', 'fw', 'fa-trash')
        var delTd = document.createElement('td')
        delTd.appendChild(delIcon)
        delTd.classList.add('btn-outline-danger')
        delTd.id = 'user' + count + 'Icon'
        $(delTd).click(function(){
            document.getElementById('user' + count + 'Row').remove()
        })
        delTd.style.width = '5%'
        tr.appendChild(delTd)

        document.getElementById('usersBody').appendChild(tr)
        document.getElementById('afterTable').scrollIntoView(false)
        this.setState({ addUserCount : count + 1 })
    }

    saveClick(e) {
        // eslint-disable-next-line
        e.preventDefault
        var rows = document.getElementById('usersBody').getElementsByTagName('tr')
        for(var i = 0; i < rows.length; i++) {
            // Row to be inserted
            if (rows.item(i).style.background.startsWith('rgba(200, 255, 200, 0.7)')) {
                //alert('New row!')
                if (document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Password').value === '') {
                    alert('Please enter a password')
                    continue
                }
                var lePass = this.hashPassword(document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Password').value)
                var pswd = lePass.hash
                var salt = lePass.salt.toString('base64');
                var uname = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Username').value
                if (uname === '') {
                    alert('Please enter a username for row no. ' + (i+1))
                    continue
                }
                var user = null
                // eslint-disable-next-line
                user = this.state.users.find(function(item) {
                    if (item.username === uname) {
                        return item
                    }
                })
                if (user) {
                    alert('The username for new user in row no. ' + (i+1)
                    + ' is already taken. Please choose another username')
                }
                try {
                    var firstName = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length)+ 'Name').value.toString().split(' ')[0]
                    var lastName = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Name').value.toString().split(' ')[1]
                }
                catch (e) {
                    alert('Please enter valid first and last names for row no. ' + (i+1))
                    continue
                }
                var email = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length)+ 'Email').value
                if (email === '') {
                    alert('Please enter an email address for row no. ' + (i+1))
                    continue
                }
                var role = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Role').value
                var addr = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Address').value
                if (addr === '') {
                    alert('Please enter a physical address for row no. ' + (i+1))
                    continue
                }
                var cardNum = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Card').value
                if (cardNum === '') {
                    alert('Please enter a credit card number for row no. ' + (i+1))
                    continue
                }
                axios.post('/user/', {
                    username: uname,
                    password: pswd,
                    passSalt: salt,
                    role: role,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    cardNum: cardNum,
                    address: addr
                })
                // eslint-disable-next-line
                    .then(response => {
                        console.log(response)
                        if (!response.data.errmsg) {
                           // alert('User(s) added successfully.')
                           rows.item(i).style.background = 'transparent'
                        } else {
                            alert('This username is already taken.')
                        }
                    }).catch(error => {
                        console.log('signup error: ')
                        console.log(error)
        
                    })
            }
            // Row to be updated
            else if (rows.item(i).style.background.startsWith('rgba(200, 200, 255, 0.7)')) {
                // alert('Row no. ' + i + ' To be updated')
                // eslint-disable-next-line
                var lePass = ''
                if (!document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Password').value !== '') {
                    lePass = this.hashPassword(document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Password').value)
                }
                // eslint-disable-next-line
                var pswd = lePass === '' ? '' : lePass.hash
                // eslint-disable-next-line
                var salt = lePass === '' ? '' : lePass.salt.toString('base64');
                // eslint-disable-next-line
                var altPass = lePass === '' ? false : true
                // eslint-disable-next-line
                var uname = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Username').value
                // eslint-disable-next-line
                var user = null
                // eslint-disable-next-line
                user = this.state.users.find(function(item) {
                    if (item.username === uname) {
                        return item
                    }
                })
                // alert(JSON.stringify(user))
                // eslint-disable-next-line
                var firstName = ''
                // eslint-disable-next-line
                var lastName = ''
                if (document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Name').value === '') {
                        firstName = user.firstName
                        lastName = user.lastName
                    }
                else {
                    try {
                        firstName = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Name').value.toString().split(' ')[0]
                        lastName = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Name').value.toString().split(' ')[1]
                    }
                    catch (e) {
                        alert('Please enter valid first and last names for the user in row no. ' + (i+1))
                    }
                }
                // eslint-disable-next-line
                var email = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Email').value
                if (email === '') {
                    email = user.email
                }
                // eslint-disable-next-line
                var role = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Role').value
                // eslint-disable-next-line
                var addr = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Address').value
                if (addr === '') {
                    addr = user.address
                }
                // eslint-disable-next-line
                var cardNum = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Card').value
                if (cardNum === '') {
                    cardNum = user.cardNum
                }
                const config = {
                    "headers": {
                        "Connection": "keep-alive"
                       }
                }
                axios.post('/user/update', {
                    username: uname,
                    password: pswd,
                    passSalt: salt,
                    role: role,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    cardNum: cardNum,
                    address: addr,
                    altPass: altPass
                }, config)
                // eslint-disable-next-line
                    .then(response => {
                        // alert(JSON.stringify(response))
                        if (!response.data.errmsg) {
                            //alert('User(s) updated successfully.')
                            rows.item(i).style.background = 'transparent'
                        }// else {
                        //     alert('This username is already taken.')
                        // }
                    }).catch(error => {
                        console.log('signup error: ')
                        console.log(error)
        
                    })
            }
            // Row to be deleted
            else if (rows.item(i).style.background.startsWith('rgba(255, 200, 200, 0.7)')) {
                // alert('Row no. ' + i + ' to be deleted')
                // eslint-disable-next-line
                var uname = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Username').value
                if (uname === this.props.username) {
                    alert('You cannot delete yourself. Please contact another admin to do that for you.')
                }
                else {
                    axios.post('/user/delete', {
                        username: uname
                    })// eslint-disable-next-line
                    .then(response => {
                        // alert(JSON.stringify(response))
                        if (!response.data.errmsg) {
                            //alert('User(s) deleted successfully.')
                        }
                        rows.item(i).remove()
                    }).catch(error => {
                        console.log('deltion error: ')
                        console.log(error)
                    })   
                }
            }
        }
        alert('Changes saved')
        document.getElementById("reloadBtn").click()
    }

    render() {
        return (
            <div>
                {!this.props.loggedIn || this.props.role !== 'admin' ? (
                    <p>You must be and admin to access this page</p>
                ) : (
                    <div className="container-fluid">
                        <p>Welcome, admin user!<br/>
                        Please note that you cannot view a user's password, but you can change it.
                        </p>
                        <p style={{ textAlign: 'center' }}>
                            Entry color code:
                            <mark style={{ background: 'rgb(200,255,200,0.7)', marginRight: '0.5%', marginLeft: '0.5%' }}>New</mark> 
                            <mark style={{ background: 'rgb(200,200,255,0.7)', marginRight: '0.5%' }}>Edited</mark> 
                            <mark style={{ background: 'rgb(255,200,200,0.7)', marginRight: '0.5%' }}>To be deleted</mark>
                            <mark style={{ background: 'rgb(245,245,245,0.7)', border: '1px solid rgb(200,200,200)' }}>Unaltered</mark>
                        </p>
                        <button className="btn-outline-success" onClick={this.addUser.bind(this)} style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                                <i className="fa fw fa-plus"/> Add User</button>
                        <button className="btn-outline-primary" onClick={this.saveClick.bind(this)} style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                                <i className="fa fw fa-floppy-o"/> Save Changes</button>
                        <button className="btn-outline-info" onClick={this.reload} id="reloadBtn" style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                                <i className="fa fw fa-undo"/> Refresh/Reset</button>
                        <div className="container-fluid" style={{ marginTop: '1%' }}>
                            <table className="table table-hover" style={{ textAlign: 'center' }}>
                                <thead>
                                    <tr className="bg-success" style={{ fontFamily: 'Josefin Sans' }}>
                                        <th scope="col-1">Username</th>
                                        <th scope="col-1">Name</th>
                                        <th scope="col-1">Email</th>
                                        <th scope="col-1">Role</th>
                                        <th scope="col-3">Address</th>
                                        <th scope="col-2">Card Number</th>
                                        <th scope="col-1">Password</th>
                                        <th scope="col-2">Option</th>
                                    </tr>
                                </thead>
                                <tbody id="usersBody" style={{ textAlign: 'center' }}>

                                </tbody>
                            </table>
                            <p id='afterTable'></p>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default UserMgmt