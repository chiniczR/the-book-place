import React, { Component } from 'react'
import axios from 'axios'

const $ = window.$

class Orders extends Component {
    constructor() {
        super()

        this.state = { orders: null, books: null }
        console.log(JSON.stringify(this.props))
        this.isEmployee = this.isEmployee.bind(this)
        this.getUserId = this.getUserId.bind(this)
        this.getOrders = this.getOrders.bind(this)
        this.getBooks = this.getBooks.bind(this)
        this.componentDidMount = this.componentDidMount(this)
    }

    isEmployee() {
        return this.props.loggedIn && (this.props.role === 'admin' || this.props.role === 'clerk') 
    }

    getUserId() {
        return this.props.userId
    }

    componentDidMount() {
        this.getBooks()
    }

    getBooks() {
        axios.get('/api/books').then(response => {
            if (response.data) {
                this.setState({ books: response.data })
                this.getOrders()
            }
        }).catch(err => { alert(err) })
    }

    getOrders() {
        axios.get('/api/orders').then(response => {
            if (response.data) {
                // alert('Orders:\n' + JSON.stringify(response.data))
                this.setState({ orders: response.data.sort((a,b) => {
                    return b.creationDate > a.creationDate
                }) })
                $('#ordersBody').ready(() => {
                    this.state.orders.forEach(order => {
                        // alert(JSON.stringify(order))
                        var tr = document.createElement('tr')
                        tr.style.textAlign = 'center'
                        tr.id = order._id + 'Row'

                        var orderIdTd = document.createElement('td')
                            orderIdTd.textContent = order._id
                            orderIdTd.style.fontSize = 'large'
                            orderIdTd.style.fontWeight = 'bold'
                            orderIdTd.style.verticalAlign = 'middle'
                            if (this.isEmployee) {
                                orderIdTd.style.width = '15%'
                            }
                            else {
                                orderIdTd.style.width = '20%'
                            }
                        tr.appendChild(orderIdTd)

                        if (this.isEmployee()) {
                            var clientIdTd = document.createElement('td')
                            clientIdTd.textContent = order.clientId
                            clientIdTd.style.fontSize = 'large'
                            clientIdTd.style.fontWeight = 'bold'
                            clientIdTd.style.width = '15%'
                            clientIdTd.style.verticalAlign = 'middle'
                            tr.appendChild(clientIdTd)
                        }

                        var dateTd = document.createElement('td')
                            dateTd.style.textAlign = 'center'
                            dateTd.style.fontSize = 'large'
                            dateTd.style.fontWeight = 'bold'
                            if (this.isEmployee()) {
                                dateTd.style.width = '15%'
                            }
                            else {
                                dateTd.style.width = '20%'
                            }                            
                            dateTd.style.verticalAlign = 'middle'
                            dateTd.textContent = order.creationDate.split('T')[0] + ' @ ' + order.creationDate.split('T')[1].substr(0,8)
                        tr.appendChild(dateTd)

                        var booksTd = document.createElement('td')
                            var titles = []
                            var authors = []
                            this.state.books.forEach(b => {
                                if (order.books.includes(b._id)) {
                                    titles.push(b.title)
                                    authors.push(b.author)
                                }
                            })
                            var booksDiv = document.createElement('div')
                            booksDiv.style.textAlign = 'center'
                            for (var i = 0; i < titles.length; i++) {
                                var h5 = document.createElement('p')
                                h5.style.fontSize = 'large'
                                h5.style.textAlign = 'center'
                                var titleSpan = document.createElement('span')
                                    titleSpan.style.fontWeight = 'bolder'
                                    titleSpan.textContent = titles[i]
                                h5.appendChild(titleSpan)
                                var authorSpan = document.createElement('span')
                                    authorSpan.textContent = ', ' + authors[i]
                                h5.appendChild(authorSpan)
                                h5.style.width = (titles[i].length + authors[i].length + 15) + '%'
                                h5.style.maxWidth = '100%'
                                h5.style.borderRadius = '15px'
                                h5.style.display = 'block'
                                h5.style.backgroundImage = 'linear-gradient(-180deg,  rgba(152, 251, 152, 0.6), rgba(127, 255, 212, 0.3))'
                                booksDiv.appendChild(h5)
                            }
                            if (this.isEmployee()) {
                                booksTd.style.width = '25%'
                            }
                            else {
                                booksTd.style.width = '30%'
                            }
                            booksTd.appendChild(booksDiv)
                        tr.appendChild(booksTd)

                        var totalTd = document.createElement('td')
                        totalTd.style.textAlign = 'center'
                        if (this.isEmployee()) {
                            var totalRow = document.createElement('div')
                                totalRow.classList.add('row')
                            var totalInput = document.createElement('input')
                                totalInput.type = 'number'
                                totalInput.value = order.total
                                totalInput.id = order._id + 'Total'
                                totalInput.classList.add('form-control')
                                totalInput.classList.add('col-sm-8')
                                totalInput.style.fontFamily = 'Josefin Sans'
                                totalInput.step = '0.01'
                                totalInput.min = 0.0
                                $(totalInput).change(function() {
                                    if (Math.abs(totalInput.value - order.total) > 0.009) {
                                        tr.style.background = 'rgb(200,200,255,0.7)'
                                    }
                                    else {
                                        tr.style.background = 'transparent'
                                    }
                                })
                            totalRow.appendChild(totalInput)
                            var dollarSign = document.createElement('span')
                                dollarSign.htmlFor = order._id + 'Total'
                                dollarSign.textContent = '$ (USD)'
                                dollarSign.style.fontFamily = 'Josefin Sans'
                                dollarSign.style.fontWeight = 'bold'
                                dollarSign.classList.add('col-sm-4')
                            totalRow.appendChild(dollarSign)
                            totalTd.appendChild(totalRow)
                            totalTd.style.width = '15%'
                        }
                        else {
                            totalTd.textContent = order.total + ' $'
                            totalTd.style.fontFamily = 'Josefin Sans'
                            totalTd.style.fontSize = 'large'
                            totalTd.style.verticalAlign = 'middle'
                            totalTd.style.width = '10%'
                        }
                        tr.appendChild(totalTd)
                        
                        var statusTd = document.createElement('td')
                        if (this.isEmployee()) {
                            var statSelect = document.createElement('select')
                                statSelect.classList.add('form-control')
                                statSelect.id = order._id + 'Status'
                                var placedOp = document.createElement('option')
                                placedOp.textContent = 'placed'
                                if (order.status === 'placed') {
                                    placedOp.selected = true
                                }
                                statSelect.appendChild(placedOp)
                                var enrouteOp = document.createElement('option')
                                enrouteOp.textContent = 'en route'
                                if (order.status === 'en route') {
                                    enrouteOp.selected = true
                                }
                                statSelect.appendChild(enrouteOp)
                                var deliveredOp = document.createElement('option')
                                deliveredOp.textContent = 'delivered'
                                if (order.status === 'delivered') {
                                    deliveredOp.selected = true
                                }
                                statSelect.appendChild(deliveredOp)
                                var canceledOp = document.createElement('option')
                                canceledOp.textContent = 'canceled'
                                if (order.status === 'canceled') {
                                    canceledOp.selected = true
                                }
                                statSelect.appendChild(canceledOp)
                                $(statSelect).change(function() {
                                    if (statSelect.value !== order.status) {
                                        tr.style.background = 'rgb(200,200,255,0.7)'
                                    }
                                    else {
                                        tr.style.background = 'transparent'
                                    }
                                })
                            statusTd.appendChild(statSelect)
                        }
                        else {
                            statusTd.textContent = order.status
                            statusTd.style.fontSize = 'large'
                            statusTd.style.verticalAlign = 'middle'
                        }
                        statusTd.style.width = '10%'
                        tr.appendChild(statusTd)

                        if (this.isEmployee()) {
                            var delIcon = document.createElement('i')
                            delIcon.classList.add('fa', 'fw', 'fa-trash')
                            var delTd = document.createElement('td')
                            delTd.style.width = '10%'
                            delTd.appendChild(delIcon)
                            delTd.classList.add('btn-outline-danger')
                            delTd.id = order._id + 'Icon'
                            $(delTd).click(function(){
                                if (document.getElementById(order._id + 'Icon').firstChild.classList.contains('fa-trash'))
                                {
                                    document.getElementById(order._id + 'Row').style.background = 'rgb(255,200,200,0.7)'
                                    document.getElementById(order._id + 'Icon').firstChild.classList.remove('fa-trash')
                                    document.getElementById(order._id + 'Icon').firstChild.classList.add('fa-undo')
                                    document.getElementById(order._id + 'Icon').classList.remove('btn-outline-danger')
                                    document.getElementById(order._id + 'Icon').classList.add('btn-outline-secondary')
                                }
                                else {  // If reset was clicked
                                    document.getElementById(order._id + 'Row').style.background = 'inherit'
                                    document.getElementById(order._id + 'Row').disabled = true
                                    document.getElementById(order._id + 'Icon').firstChild.classList.remove('fa-undo')
                                    document.getElementById(order._id + 'Icon').firstChild.classList.add('fa-trash')
                                    document.getElementById(order._id + 'Icon').classList.add('btn-outline-danger')
                                    document.getElementById(order._id + 'Icon').classList.remove('btn-outline-secondary')
                                }
                            })
                            tr.appendChild(delTd)
                        }

                        // We only want a client user to see the rows with their own orders
                        if (!this.isEmployee() && order.clientId !== this.getUserId()) {
                            tr.style.display = 'none'
                        }

                        document.getElementById('ordersBody').appendChild(tr)
                    });

                    // alert('Got books:\n' + JSON.stringify(this.state.books))
                })
            }
        }).catch( err => { alert(err) } )
    }

