import React, { Component } from 'react'
import axios from 'axios'

const $ = window.$
const fileServer = 'http://localhost:8080/images/'

class BookMgmt extends Component {
    constructor() {
        super()
        this.state = {
            books: null,
            addBookCount: 0
        }

        this.getBooks = this.getBooks.bind(this)
        this.componentDidMount = this.componentDidMount(this)
    }

    componentDidMount() {
        this.getBooks()
    }

    getBooks() {
        axios.get('/api/books').then(response => {
            console.log('Get books response: ')
            console.log(response.data)
            if (response.data) {
                // alert('Got ' + response.data.length + ' books')
                this.setState({ books : response.data })
                $('#booksBody').ready(() => {
                    this.state.books.forEach(book => {
                        var tr = document.createElement('tr')
                        tr.style.textAlign = 'center'
                        tr.id = book.isbn + 'Row'

                        var coverTd = document.createElement('td')
                        var coverImg = document.createElement('img')
                            coverImg.style.height = '45%'
                            coverImg.style.maxHeight = '250px'
                            coverImg.style.width = '35%'
                            coverImg.src = fileServer + book.cover
                        coverTd.style.height = '45%'
                        coverTd.style.width = '30%'
                        coverTd.appendChild(coverImg)
                        tr.appendChild(coverTd)

                        var detailsTd = document.createElement('td')
                        var titleP = document.createElement('p')
                            titleP.style.fontFamily = 'Josefin Sans'
                            titleP.style.fontWeight = 'bold'
                            titleP.style.fontSize = 'large'
                            titleP.textContent = book.title
                        detailsTd.append(titleP)
                        var authorP = document.createElement('p')
                            authorP.textContent = 'Auhtor: ' + book.author
                        detailsTd.appendChild(authorP)
                        var publisherP = document.createElement('p')
                            publisherP.textContent = 'Publisher: ' + book.publisher + ' | Year published: ' + book.yearPublished
                        detailsTd.appendChild(publisherP)
                        var isbnP = document.createElement('p')
                            isbnP.textContent = 'ISBN-13: ' + book.isbn
                        detailsTd.appendChild(isbnP)
                        var langP = document.createElement('p')
                            langP.textContent = 'Language: ' + book.language + ' | Number of pages: ' + book.numOfPages
                        detailsTd.appendChild(langP)
                        var tagsDiv = document.createElement('div')
                        tagsDiv.textAlign = 'center'
                        book.tags.forEach(tag => {
                            var t = document.createElement('span')
                            t.style.backgroundImage = 'linear-gradient(-90deg,  LightGreen, Aquamarine)'
                            t.textContent = tag
                            t.style.width = (tag.length + 5) + '%'
                            t.style.display = 'inline-block'
                            t.style.margin = '1%'
                            t.style.borderRadius = '10px'
                            t.style.fontWeight = 'bolder'
                            tagsDiv.appendChild(t)
                        })
                        detailsTd.appendChild(tagsDiv)
                        detailsTd.style.width = '45%'
                        tr.appendChild(detailsTd)

                        var priceTd = document.createElement('td')
                        priceTd.classList.add('container')
                        priceTd.style.border = '0px transparent'
                        priceTd.style.textAlign = 'center'
                        var priceInput = document.createElement('input')
                            priceInput.style.textAlign = 'center'
                            priceInput.style.fontFamily = 'Josefin Sans'
                            priceInput.style.fontSize = 'larger'
                            priceInput.style.display = 'inline-block'
                            priceInput.style.width = '40%'
                            priceInput.type = 'number'
                            priceInput.id = book.isbn + 'Price'
                            priceInput.step = '0.01'
                            priceInput.min = '0.00'
                            priceInput.value = book.price
                            $(priceInput).change(function() {
                                document.getElementById(book.isbn + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                if (document.getElementById(book.isbn + 'Icon').classList.contains('btn-outline-secondary')) {
                                    document.getElementById(book.isbn + 'Icon').click()
                                }
                                if (priceInput.value !==  book.price) {
                                    document.getElementById(book.isbn + 'Row').style.background = 'rgb(200,200,255,0.7)'
                                }
                                else {
                                    document.getElementById(book.isbn + 'Row').style.background = 'transparent'
                                }
                            })
                        priceTd.appendChild(priceInput)
                        var dollarSign = document.createElement('span')
                        dollarSign.textContent = ' $'
                        dollarSign.style.fontSize = 'xx-large'
                        dollarSign.style.marginLeft = '1%'
                        priceTd.appendChild(dollarSign)
                        tr.appendChild(priceTd)

                        var delIcon = document.createElement('i')
                        delIcon.classList.add('fa', 'fw', 'fa-trash')
                        var delTd = document.createElement('td')
                        delTd.style.width = '10%'
                        delTd.appendChild(delIcon)
                        delTd.classList.add('btn-outline-danger')
                        delTd.id = book.isbn + 'Icon'
                        $(delTd).click(function(){
                            if (document.getElementById(book.isbn + 'Icon').firstChild.classList.contains('fa-trash'))
                            {
                                document.getElementById(book.isbn + 'Row').style.background = 'rgb(255,200,200,0.7)'
                                document.getElementById(book.isbn + 'Icon').firstChild.classList.remove('fa-trash')
                                document.getElementById(book.isbn + 'Icon').firstChild.classList.add('fa-undo')
                                document.getElementById(book.isbn + 'Icon').classList.remove('btn-outline-danger')
                                document.getElementById(book.isbn + 'Icon').classList.add('btn-outline-secondary')
                            }
                            else {  // If reset was clicked
                                document.getElementById(book.isbn + 'Row').style.background = 'inherit'
                                document.getElementById(book.isbn + 'Row').disabled = true
                                document.getElementById(book.isbn + 'Icon').firstChild.classList.remove('fa-undo')
                                document.getElementById(book.isbn + 'Icon').firstChild.classList.add('fa-trash')
                                document.getElementById(book.isbn + 'Icon').classList.add('btn-outline-danger')
                                document.getElementById(book.isbn + 'Icon').classList.remove('btn-outline-secondary')
                            }
                        })
                        tr.appendChild(delTd)

                        document.getElementById('booksBody').appendChild(tr)
                    });
                })
            }
        })
    }

    reload(e) {
        e.preventDefault()
        window.location.reload()
    }

    addBook(e) {
        // eslint-disable-next-line
        e.preventDefault()
        if (!document.getElementById('booksBody')) {
            return
        }
        // alert('Should add now... ' + this.state.addBookCount)
        const count = this.state.addBookCount + 1

        var tr = document.createElement('tr')
        tr.style.textAlign = 'center'
        tr.id = 'book' + count + 'Row'
        tr.style.background = 'rgb(200,255,200,0.7)'

        var coverTd = document.createElement('td')
        coverTd.classList.add('container')
        coverTd.style.height = '50%'
        coverTd.style.width = '32%'
        var coverDiv = document.createElement('form')
            coverDiv.style.height = '50%'
            coverDiv.style.width = '32%'
            coverDiv.style.background = 'LightGrey'
            coverDiv.style.border = '1px dashed DimGrey'
            coverDiv.action = '/api/coverUpload'
            coverDiv.method = 'post'
            coverDiv.enctype = 'multipart/form-data'
            coverDiv.id = 'book' + count + 'CoverForm'
            var coverInput = document.createElement('input')
                coverInput.id = 'book' + count + 'Cover'
                coverInput.type = 'file'
                coverInput.accept = 'image/*'
                coverInput.name = 'cover'
                coverInput.style.display = 'none'
                coverInput.onchange = function (e) {
                    var image = document.getElementById('outputBook' + count + 'Cover');
	                image.src = URL.createObjectURL(e.target.files[0]);
                }
            coverDiv.appendChild(coverInput)
            var uploadLabel = document.createElement('label')
                uploadLabel.style.cursor = 'pointer'
                uploadLabel.htmlFor = 'book' + count + 'Cover'
                var uploadIcon = document.createElement('i')
                    uploadIcon.classList.add('fa','fw','fa-plus-circle')
                uploadLabel.appendChild(uploadIcon)
                var uploadText = document.createTextNode(' Upload Image')
                uploadLabel.appendChild(uploadText)
            coverDiv.appendChild(uploadLabel)
            var coverImg = document.createElement('img')
            coverImg.id = 'outputBook' + count + 'Cover'
            coverImg.src = fileServer + '/default.png'
            coverImg.style.height = '120%'
            coverImg.style.maxHeight = '250px'
            coverImg.style.width = '100%'
        coverDiv.style.marginLeft = '33%'
        coverDiv.appendChild(coverImg)
        coverTd.appendChild(coverDiv)
        tr.appendChild(coverTd)
        
        var detailsTd = document.createElement('td')
        detailsTd.classList.add('form-group')
        detailsTd.style.fontSize = 'medium'
        var titleInput = document.createElement('input')
            titleInput.classList.add('form-control')
            titleInput.type = 'text'
            titleInput.id = 'book' + count + 'Title'
            titleInput.placeholder = 'Title'
            titleInput.style.marginTop = '1%'
        detailsTd.appendChild(titleInput)
        var authorInput = document.createElement('input')
            authorInput.classList.add('form-control')
            authorInput.type = 'text'
            authorInput.id = 'book' + count + 'Author'
            authorInput.placeholder = 'Author'
        detailsTd.appendChild(authorInput)
        var publishRow = document.createElement('div')
            publishRow.classList.add('row')
            var publisherCol = document.createElement('div')
                publisherCol.classList.add('col-8')
                var publisherIn = document.createElement('input')
                    publisherIn.classList.add('form-control')
                    publisherIn.type = 'text'
                    publisherIn.id = 'book' + count + 'Publisher'
                    publisherIn.placeholder = 'Publisher'
                publisherCol.appendChild(publisherIn)
            publishRow.appendChild(publisherCol)
            var yearCol = document.createElement('div')
                yearCol.classList.add('col-4')
                yearCol.style.verticalAlign = 'middle'
                var yearIn = document.createElement('input')
                    yearIn.classList.add('form-control')
                    yearIn.type = 'number'
                    yearIn.id = 'book' + count + 'Year'
                    yearIn.placeholder = 'Year'
                    yearIn.min = 1454
                    var d = new Date()
                    yearIn.max = d.getFullYear()
                yearCol.appendChild(yearIn)
            publishRow.appendChild(yearCol)
        detailsTd.appendChild(publishRow)
        var isbnInput = document.createElement('input')
            isbnInput.classList.add('form-control')
            isbnInput.type = 'text'
            isbnInput.id = 'book' + count + 'Isbn'
            isbnInput.placeholder = 'ISBN-13'
        detailsTd.appendChild(isbnInput)
        var langPageRow = document.createElement('div')
            langPageRow.classList.add('row')
            var langCol = document.createElement('div')
                langCol.classList.add('col-7')
                var langInput = document.createElement('input')
                    langInput.classList.add('form-control')
                    langInput.type = 'text'
                    langInput.id = 'book' + count + 'Lang'
                    langInput.placeholder = 'Language'
                langCol.appendChild(langInput)
            langPageRow.appendChild(langCol)
            var pageCol = document.createElement('div')
                pageCol.classList.add('col-5')
                pageCol.style.verticalAlign = 'middle'
                var pageInput = document.createElement('input')
                    pageInput.classList.add('form-control')
                    pageInput.type = 'number'
                    pageInput.id = 'book' + count + 'Page'
                    pageInput.placeholder = 'Number of Pages'
                    pageInput.min = 0
                    pageInput.max = 9609000
                pageCol.appendChild(pageInput)
            langPageRow.appendChild(pageCol)
        detailsTd.appendChild(langPageRow)
        var tagsDiv = document.createElement('div')
            tagsDiv.style.textAlign = 'center'
            tagsDiv.classList.add('row')
            tagsDiv.style.height = '5%'
            tagsDiv.style.marginTop = '1%'
            tagsDiv.style.marginLeft = '1%'
            var tagsLabel = document.createElement('label')
                tagsLabel.textContent = 'Tags: '
                tagsLabel.style.fontSize = 'large'
            tagsDiv.appendChild(tagsLabel)
            for (var i = 0; i < 3; i++) {
                var t = document.createElement('input')
                t.classList.add('col-3', 'form-control')
                t.style.borderRadius = '15px'
                t.style.marginLeft = '1%'
                t.style.height = '5%'
                t.style.fontSize = 'large'
                t.type = 'text'
                if (!i) {
                    t.placeholder = 'Tag 1 (Mandatory)'
                }
                else {
                    t.placeholder = 'Tag ' + (i+1) + ' (Optional)'
                }
                t.id = 'book' + count + 'Tag' + (i+1)
                tagsDiv.appendChild(t)
            }
        detailsTd.appendChild(tagsDiv)
        tr.appendChild(detailsTd)

        var priceTd = document.createElement('td')
        priceTd.classList.add('container')
        priceTd.style.border = '0px transparent'
        priceTd.style.textAlign = 'center'
        var priceInput = document.createElement('input')
            priceInput.style.textAlign = 'center'
            priceInput.style.fontSize = 'larger'
            priceInput.style.display = 'inline-block'
            priceInput.style.width = '40%'
            priceInput.type = 'number'
            priceInput.placeholder = 'Price'
            priceInput.id = 'book' + count + 'Price'
            priceInput.step = '0.01'
            priceInput.min = '0.00'
        priceTd.appendChild(priceInput)
        var dollarSign = document.createElement('span')
            dollarSign.textContent = ' $'
            dollarSign.style.fontSize = 'xx-large'
            dollarSign.style.marginLeft = '1%'
        priceTd.appendChild(dollarSign)
        tr.appendChild(priceTd)

        var delIcon = document.createElement('i')
            delIcon.classList.add('fa', 'fw', 'fa-trash')
        var delTd = document.createElement('td')
        delTd.style.width = '10%'
        delTd.appendChild(delIcon)
        delTd.classList.add('btn-outline-danger')
        delTd.id = 'book' + count + 'Icon'
        $(delTd).click(function(){
            tr.remove()
        })
        tr.appendChild(delTd)

        document.getElementById('booksBody').appendChild(tr)
        document.getElementById('pageBottom').scrollIntoView(false)
    }

    saveClick(e) {
        e.preventDefault()
        var rows = document.getElementById('booksBody').getElementsByTagName('tr')
        for(var i = 0; i < rows.length; i++) {
            var title = '', author = '', cover = '', publisher = '', isbn = '', year = '', language = ''
            var numOfPages = '', tag1 = '', tag2 = '', tag3 = '', price = '';
            var bookId = null
            // Row to be inserted
            if (rows.item(i).style.background.includes('(200, 255, 200, 0.7)')) {
                title = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Title').value
                if (title === '') {
                    alert('Please enter a title for the book at row no. ' + (i+1))
                    continue
                }
                author = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Author').value
                if (author === '') {
                    alert('Please enter the book\'s author\'s name in the appropiate field for the book at row no. ' + (i+1))
                    continue
                }
                cover = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Cover')
                cover = cover.files[0].name
                if (!cover || cover === '') {
                    alert('Please choose a valid image file for the book at row no. ' + (i+1))
                    continue
                }
                else if (!cover.startsWith('default.')) {
                    document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'CoverForm').submit()
                }
                // alert('Uploaded cover, going to continue')
                publisher = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Publisher').value
                if (publisher === '') {
                    alert('Please enter the book\'s publisherin the apporpriate field for the book at row no. ' + (i+1))
                    continue
                }
                isbn = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Isbn').value
                if (isbn === '') {
                    alert('Please the book\'s ISBN-13 in the appropiate field for the book at row no. ' + (i+1))
                    continue
                }
                if (!this.isValidIsbn(isbn.replace('-',''))) {
                    alert('Please enter a valid ISBN-13 for the book at row no. ' + (i+1))
                    continue
                }
                year = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Year').value
                if (year === '') {
                    alert('Please enter the book\'s publishing year in the appropriate field for the book at row no. ' + (i+1))
                    continue
                }
                var leDate = new Date()
                if (isNaN(parseInt(year,10)) || parseInt(year,10) < 1454 || parseInt(year,10) > leDate.getFullYear()) {
                    alert('Please enter a valid number as the book\'s publishing year for the book at row no. ' + (i+1))
                    continue
                }
                language = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Lang').value
                if (language === '') {
                    alert('Please enter the book\'s language in the appropriate field for the book at row no. ' + (i+1))
                    continue
                }
                numOfPages = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Page').value
                if (numOfPages === '') {
                    alert('Please enter the number of pages in the book, at the appropriate field for the book at row no. ' + (i+1))
                    continue
                }
                if (isNaN(parseInt(numOfPages,10)) || parseInt(numOfPages,10) < 1 || parseInt(numOfPages,10) > 9609000) {
                    alert('Please enter a valid number of pages for the book at row no. ' + (i+1))
                    continue
                }
                var tags = []
                tag1 = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Tag1').value
                if (tag1 === '') {
                    alert('Please enter at least one tag for the book at row no. ' + (i+1))
                    continue
                }
                tags.push(tag1)
                tag2 = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Tag2').value
                if (tag2 !== '') {
                    tags.push(tag2)
                }
                tag3 = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Tag3').value
                if (tag3 !== '') {
                    tags.push(tag3)
                }
                price = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Price').value
                if (isNaN(parseFloat(price)) || parseFloat(price) < 0.0) {
                    alert('Please enter a valid price for the book at row no. ' + (i+1))
                    continue
                }
                // Finally, after validating all the input, we can insert the new entry:
                axios.post('/api/book', {
                    title: title,
                    author: author,
                    isbn: isbn,
                    tags: tags,
                    numOfPages: parseInt(numOfPages,10),
                    yearPublished: parseInt(year,10),
                    publisher: publisher,
                    language: language,
                    cover: cover,
                    price: parseFloat(price)
                })
                .then((response) => {
                    if (response['error']) {
                        alert(response['error'])
                    }
                })
                .catch((err) => alert(err))
            }
            // Row to be updated
            else if (rows.item(i).style.background.startsWith('rgba(200, 200, 255, 0.7)')) {
                // eslint-disable-next-line
                bookId = this.state.books.find(function(book) {
                    if (book.isbn === rows.item(i).id.replace('Row','')) {
                        return book
                    }
                })
                price = document.getElementById(rows.item(i).id.substr(0,rows.item(i).id.length - 'Row'.length) + 'Price').value
                if (isNaN(parseFloat(price)) || parseFloat(price) < 0.0) {
                    alert('Please enter a valid price for the book at row no. ' + (i+1))
                    continue
                }
                axios.post('/api/update',{
                    id: bookId._id,
                    price: price
                })
                .then(response => {
                    if (response.error) {
                        alert(response.error)
                    }
                    // alert(JSON.stringify(response))
                })
                .catch(err => { alert(err) })
            }
            // Row to be deleted
            else if (rows.item(i).style.background.startsWith('rgba(255, 200, 200, 0.7)')) {
                // eslint-disable-next-line
                bookId = this.state.books.find(function(book) {
                    if (book.isbn === rows.item(i).id.replace('Row','')) {
                        return book
                    }
                })
                axios.post('/api/delete', { id: bookId._id })
                .then(response => {
                    if (response.error) {
                        alert(response.error)
                    }
                })
                .catch(err => { alert(err) })
            }
        }

        alert("Changes saved")
        document.getElementById('reloadBtn').click()
    }

