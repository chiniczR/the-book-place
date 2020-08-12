import React, { Component } from 'react'
import axios from 'axios'

const $ = window.$

class Catalog extends Component {
    constructor() {
        super()
        this.state = {
            books: [],
            filtered: [],
            reloadCount: 0
        }
        this.getBooks = this.getBooks.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleLoad = this.handleLoad.bind(this)
        this.showAllAuthors = this.showAllAuthors.bind(this)
    }

    componentDidMount() {
      this.getBooks()
      window.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
       window.removeEventListener('load', this.handleLoad)
    }

    getBooks() {
      axios.get('/api/books').then(response => {
        // alert('Get books response: ' + JSON.stringify(response.data))
        if (response.data) {
            // alert('Getting books now')
            this.setState({books : response.data.sort(function(a, b){
                return ('' + a.title.toString()).localeCompare(b.title.toString());
            })});
            this.handleLoad()
            // alert('axios Books: ' + JSON.stringify(this.state.books))
        }
      })
    }

    handleLoad() {
     $("#catalogDiv").ready(function(){
         // alert('Need books now')
         var count = 0, rowNum = 0
         $("#catalogDiv").empty()
         this.state.books.forEach((book) => {
           // alert('Count = ' + count + '\nRowNum = ' + rowNum)
           var row, deck;
           if (count % 4 === 0) {
             row = document.createElement('div')
             row.classList.add('row')
             row.style.marginBottom = "-1%"
             deck = document.createElement('div')
             deck.classList.add('card-deck')
             deck.id = 'deck' + rowNum.toString()
             row.appendChild(deck)
             rowNum++
           }
           else {
             deck = document.getElementById('catalogDiv').children[rowNum-1].children[0]
             // if (!deck) { alert('Deck is null') }
           }

           var card = document.createElement('div');
           card.classList.add('card')
           card.style.height = "90%"
           // card.style.width = "500px"

            var imgCap = document.createElement('div')
            imgCap.classList.add('card-img-caption')
            imgCap.style.height = "70%"

            var imgTxt = document.createElement('p')
            imgTxt.classList.add('card-text')
            imgTxt.textContent = 'Title: "' + book.title.toString() + '", Author: '
            + book.author.toString() + ', Publisher: ' + book.publisher.toString() +
            ', Year Published: ' + book.yearPublished.toString() +
            ', No. of pages: ' + book.numOfPages.toString() + ', Language: ' +
            book.language.toString() + ', ISBN:' + book.isbn.toString() +
            ', Tags: '
            book.tags.forEach((tag,i) => {
              imgTxt.textContent += '"' + tag + '",'
            });
            var temp = imgTxt.textContent.toString().substring(0,imgTxt.textContent.toString().lastIndexOf(','))
            imgTxt.textContent = temp
            imgTxt.style.fontWeight = 'bold'
            imgTxt.style.fontSize = 'large'
            if (book.title.toString().length > 100) {
              imgTxt.style.fontSize = 'medium'
            }
            imgTxt.style.color = 'white'
            imgTxt.style.textShadow = '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black'
            imgTxt.style.display = 'none'
            imgCap.appendChild(imgTxt)

             var img = document.createElement('img')
             img.classList.add('card-img-top')
             img.id = 'img' + count.toString()
             img.src = "../images/" + book.cover.toString().trim()
             img.alt = book.title
             img.style.height = "100%"
             imgCap.appendChild(img)
             $(imgCap).mouseover(function(book){
               // alert(JSON.stringify(book) + '\n' + img.toString())
               img.style.filter = 'blur(5px)'
               imgTxt.style.display = 'block'
             }.bind(this,book))
             $(imgCap).mouseleave(function(book){
               // alert(JSON.stringify(book) + '\n' + img.toString())
               img.style.filter = 'none'
               imgTxt.style.display = 'none'
             }.bind(this,book))

             card.appendChild(imgCap)

             var body = document.createElement('div')
             body.classList.add('card-body')

              var title = document.createElement('h4')
              title.classList.add('card-title')
              title.style.fontFamily = "Josefin Sans"
              title.style.fontWeight = "bold"
              if (book.title.toString().length > 16) {
                title.textContent = book.title.toString().substring(0,15) + '...'
              }
              else {
                title.textContent = book.title.toString()
              }

              body.appendChild(title)

              var text = document.createElement('p')
              text.classList.add('card-text')
              text.textContent = book.author.toString()
              text.style.marginTop = '-15px'
              body.appendChild(text)

              // dets.addEventListener('click', this.bookDetsClick.bind(this,book));

              var smRow = document.createElement('div')
              smRow.classList.add('row')
              smRow.style.marginTop = '15px'

                var priceCol = document.createElement('div')
                  priceCol.classList.add('col-sm-6')
                  var priceTxt = document.createElement('p')
                  priceTxt.style.fontFamily = 'Josefin Sans'
                  priceTxt.style.fontSize = 'xx-large'
                  priceTxt.style.fontWeight = 'bolder'
                  priceTxt.style.color = 'green'
                  priceTxt.textContent = book.price.toString() + '$'
                  priceCol.appendChild(priceTxt)
                smRow.appendChild(priceCol)

                var btnCol = document.createElement('div')
                btnCol.classList.add('col-sm-6')
                  var addBtn = document.createElement('a')
                  addBtn.style.fontFamily = "Josefin Sans"
                  addBtn.classList.add('btn', 'btn-success')
                  addBtn.href = "/"
                  addBtn.textContent = "Add to Cart"
                  $(addBtn).click(function(e){
                    e.preventDefault()
                    // alert("Will add to cart book with ID: " + book._id.toString())
                    var cart = sessionStorage.getItem('cart')
                    var al = null
                    if(cart && cart.includes(book._id)) {
                      document.getElementById('inCartAlert').style.display = 'block'
                      al = document.createElement('p')
                      al.textContent = '"' + book.title + '" is already in your cart!'
                      document.getElementById('inCartAlert').appendChild(al)
                      window.scrollTo(0, 0);  
                    }
                    else {   
                      if (cart === null) {
                        cart = ""
                      }              
                      // alert("Going to add: " + JSON.stringify(book))
                      cart += '#' + JSON.stringify(book)
                      sessionStorage.setItem('cart',cart)
                      document.getElementById('addedAlert').style.display = 'block'
                      al = document.createElement('p')
                      al.textContent = '"' + book.title + '" was successfully added to your cart! Go to "MY CART" to place your order.'
                      document.getElementById('addedAlert').appendChild(al)
                      window.scrollTo(0, 0); 
                    }
                  })
                  btnCol.appendChild(addBtn)
                smRow.appendChild(btnCol)

              body.appendChild(smRow)

            card.appendChild(body)

          deck.appendChild(card)
          if (count % 4 === 0) {
            document.getElementById('catalogDiv').appendChild(row)
          }
          count++
         });
     }.bind(this));

     $("#authorFilter").ready(function(){
       var authors = []
       var showAllBtn = document.getElementById('showAllAuthorsBtn')
       $("#authorFilter").empty()
       document.getElementById('authorFilter').appendChild(showAllBtn)
       this.state.books.forEach((book) => {
         if (!authors.includes(book.author.toString())) {
           authors.push(book.author.toString())
           var filterBtn = document.createElement('button')
           filterBtn.classList.add('btn', 'btn-outline-default', 'btn-sm')
           filterBtn.textContent = book.author.toString()
           $(filterBtn).click(function(author){
             var input = author
             var filter = input.toLowerCase();
             var div = document.getElementById("catalogDiv");
             for (var j = 0; j < div.children.length; j++) {
               for (var k = 0; k < (div.children.item(j).children.item(0).children).length; k++) {
                 var card = div.children.item(j).children.item(0).children.item(k)
                 var txtValue = card.getElementsByTagName('p')[1].textContent;
                 if (txtValue.toLowerCase().indexOf(filter) > -1) {
                   card.style.display = "block";
                 } else {
                   card.style.display = "none";
                 }
               };
             }
             for (var i = 0; i < document.getElementById('authorFilter').children.length; i++) {
               document.getElementById('authorFilter').children.item(i).classList.remove('active')
             }
             if (!filterBtn.classList.contains('active')) {
               filterBtn.classList.add('active')
             }
           }.bind(this,book.author))
           document.getElementById('authorFilter').appendChild(filterBtn)
         }
       });
     }.bind(this))
   }

