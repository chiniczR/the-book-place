import React, { Component } from 'react';
import axios from 'axios'
import { Route, Link } from 'react-router-dom'
// components
import Contact from './components/contact'
import Signup from './components/sign-up'
import LoginForm from './components/login-form'
import Navbar from './components/navbar'
import Home from './components/home'
import Catalog from './components/catalog'
import Cart from './components/cart'
import UserMgmt from './components/userMgmt'
import BookMgmt from './components/bookMgmt'
import Orders from './components/orders'
import Social from './socialComponents/social'
import Me from './components/me'
import ForgotPassword from './components/forgot-password'
import ResetPassword from './components/reset-password'

const $ = window.$

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      username: null,
      password: null,
      userId: null,
      firstName: null,
      lastName: null,
      role: null,
      email: null,
      address: null,
      cardNum: null,
      profile: null,
      statusPhrase: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser()
    if (window.location.toString().includes('signup') ||
      window.location.toString().includes('login') || window.location.toString().includes('cart')) {
        if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
          if (window.location.toString().includes('contact')) {
            if (document.getElementById('contactTab').classList.contains('active')) {
              document.getElementById('contactTab').classList.add('active')
            }
            document.getElementById('aboutTab').classList.remove('active')
            document.getElementById('catalogTab').classList.remove('active')
          }
          else if (window.location.toString().includes('catalog')) {
            if (!this.state.loggedIn) {
              this.aboutClick()
            }
            if (document.getElementById('catalogTab').classList.contains('active')) {
              document.getElementById('catalogTab').classList.add('active')
            }
            document.getElementById('aboutTab').classList.remove('active')
            document.getElementById('contactTab').classList.remove('active')
          }
          else {
            if (document.getElementById('aboutTab').classList.contains('active')) {
              document.getElementById('aboutTab').classList.remove('active')
            }
            document.getElementById('contactTab').classList.remove('active')
            if (document.getElementById('catalogTab')) {
              document.getElementById('catalogTab').classList.remove('active')
            }
          }
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
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
      window.addEventListener('load', this.handleLoad);
  }

  componentWillUnmount() {
     window.removeEventListener('load', this.handleLoad)
   }

   handleLoad() {
    $("#catalogTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('catalog')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')
        && !document.getElementById('catalogTab').classList.contains('active')) {
            document.getElementById('catalogTab').classList.add('active')
        }
      }
    });
    $("#contactTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('contact')) {
        if (document.getElementById('aboutTab')) {
          document.getElementById('aboutTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')) {
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
        if (document.getElementById('contactTab')
        && !document.getElementById('contactTab').classList.contains('active')) {
            document.getElementById('contactTab').classList.add('active')
        }
      }
    });
    $("#userMgmtTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('usermgmt')) {
        if (document.getElementById('aboutTab')) {
          document.getElementById('aboutTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('contactTab')) {
          document.getElementById('contactTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')
        && !document.getElementById('userMgmtTab').classList.contains('active')) {
            document.getElementById('userMgmtTab').classList.add('active')
        }
      }
    });
    $("#bookMgmtTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('bookmgmt')) {
        if (document.getElementById('aboutTab')) {
          document.getElementById('aboutTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('contactTab')) {
          document.getElementById('contactTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')
        && !document.getElementById('bookMgmtTab').classList.contains('active')) {
            document.getElementById('bookMgmtTab').classList.add('active')
        }
      }
    });
    $("#ordersTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('orders')) {
        if (document.getElementById('aboutTab')) {
          document.getElementById('aboutTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('contactTab')) {
          document.getElementById('contactTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')
        && !document.getElementById('ordersTab').classList.contains('active')) {
            document.getElementById('ordersTab').classList.add('active')
        }
      }
    });
    $("#meTab").ready(function(){
      // alert('Contact Tab Loaded')
      if (window.location.toString().includes('me')) {
        if (document.getElementById('aboutTab')) {
          document.getElementById('aboutTab').classList.remove('active')
        }
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('contactTab')) {
          document.getElementById('contactTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('meTab')
        && !document.getElementById('meTab').classList.contains('active')) {
            document.getElementById('meTab').classList.add('active')
        }
      }
    });
   }

  updateUser (userObject) {
    this.setState(userObject)
  }

  getUser() {
    axios.get('/user/').then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username,
          userId: response.data.user._id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          role: response.data.user.role,
          email: response.data.user.email,
          address: response.data.user.address,
          cardNum: response.data.user.cardNum,
          profile: response.data.user.profilePic,
          statusPhrase: response.data.user.statusPhrase
        })

        sessionStorage.setItem('password', this.state.password)
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null,
          firstName: null,
          role: null
        })
      }
    })
  }

  render() {
    return (
      <div className="App" style={{ fontFamily: 'Raleway' }}>
        <div className="container-flex" id="menuNavbar" style={{ background: '#6DB866' }}>
          {/* greet user if logged in: */}
          {this.state.loggedIn &&
            <p style={{ color: 'white', textAlign: 'right', marginRight: '1%', marginBottom: '-5px' }}>Hello, {this.state.firstName}!</p>
          }
          <div className="row" id="menuRow">
            <div className="col-10 text-left">
              <h1 style={{ marginTop: '4%', marginLeft: '2vw', color: 'white', fontFamily: 'Josefin Sans', fontWeight: 'bold', fontSize: '300%' }}>The Book Place</h1>
            </div>
            <div className="col-2 text-right" style={{ verticalAlign: 'bottom', textAlign: 'right', alignContent: 'right' }}>
              <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
            </div>
          </div>
        </div>

          {/* Routes to different components */}
          <div className="container-fluid" id="menuContainer" style={{ textAlign: 'center' }}>
            <div className="row nav-tabs" style={{ textAlign: 'center', marginBottom: '2%', background: '#A0EB99' }}>
              <div className="nav-item">
                <Link className="nav-link nav-tab active" onClick={this.aboutClick()} id="aboutTab" to="/">About</Link>
              </div>
              <div className="nav-item">
                <Link className="nav-link nav-tab" id="contactTab" to="/contact" onClick={this.contactClick()}>Contact</Link>
              </div>
              {this.state.loggedIn &&
                <div className="nav-item">
                  <Link className="nav-link nav-tab" id="catalogTab" to="/catalog" onClick={this.catalogClick()}>Catalog</Link>
                </div>
              }
              {this.state.role === 'admin' &&
                <div className="nav-item">
                  <Link className="nav-link nav-tab" id="userMgmtTab" to="/usermgmt" onClick={this.userMgmtClick()}>User Management</Link>
                </div>
              }
              {(this.state.role === 'admin' || this.state.role === 'supplier') &&
                <div className="nav-item">
                  <Link className="nav-link nav-tab" id="bookMgmtTab" to="/bookmgmt" onClick={this.bookMgmtClick()}>Book Management</Link>
                </div>
              }
              {(this.state.role === 'admin' || this.state.role === 'clerk' || this.state.role === 'client') &&
                <div className="nav-item">
                  <Link className="nav-link nav-tab" id="ordersTab" to="/orders" onClick={this.ordersClick()}>Orders</Link>
                </div>
              }
              {this.state.loggedIn &&
                <div className="nav-item">
                  <Link className="nav-link nav-tab" id="meTab" to="/me" onClick={this.meClick()}><em><b>{ this.state.username }</b></em></Link>
                </div>
              }
            </div>
          </div>
          <Route
            exact path="/"
            component={Home} />
          <Route
            path="/login"
            render={() =>
              <LoginForm
                updateUser={this.updateUser}
              />}
          />
          <Route 
            path="/forgot-password"
            render={() => <ForgotPassword />}
          />
          <Route 
            path="/reset-password/:token"
            render={(props) => <ResetPassword {...props} />}
          />
          <Route
            path="/signup"
            render={() =>
              <Signup/>}
          />
          <Route
            path="/contact"
            render={() =>
              <Contact/>}
          />
          <Route
            path="/catalog"
            render={() =>
              <Catalog loggedIn={this.state.loggedIn}/>}
          />
          <Route
            path="/cart"
            render={() =>
              <Cart  userId={this.state.userId}/>}
          />
          <Route
            path="/usermgmt"
            render={() =>
              <UserMgmt loggedIn={this.state.loggedIn} 
              role={this.state.role} username={this.state.username}/>}
          />
          <Route
            path="/bookmgmt"
            render={() =>
              <BookMgmt loggedIn={this.state.loggedIn} 
              role={this.state.role} username={this.state.username}/>}
          />
          <Route
            path="/orders"
            render={() =>
              <Orders loggedIn={this.state.loggedIn} 
              role={this.state.role} userId={this.state.userId}/>}
          />
          <Route
            path="/social"
            render={() =>
              <Social loggedIn={this.state.loggedIn} status={ this.state.statusPhrase }
              name={ this.state.firstName + ' ' + this.state.lastName }
              profile={ this.state.profile } username={ this.state.username } />}
          />
          <Route 
            path="/me"
            render={() => 
              <Me
              loggedIn={this.state.loggedIn}
              username={this.state.username}
              password={this.state.password}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              role={this.state.role}
              email={this.state.email}
              address={this.state.address}
              cardNum={this.state.cardNum}
              profilePic={this.state.profile}
              statusPhrase={this.state.statusPhrase}
              />}
          />
      </div>
    );
  }
  aboutClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (!document.getElementById('aboutTab').classList.contains('active')) {
          document.getElementById('aboutTab').classList.add('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  contactClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
          document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (!document.getElementById('contactTab').classList.contains('active')) {
            document.getElementById('contactTab').classList.add('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  catalogClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (!document.getElementById('catalogTab').classList.contains('active')) {
            document.getElementById('catalogTab').classList.add('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  userMgmtClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
            document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (!document.getElementById('userMgmtTab').classList.contains('active')) {
          document.getElementById('userMgmtTab').classList.add('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  bookMgmtClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
            document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('ordersTab')) {
          document.getElementById('ordersTab').classList.remove('active')
        }
        if (!document.getElementById('bookMgmtTab').classList.contains('active')) {
          document.getElementById('bookMgmtTab').classList.add('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  ordersClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
            document.getElementById('catalogTab').classList.remove('active')
        }
        if (document.getElementById('userMgmtTab')) {
          document.getElementById('userMgmtTab').classList.remove('active')
        }
        if (document.getElementById('bookMgmtTab')) {
          document.getElementById('bookMgmtTab').classList.remove('active')
        }
        if (!document.getElementById('ordersTab').classList.contains('active')) {
          document.getElementById('ordersTab').classList.add('active')
        }
        if (document.getElementById('meTab')) {
          document.getElementById('meTab').classList.remove('active')
        }
      }
    }
  }
  meClick() {
    return function() {
      if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
        document.getElementById('aboutTab').classList.remove('active')
        document.getElementById('contactTab').classList.remove('active')
        if (document.getElementById('catalogTab')) {
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
        if (!document.getElementById('meTab').classList.contains('active')) {
          document.getElementById('meTab').classList.add('active')
        }
      }
    }
  }
}

export default App;
