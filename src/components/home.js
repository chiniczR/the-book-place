import React, { Component } from 'react'

class Home extends Component {
    // constructor() {
    //     super()
    // }
    render() {
        return (
            <div class="container-fuid">
              <div class="row" style={{ margin: '1%' }}>
                <div class="col-6" style={{ background: 'url(images/booksBG.jpg)' }}>
                    <h1 style={{ color: 'white', fontSize: '280%', fontFamily: 'Fugaz One', fontWeight: 'light',
                    textShadow: "-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black" }}><br></br>"The more that<br></br>you read,<br></br>
                    the more things<br></br>you will know.<br></br>The more that you<br></br>learn, the more<br></br>places you'll go."</h1>
                    <h3 style={{ color: 'white', textShadow: "-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black", fontWeight: 'bolder', marginBottom: '5%' }}>Dr. Seuss</h3>
                </div>
                <div class="col-6" style={{ textAlign: 'left' }}>
                    <h2 style={{ fontFamily: 'Josefin Sans', fontWeight: 'bold' }}>Welcome, everything is great!</h2>
                    <p>This is The Book Place, an online store and community for book lovers everywhere. Unlike many other online book sellers, we support local book shops:
                    every book you purchase in this site will be delivered to you from the nearest, physical book store that happens to have it. This way, we can guarantee
                    a speedy delivery for your books, while also helping your local book stores survive and thrive in the digital era.</p>
                    <p>Join us and aside from your favorite books, you will also find captivating discussions and articles about everything literature! The Book Place is
                    home to blogs and chats for all kinds of readers and writeres, free to participate and follow, even if you don't intend to purchase anything. Just
                    take part in the conversation!</p>
                    <p>Our top-of-the-line website has a gorgeous <b>React</b> frontend, a very efficient <b>ExpressJS</b> backend, in the marvelous MVC (Model-View-Controller) architecture,
                    with wonderful <b>Node.js</b> all around, and an incredible, very non-relational <b>MongoDB</b> database.</p>
                    <p>The icons used here are from <a href="https://fontawesome.com/v4.7.0/icons/" data-toggle="tooltip" data-placement="right" title="Font Awesome Icons (https://fontawesome.com/v4.7.0/icons/)">
                    Font Awesome v4</a> (except the favicon, which is from <a href="https://icons8.com" data-toggle="tooltip" data-placement="right" title="Icons 8 (https://icons8.com)">
                    Icons 8</a>), the images (including the favicon and excluding the user-uploaded profile pictures and the books' covers) are from <a href="https://pixabay.com/"
                    data-toggle="tooltip" data-placement="right" title="Pixabay (https://pixabay.com/)">Pixabay</a>, the illustrations are from <a href="https://www.freepik.com/free-photos-vectors/design"
                    data-toggle="tooltip" data-placement="right" title="Freepik (https://freepik.com)">Freepik</a> and the fonts are from <a href="https://fonts.google.com" data-toggle="tooltip" data-placement="right"
                    title="Google Fonts (https://fonts.google.com/)">Google Fonts</a>.</p>
                    <h6 style={{ fontSize: 'small' }}><br></br>This website was developed for the coursewide project of the course Software Engineering for the Internet
                    (151022/24) of the Jerusalem College of Technology (Lev Academic Center), by Rebeca Chinicz</h6>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '1%' }}>
                <h2 style={{ fontWeight: 'bolder' }}>So what are you waiting for?</h2>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold' }}>Join The Book Place right now!</p>
              </div>
              <p style={{ marginTop: '1.5%', marginBottom: '-0.10%', fontSize: 'small' }}>Found something interesting? Share it! </p>
              <div class="container-fluid" style={{ textAlign: 'center', width: '12%' }}>
                <div class="row">
                  <div class="col-sm-3">
                    <a href="https://facebook.com"><i class="fa fw fa-facebook"/></a>
                  </div>
                  <div class="col-sm-3">
                    <a href="https://twitter.com"><i class="fa fw fa-twitter"/></a>
                  </div>
                  <div class="col-sm-3">
                    <a href="https://plus.google.com"><i class="fa fw fa-google-plus"/></a>
                  </div>
                  <div class="col-sm-3">
                    <a href="https://instagram.com"><i class="fa fw fa-instagram"/></a>
                  </div>
                </div>
              </div>
            </div>
        )

    }
}

export default Home