   showAllAuthors() {
     // alert('Should show all')
     for (var i = 0; i < document.getElementById('authorFilter').children.length; i++) {
       document.getElementById('authorFilter').children.item(i).classList.remove('active')
     }
     if (!document.getElementById('showAllAuthorsBtn').classList.contains('active')) {
       document.getElementById('showAllAuthorsBtn').classList.add('active')
     }
     this.handleLoad()
   }

   searchFunction() {
      // Declare variables
      // alert('in search function')
      var input, filter, div, txtValue;
      input = document.getElementById('searchBar');
      // alert("Searching for input: " + input.value)

      filter = input.value.toLowerCase();
      div = document.getElementById("catalogDiv");
      for (var j = 0; j < div.children.length; j++) {
        for (var k = 0; k < (div.children.item(j).children.item(0).children).length; k++) {
          var card = div.children.item(j).children.item(0).children.item(k)
          txtValue = card.getElementsByTagName('img')[0].alt;
          if (txtValue.toLowerCase().indexOf(filter) > -1) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        };
      }
   }

   hideAlert(e) {
    e.preventDefault()
    var child = null
    if (e.target.id.toString() === "closeAdded") {
      document.getElementById('addedAlert').style.display = 'none'
      child = document.getElementById('addedAlert').lastElementChild;  
      while (child) { 
        document.getElementById('addedAlert').removeChild(child); 
        child = document.getElementById('addedAlert').lastElementChild; 
      } 
      document.getElementById('addedAlert').appendChild(e.target)
    }
    else {
      document.getElementById('inCartAlert').style.display = 'none'
      child = document.getElementById('inCartAlert').lastElementChild;  
      while (child) { 
        document.getElementById('inCartAlert').removeChild(child); 
        child = document.getElementById('inCartAlert').lastElementChild; 
      } 
      document.getElementById('inCartAlert').appendChild(e.target)
    }
   }