    saveClick(e) {
        e.preventDefault()
        var rows = document.getElementById('ordersBody').getElementsByTagName('tr')
        for(var i = 0; i < rows.length; i++) {
            // eslint-disable-next-line
            var order = this.state.orders.find(o => {
                if (o._id === rows[i].children.item(0).textContent) {
                    return o
                }
            })
            // Row(s) to be updated
            if (rows[i].style.background.toString().includes('rgba(200, 200, 255, 0.7)')) {
                var total = -1
                try {
                    total = parseFloat((document.getElementById(order._id + 'Total')).value)
                }
                catch (e) {
                    alert('Please enter a valid total for order with ID=' + order._id)
                    continue
                }
                if (total < 0) { 
                    alert('Please enter a valid total for order with ID=' + order._id)
                    continue
                }
                var status = (document.getElementById(order._id + 'Status')).value
                // alert('Total=' + total + ' Status=' + status)
                // alert('Going to update:\n' + JSON.stringify(order))
                axios.post('/api/update_order', {
                    id: order._id,
                    total: total,
                    status: status
                }).catch(err => { alert(err) })
            }
            // Row(s) to be deleted
            else if (rows[i].style.background.toString().includes('rgba(255, 200, 200, 0.7)')) {
                axios.post('/api/delete_order', {
                    id: order._id
                }).catch(err => { alert(err) })
            }
        }
        document.getElementById('reloadOrdersBtn').click()
    }