    topClick(e) {
        e.preventDefault()
        document.getElementById('welcomeP').scrollIntoView()
    }

    isValidIsbn(str) {
        return true;
        // if (!str || str === ''){
        //     return false
        // }

        // var sum,
        //     weight,
        //     digit,
        //     check,
        //     i;
    
        // str = str.replace(/[^0-9X]/gi, '');
    
        // if (str.length !== 10 && str.length !== 13) {
        //     return false;
        // }
    
        // if (str.length === 13) {
        //     sum = 0;
        //     for (i = 0; i < 12; i++) {
        //         // eslint-disable-next-line
        //         digit = parseInt(str[i]);
        //         if (i % 2 === 1) {
        //             sum += 3*digit;
        //         } else {
        //             sum += digit;
        //         }
        //     }
        //     check = (10 - (sum % 10)) % 10;
        //     return (check === str[str.length-1]);
        // }
    
        // if (str.length === 10) {
        //     weight = 10;
        //     sum = 0;
        //     for (i = 0; i < 9; i++) {
        //         // eslint-disable-next-line
        //         digit = parseInt(str[i]);
        //         sum += weight*digit;
        //         weight--;
        //     }
        //     check = 11 - (sum % 11);
        //     if (check === 10) {
        //         check = 'X';
        //     }
        //     return (check === str[str.length-1].toUpperCase());
        // }
    }