    render() {
      return (
        <div id="mainDiv">
        {!this.props.loggedIn ? (
          <p>You must be logged in to access this page
          </p>
        ) : (
          <div className="container-fluid" id="totContainer">
            <div id="inCartAlert" className="alert alert-info alert-dismissible" style={{ display: 'none' }}>
              <button id="closeInCart" type="button" className="close" onClick={this.hideAlert.bind(this)}>&times;</button>
            </div>
            <div id="addedAlert" className="alert alert-success alert-dismissible" style={{ display: 'none' }}>
              <button id="closeAdded" type="button" className="close" onClick={this.hideAlert.bind(this)}>&times;</button>
            </div>
            <div className="row">
              <div className="col-3">
                <div className="container-fluid" style={{ border: '1px solid green', fontWeight: 'bold', textAlign: 'center' }}>
                  Filter By Author
                  <div className="scroll-container" id="authorFilter">
                    <button className="btn btn-outline-info btn-sm active" id="showAllAuthorsBtn" onClick={this.showAllAuthors}> Show all</button>
                  </div>
                </div>

              </div>
              <div className="col-9">
                <input type="text" id="searchBar" style={{ marginBottom: "2%" }} onKeyUp={this.searchFunction} placeholder="Search for books.."/>
                <div className="container" id="catalogDiv">

                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      )
    }
}

export default Catalog