    reload(e) {
        e.preventDefault()
        window.location.reload()
    }

    topClick(e) {
        e.preventDefault()
        document.getElementById('ordersTop').scrollIntoView()
    }

    render() {
        return (
          <div>
            { (!this.props.loggedIn || this.props.role === 'supplier') &&
                <p>{ this.props.loggedIn } You must be logged in as a client, a clerk or an admin to access this page</p>
            }
            { (this.props.loggedIn && this.props.role === 'client') &&
                <div>
                    <h3 style={{ fontWeight: 'bolder', fontFamily: 'Josefin Sans' }}>Your Orders</h3>
                </div>
            }    
            { (this.props.loggedIn && (this.props.role === 'clerk' || this.props.role === 'admin')) &&
                <div>
                    <h3 style={{ fontWeight: 'bodler', fontFamily: 'Josefin Sans' }}>Orders Management</h3>
                    <p style={{ textAlign: 'center' }}>
                        Entry color code:
                        <mark style={{ background: 'rgb(200,200,255,0.7)', marginRight: '0.5%', marginLeft: '0.5%' }}>Edited</mark> 
                        <mark style={{ background: 'rgb(255,200,200,0.7)', marginRight: '0.5%' }}>To be deleted</mark>
                        <mark style={{ background: 'rgb(245,245,245,0.7)', border: '1px solid rgb(200,200,200)' }}>Unaltered</mark>
                    </p>
                    <button className="btn-outline-primary" onClick={ this.saveClick.bind(this) } style={{ height: '40px',
                        borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                        <i className="fa fw fa-floppy-o"/> Save Changes</button>
                    <button className="btn-outline-info" onClick={this.reload} id="reloadOrdersBtn" style={{ height: '40px',
                        borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                        <i className="fa fw fa-undo"/> Refresh/Reset</button>
                </div>
            }    
            <div className="container-fluid" id="ordersTop" style={{ marginTop: '1%' }}>
                <table className="table table-hover" style={{ textAlign: 'center' }}>
                    <thead>
                        <tr className="bg-success" style={{ fontFamily: 'Josefin Sans' }}>
                            <th scope="col-1">Order ID</th>
                            { (this.props.role === 'admin' || this.props.role === 'clerk') &&
                                <th scope="col-2">Client ID</th>
                            }
                            <th scope="col-1">Date Placed</th>
                            <th scope="col-1">Books</th>
                            <th scope="col-1">Total</th>
                            <th scope="col-2">Status</th>
                            { (this.props.role === 'admin' || this.props.role === 'clerk') &&
                                <th scope="col-2">Option</th>
                            }
                        </tr>
                    </thead>
                    <tbody id="ordersBody" style={{ textAlign: 'center' }}>

                    </tbody>
                </table>
                { (this.state.orders) && 
                    <a id="ordersPageBottom" onClick={ this.topClick } href='/bookmgmt' style={{ margin: '5%',
                    fontFamily: 'Josefin Sans', fontWeight: 'bold' }}>RETURN TO THE TOP OF THE TABLE</a>
                }
            </div>
          </div>
        )
    }
}

export default Orders