import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios'

class Navbar extends Component {
    constructor() {
        super()
        this.logout = this.logout.bind(this)
    }

    logout(event) {
        event.preventDefault()
        console.log('logging out')
        sessionStorage.clear()
        document.getElementById('menuContainer').style.display = 'block'
        axios.post('/user/logout').then(response => {
          console.log(response.data)
          if (response.status === 200) {
            this.props.updateUser({
              loggedIn: false,
              username: null
            })
            window.location.href = '/'
          }
        }).catch(error => {
            console.log('Logout error')
        })
      }

      aboutClick() {
        return function() {
          if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
            document.getElementById('contactTab').classList.remove('active')
            if (!document.getElementById('aboutTab').classList.contains('active')) {
              document.getElementById('aboutTab').classList.add('active')
            }
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
          document.getElementById('menuContainer').style.display = 'inline-block'
          document.getElementById('menuRow').children.item(0).children.item(0).style.fontSize = '300%'
          document.getElementById('menuRow').style.height = 'max-content'
          document.getElementById('nav-container').style.height = 'fit-content'
          document.getElementById('nav-container').style.verticalAlign = 'bottom'
          if (window.location.href.includes('social')) {
            document.getElementById('nav-container').style.marginTop = '25%'
          }
        }
      }

      logClick() {
        return function() {
          if (document.getElementById('contactTab') && document.getElementById('aboutTab')) {
            document.getElementById('contactTab').classList.remove('active')
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
          document.getElementById('menuContainer').style.display = 'block'
        }
      }

    socialClick() {
      return function() {
        document.getElementById('menuContainer').style.display = 'none'
      }
    }

    render() {
        const loggedIn = this.props.loggedIn;
        console.log('navbar render, props: ')
        console.log(this.props);

        return (
            <div className="text-right">
                <header className="navbar App-header text-right" id="nav-container">
                    <div className="row text-right" style={{ marginRight: '2vw' }}>
                        {loggedIn ? (
                            <section className="navbar-section text-right" style={{ marginLeft: '-15%', textAlign: 'right', alignContent: 'right', marginRight: '2vw' }}>
                                <Link to="/" className="btn btn-link text-secondary" onClick={this.aboutClick()}>
                                      <span className="text-secondary" class="link-span"><i class="fa fw fa-home"/> HOME</span>
                                </Link>
                                <Link to="#" className="btn btn-link text-secondary" onClick={this.logout}>
                                  <span className="text-secondary" class="link-span"><i class="fa fw fa-sign-out"/> LOGOUT</span>
                                </Link>
                                <Link to="/cart" className="btn btn-link text-secondary" onClick={this.logClick()}>
                                  <span className="text-secondary" class="link-span"><i class="fa fw fa-shopping-cart"/> MY CART</span>
                                </Link>
                                <Link to="/social" className="btn btn-link text-secondary" onClick={this.socialClick()}>
                                  <span className="text-secondary" class="link-span"><i class="fa fw fa-users"/> SOCIAL</span>
                                </Link>
                            </section>
                        ) : (
                                <section className="navbar-section">
                                    <Link to="/" className="btn btn-link text-secondary" onClick={this.aboutClick()}>
                                      <span className="text-secondary" class="link-span"><i class="fa fw fa-home"/> HOME</span>
                                    </Link>
                                    <Link to="/login" className="btn btn-link text-secondary" onClick={this.logClick()}>
                                      <span className="text-secondary" class="link-span"><i class="fa fw fa-sign-in"/> LOGIN</span>
				                            </Link>
                                    <Link to="/signup" className="btn btn-link" onClick={this.logClick()}>
                                      <span className="text-secondary" class="link-span"><i class="fa fw fa-user-plus"/> SIGN UP</span>
				                            </Link>
                                </section>
                            )}
                    </div>
                </header>
            </div>

        );

    }
}

export default Navbar
