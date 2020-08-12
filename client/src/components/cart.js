import React, { Component } from 'react'
import axios from 'axios'

const $ = window.$

class Cart extends Component {
    constructor() {
        super()
        this.state = {
            total: 0.0
        }
        this.handleLoad = this.handleLoad.bind(this)
        this.componentDidMount = this.componentDidMount(this)
    }

    componentDidMount() {
        this.handleLoad()
        window.addEventListener('load', this.handleLoad);
    }
  
    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad)
    }
    
    handleLoad() {
        $("#cartBody").ready(function(){
            var cart = sessionStorage.getItem('cart')
            var tot = 0.0
            // alert('Cart is:\n'+cart.toString())
            $("#cartBody").empty()
            if (cart && cart !== "") {
                cart = cart.split('#')
                if (!cart || cart === undefined || cart === []) {
                    alert('Cart is empty')
                }
                (cart).forEach(item => {
                    if (item !== "") {
                        // alert(item)
                        var tr = document.createElement('tr')
                        tr.classList.add('align-middle')
                        var txt = item.replace('#','')

                        var coverTd = document.createElement('td')
                            var img = document.createElement('img')
                            img.alt = txt
                            var cover = txt.slice(
                                txt.indexOf('"cover":') + '"cover":'.length,
                                txt.indexOf(',"_id":') - 1
                            ) 
                            img.src = "../images/" + cover.slice(1,cover.length)
                            img.style.height = '50%'
                            img.style.width = '40%'
                        coverTd.appendChild(img)
                        coverTd.style.height = '50%'
                        coverTd.style.width = '40%'
                        tr.appendChild(coverTd)
                        tr.id = cover.replace('"','').replace('.jpg','') + 'Row'

                        var bookTd = document.createElement('td')
                            var title = txt.slice(
                                txt.indexOf('"title":') + '"title":'.length + 1,
                                txt.indexOf(',"isbn":') - 1
                            )
                            if (title === '') {

                            }
                            var titleP = document.createElement('p')
                            titleP.style.fontFamily = 'Josefin Sans'
                            titleP.style.fontSize = 'large'
                            titleP.style.fontWeight = 'bold'
                            titleP.textContent = title
                            bookTd.appendChild(titleP)
                            var author = txt.slice(
                                txt.indexOf('"author":') + '"author":'.length + 1,
                                txt.indexOf(',"numOfPages":') - 1
                            )
                            var authorP = document.createElement('p')
                            authorP.textContent = author
                            bookTd.appendChild(authorP)
                            var publisher = txt.slice(
                                txt.indexOf('"publisher":') + '"publisher":'.length + 1,
                                txt.indexOf(',"language":') - 1
                            )
                            var pubP = document.createElement('p')
                            pubP.textContent = publisher
                            var year = txt.slice(
                                txt.indexOf('"yearPublished":') + '"yearPublished":'.length,
                                txt.indexOf(',"publisher":')
                            )
                            pubP.textContent += ' | ' + year
                            bookTd.appendChild(pubP)
                        bookTd.style.width = '40%'
                        // titleTd.style.verticalAlign = 'middle'
                        tr.appendChild(bookTd)

                        var priceTd = document.createElement('td')
                            var price = txt.slice(
                                txt.indexOf('"price":') + '"price":'.length,
                                txt.indexOf('}')
                            )
                        tot += parseFloat(price)
                        priceTd.textContent = price + '$'
                        priceTd.style.width = '30%'
                        priceTd.style.fontFamily = 'Josefin Sans'
                        priceTd.style.fontWeight = 'bold'
                        priceTd.style.fontSize = 'large'
                        // authorTd.style.verticalAlign = 'middle'
                        tr.appendChild(priceTd)
                        
                        var iTd = document.createElement('td')
                            var icon = document.createElement('i')
                            icon.id = cover.replace('"','').replace('.jpg','') + 'id'
                            icon.classList.add('btn', 'fa','fw','fa-trash')
                            $(icon).click(function() {
                                var temp = sessionStorage.getItem('cart')
                                temp = temp.replace(item, '')
                                sessionStorage.setItem('cart', temp)
                                this.handleLoad()
                            }.bind(this))
                        iTd.appendChild(icon)
                        iTd.style.width = '5%'
                        tr.appendChild(iTd)

                        document.getElementById('cartBody').appendChild(tr)
                    }
                });
            }
            this.setState({ total: tot })
        }.bind(this))
        $("#orderBtn").click(function() {
            // eslint-disable-next-line
            var books = new Array()
            var cart = sessionStorage.getItem('cart')
            // alert('Cart is:\n'+cart.toString())
            if (cart && cart !== "") {
                cart = cart.split('#')
                if (!cart || cart === undefined || cart === []) {
                    alert('Cart is empty')
                }
                (cart).forEach(item => {
                    // alert('Item:\n'+item.toString())
                    if (item !== "") {
                        var txt = item.replace('#','')
                        var id = txt.slice(
                            txt.indexOf('"_id":') + '"_id":'.length + 1,
                            txt.indexOf(',"title":') - 1
                        )
                        if (id.includes('isbn')) {
                            id = id.split('","')[0]
                        }
                        books.push(id)
                    }
                });
            }
            console.log('Placing order...')
            var userId = this.props.userId
            var tot = this.state.total
            axios.post('/api/order', {
                clientId: userId,
                books: books,
                total: tot.toFixed(2),
                date: Date.now()
            }).then(response => {
                // alert('order response: ')
                // alert(JSON.stringify(response))
                if (response.status === 200) {
                    alert('Your order has been placed and will be processed and delivered as soon as possible!\nOrder ID: ' + response.data._id)
                    sessionStorage.setItem('cart',"")
                    this.handleLoad()
                }
            }).catch(error => {
                alert("An error occured:\n" + error.toString())
            })
        }.bind(this))
    }

    render() {
        return (
          <div>
            <h3 style={{ fontWeight: 'bold', fontFamily: 'Josefin Sans' }}>My Cart</h3>
            {sessionStorage.getItem('cart') === null || sessionStorage.getItem('cart') === '' ? (
                <p>Your cart is empty!
                </p>
            ) : (
                <div className="container" id="leCart">
                    <table className="table table-hover" style={{ textAlign: 'center' }}>
                        <thead>
                            <tr className="bg-success" style={{ fontFamily: 'Josefin Sans' }}>
                                <th scope="col-3"></th>
                                <th scope="col-3">Book</th>
                                <th scope="col-2">Price</th>
                                {/* <th scope="col-1">Quantity</th> */}
                                <th scope="col-1"></th>
                            </tr>
                        </thead>
                        <tbody id="cartBody">

                        </tbody>
                    </table>
                    <div className="container" style={{ textAlign: 'right', marginBottom: '3%' }}>
                        <h4 id="total" style={{ fontFamily: 'Josefin Sans', fontWeight: 'bold', marginRight: '10%' }}>Total: { this.state.total.toFixed(2) }$</h4>
                        <button className="btn btn-success" style={{ fontFamily: 'Josefin Sans', marginRight: '10%', 
                        fontSize: 'large', fontWeight: 'bold' }} id="orderBtn">Place Order</button>
                    </div>
                </div>
            )}
          </div>
        )
    }
}

export default Cart