    render() {
        return (
            <div>
                {(!this.props.loggedIn || this.props.role !== 'admin') && (!this.props.loggedIn || this.props.role !== 'supplier') ? (
                    <p>You must be an admin or a supplier to access this page</p>
                ) : (
                    <div className="container-fluid">
                        <p id="welcomeP">Welcome, { this.props.role } user!</p>
                        <p style={{ textAlign: 'center' }}>
                            Entry color code:
                            <mark style={{ background: 'rgb(200,255,200,0.7)', marginRight: '0.5%', marginLeft: '0.5%' }}>New</mark> 
                            <mark style={{ background: 'rgb(200,200,255,0.7)', marginRight: '0.5%' }}>Edited</mark> 
                            <mark style={{ background: 'rgb(255,200,200,0.7)', marginRight: '0.5%' }}>To be deleted</mark>
                            <mark style={{ background: 'rgb(245,245,245,0.7)', border: '1px solid rgb(200,200,200)' }}>Unaltered</mark>
                        </p>
                        <button className="btn-outline-success" onClick={this.addBook.bind(this)} style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                            <i className="fa fw fa-plus"/> Add Book</button>
                        <button className="btn-outline-primary" onClick={ this.saveClick.bind(this) } style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                            <i className="fa fw fa-floppy-o"/> Save Changes</button>
                        <button className="btn-outline-info" onClick={this.reload} id="reloadBtn" style={{ height: '40px',
                             borderRadius: '5px', fontFamily: 'Josefin Sans', fontWeight: 'bolder', fontSize: 'large' }}>
                            <i className="fa fw fa-undo"/> Refresh/Reset</button>
                            <div className="container-fluid" style={{ marginTop: '1%' }}>
                            <table className="table table-hover" style={{ textAlign: 'center' }}>
                                <thead>
                                    <tr className="bg-success" style={{ fontFamily: 'Josefin Sans' }}>
                                        <th scope="col-1">Cover</th>
                                        <th scope="col-1">Details</th>
                                        <th scope="col-1">Price</th>
                                        <th scope="col-2">Option</th>
                                    </tr>
                                </thead>
                                <tbody id="booksBody" style={{ textAlign: 'center' }}>

                                </tbody>
                            </table>
                            <a id="pageBottom" onClick={ this.topClick } href='/bookmgmt' style={{ margin: '5%',
                            fontFamily: 'Josefin Sans', fontWeight: 'bold' }}>RETURN TO THE TOP OF THE TABLE</a>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default BookMgmt