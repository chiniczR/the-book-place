import React, { Component } from 'react'
import axios from 'axios'
import socketIOClient from "socket.io-client";

const $ = window.$
const socket = socketIOClient('http://localhost:5000');

class Social extends Component {
  constructor(props) {
      super(props)

      // alert('Props received by Social BEFORE:\n' + JSON.stringify(this.props))
      this.state = { groups: null, room: null, posts: [], profiles: null, msgs: [], typing: null, displayCount: 0 }

      this.getGroups = this.getGroups.bind(this)
      this.getProfiles = this.getProfiles.bind(this)
      this.handleLoad = this.handleLoad.bind(this)
      this.componentDidMount = this.componentDidMount(this)
  }

  getProfiles() {
    console.log('Got to get profiles')
    axios.get('/api/profiles').then(response => {
      if (response.data) {
        this.setState({ profiles: response.data })
        this.handleLoad() 
      }
    })
    .catch(err => { alert('Something went wrong retrieving the user profiles:\n' + err) })
    console.log('Left get profiles')
  }

  getData = postItems => {
    setTimeout(() => {
      console.log(JSON.stringify(postItems))
      this.setState({ posts: postItems });
      var len = postItems.length
      if (len > 20) {
        this.setState({ displayCount: 20 })
        document.getElementById('podText').textContent = "20 Posts On Display"
      }
      else {
        document.getElementById('podText').textContent = len + " Posts On Display"
      }
      this.getPostData()
    }, 100);
  };
  changeData = () => {  document.getElementById('socialHeader').scrollIntoView(); socket.emit("initial_data"); }
  getMsgs = msgItems => {
    var arr = this.state.msgs
    arr.push(msgItems)
    this.setState({ msgs: arr })
    this.getMsgData()
  }
  getTyping = typing => {
    // alert('Someone is typing. That\'s ' + typing.username)
    this.setState({ typing: typing.username })
    this.getTypingData()
  }

  componentDidMount() {
    console.log('Got to component did mount')
    this.getGroups()
    this.handleLoad()
    window.addEventListener('load', this.handleLoad);
    console.log('Left component did mount')
  }

  getGroups() {
    console.log('Got to get groups')
    if (this.props.username === null) {
      setTimeout(() => {
        // alert('Props received by Social on Get groups:\n' + JSON.stringify(this.props));
        const user = this.props.username
        axios.post('/api/user_groups/', { user: user }).then(response => {
          if (response.data) {
            this.setState({ groups: response.data })
            socket.emit("initial_data");
            socket.on("get_data", this.getData);
            socket.on("change_data", this.changeData);
            socket.on("typing", this.getTyping)
            socket.on("new_message", this.getMsgs)
            this.getProfiles()
          }
        })
        .catch(err => {
          alert('Something went wrong when trying to retrieve the chatrooms...\nHere\'s what the error message says:\n' + err)
        })
      }, 100)
    }
    console.log('Left get groups')
  }

  componentWillUnmount() {
    socket.off("get_data");
    socket.off("change_data");
    window.removeEventListener('load', this.handleLoad)
  }

  handleLoad() {
    console.log('Got to handle load')
    $('menuContainer').ready(function() {
      document.getElementById('menuContainer').style.display = 'none'
    })
    $('nav-container').ready(function() {
      document.getElementById('nav-container').style.height = '1%'
    })
    $('menuRow').ready(function() {
      document.getElementById('menuRow').children.item(0).children.item(0).style.fontSize = '0%'
      document.getElementById('menuRow').style.height = '5%'
    })
    $('socialHeader').ready(function() {
      if (!document.getElementById('socialHeader')) { return }
      document.getElementById('socialHeader').scrollIntoView()
    })
    $('shareSelect').ready(function() {
      setTimeout(() => {
        if (!this.state || !this.state.groups) {
          return
        }
        var v = []
        for (var i = 0; i < document.getElementById('shareSelect').children.length; i++) {
          v.push(document.getElementById('shareSelect').children.item(i).textContent)
        }
        this.state.groups.forEach(room => {
          // alert(JSON.stringify(room))
          if (room.members.includes(this.props.username) && !v.includes(room.name)) {
            var roomOp = document.createElement('option')
            roomOp.id = room.name.replace(' ', '') + 'Option'
            roomOp.textContent = room.name
            document.getElementById('shareSelect').appendChild(roomOp)
          }
        })
      }, 1000)
    }.bind(this))
    $('#profileInput').change(function() {
      var file = document.getElementById('profileInput').files[0]
      document.getElementById('profileImg').src = URL.createObjectURL(file) 
      document.getElementById('profileEditLbl').style.display = 'none';
      document.getElementById('profSubmit').style.display = 'inline-block';
    })
    console.log('Left handle load')
  }

  getPostData() {
    console.log('Got to get post data')
    console.log('Posts:', JSON.stringify(this.state.posts))
    console.log('Profiles:', JSON.stringify(this.state.posts))
    if (!this.state.posts || !this.state.profiles) {
      setTimeout(() => {
        console.log('>>>>>> After a timeout 100ms <<<<<<')
        console.log('Posts:', JSON.stringify(this.state.posts))
        console.log('Profiles:', JSON.stringify(this.state.posts))
      }, 100);
      return
    }
    var groupNames = []
    this.state.groups.forEach(g => 
      {
        groupNames.push(g.name)
      })
    const sendVote = (postId, vote, votedPos, votedNeg, likes) => {
      // alert('You, ' + this.props.username + ', is going to vote ' + (vote === 1 ? 'POSITIVELY' : 'NEGATIVELY') + ' on post with ID=' + postId)
      socket.emit("voteOnPost", { voter: this.props.username, postId: postId, vote: vote, votedPos: votedPos, votedNeg: votedNeg, likes: likes })
    }
    // alert('Groups[0]: ' + groupNames[0])
    var count = 0;
    if (this.state.posts.length > 0 && this.state.posts.length < 21) {
      document.getElementById('loadMoreBtn').textContent = 'All Posts Displayed'
    }
    console.log('Going to leave get post data')
    return this.state.posts.map(post => { 
      count++;
      if (count > 20) {
        return ( <div style={{ display: 'none' }} /> );
      }
      else if (count + 1 > 20) {
        document.getElementById('loadMoreBtn').removeAttribute('disabled')
        document.getElementById('loadMoreBtn').onclick = this.displayMore
      }
      var parts = post.content.split('|') 
      var prof = this.state.profiles.find(p =>  p['username'] === post.poster)
      prof = prof ? prof['profile'] : 'default1.jpg'
      var imgLocation = 'images/user_profiles/' + prof
      if ((!groupNames.includes(post.sharedWith) && groupNames !== post.sharedWith) && post.sharedWith.toLowerCase() !== 'all') {
        // alert('"' + post.sharedWith + '" in ' + groupNames.toString() + '?\n' + groupNames.includes(post.sharedWith))
        return ( <div style={{ display: 'none' }} /> )
      }
      function castPosVote() { sendVote(post._id, 1, post.votedPos, post.votedNeg, post.likes) }
      function castNegVote() { sendVote(post._id, -1, post.votedPos, post.votedNeg, post.likes) }
      return (
        <div className='container-fluid ' style={{ alignContent: 'center', margin: '1%', display: 'inline-block', textAlign: 'center', maxWidth: '90%', backgroundColor: 'rgb(70,100,100,0.7)' }} key={post._id}>
          <div className="row" style={{ background: 'rgb(160,160,160,0.7)' }}>
              <img src={ imgLocation } alt='posterProfile' style={{ margin: '1%', height: '4%', width: '4%', borderRadius: '50% '  }}></img>
              <h6 style={{ marginLeft: '1%', marginTop: '2vh' }}> { post.poster } @ { post.sharedWith }</h6> 
          </div>
          <div className="row" style={{ margin: '1vh', display: 'inline-block', alignContent: 'center' }}>
            { parts[0] === 'text' &&
              <p>{ parts[1] }</p>
            }
            { parts[0] === 'link' &&
              <a className='link' style={{ wordBreak: 'break-all' }} href={ parts[1] }>{ parts[1] }</a>
            }
            { parts[0] === 'img' &&
              <img src={ '/images/user_posts/' + parts[1] } alt='userPost' style={{ maxHeight: '100%', maxWidth: '100%' }}></img>
            }
          </div>
          <div className='row' style={{ marginBottom: '1vh' }}>
            <div className='col-5'>
              <button className='text-success' disabled={ post.votedPos.includes(this.props.username) } style={{ background: 'transparent', border: 'transparent' }} onClick={ castPosVote }><i className="fa fw fa-thumbs-up" /></button>
              <span style={{ marginLeft: '1vw', marginRight: '1vw' }}>{ post.likes }</span>
              <button className='text-danger' disabled={ post.votedNeg.includes(this.props.username) } style={{ background: 'transparent', border: 'transparent' }} onClick={ castNegVote }><i className="fa fw fa-thumbs-down" /></button>
            </div>
            <div className='col-7'>
              <span style={{ fontWeight: 'lighter', fontSize: '90%' }}>{ post.createdDate.split('T')[1].substr(0,8) + ' of ' + post.createdDate.split('T')[0] }</span>
            </div>
          </div>
        </div>
      );
    });
  }

  scrollInto(e) {
    e.preventDefault()
    setTimeout(() => {
      window.scrollTo(0,document.body.scrollHeight + document.getElementById('collapseExample').clientHeight + 100);
    }, 100);
  }

  selectTextInput() {
    document.getElementById('textLabel').style.textDecoration = 'underline'
    document.getElementById('imgLabel').style.textDecoration = 'none'
    document.getElementById('linkLabel').style.textDecoration = 'none'
    document.getElementById('textLabel').style.fontWeight = 'bolder'
    document.getElementById('imgLabel').style.fontWeight = 'normal'
    document.getElementById('linkLabel').style.fontWeight = 'normal'
    document.getElementById('textInput').style.display = 'block'
    document.getElementById('imgInput').style.display = 'none'
    document.getElementById('linkInput').style.display = 'none'
  }

  selectImgInput() {
    document.getElementById('imgLabel').style.textDecoration = 'underline'
    document.getElementById('textLabel').style.textDecoration = 'none'
    document.getElementById('linkLabel').style.textDecoration = 'none'
    document.getElementById('imgLabel').style.fontWeight = 'bolder'
    document.getElementById('textLabel').style.fontWeight = 'normal'
    document.getElementById('linkLabel').style.fontWeight = 'normal'
    document.getElementById('imgInput').style.display = 'block'
    document.getElementById('textInput').style.display = 'none'
    document.getElementById('linkInput').style.display = 'none'
  }

  selectLinkInput() {
    document.getElementById('linkLabel').style.textDecoration = 'underline'
    document.getElementById('imgLabel').style.textDecoration = 'none'
    document.getElementById('textLabel').style.textDecoration = 'none'
    document.getElementById('linkLabel').style.fontWeight = 'bolder'
    document.getElementById('imgLabel').style.fontWeight = 'normal'
    document.getElementById('textLabel').style.fontWeight = 'normal'
    document.getElementById('linkInput').style.display = 'block'
    document.getElementById('textInput').style.display = 'none'
    document.getElementById('imgInput').style.display = 'none'
  }

  searchPosts() {
    // Declare variables
    // alert('in search function')
    var input, filter, div, txtValue;
    input = document.getElementById('searchPostsBar');
    // alert("Searching for input: " + input.value)

    filter = input.value.toLowerCase();
    div = document.getElementById("myScrollable");
    for (var i = 0; i < div.children.length; i++) {
      var row = div.children.item(i).children.item(1)
      var row0 = div.children.item(i).children.item(0)
      if (!row0) {
        continue
      }
      var txt0 = row0.children.item(1).textContent
      var txtNode = row.getElementsByTagName('p')
      var imgNode = row.getElementsByTagName('img')
      var linkNode = row.getElementsByTagName('a')
      if (txtNode.length > 0) {
        txtValue = txtNode[0].innerText.toLowerCase()
      }
      else if (imgNode.length > 0) {
        txtValue = imgNode[0].src.toLowerCase()
      }
      else if (linkNode.length > 0) {
        txtValue = linkNode[0].href.toLowerCase()
      }
      if (txtValue.toLowerCase().indexOf(filter) > -1 || txt0.toLowerCase().indexOf(filter) > -1) {
        div.children.item(i).style.display = "block";
      } else {
        div.children.item(i).style.display = "none";
      }
    }
  }

  sendPost = () => {
    var date = new Date()
    // alert('Current date: ' + date.toString())
    var shared = document.getElementById('shareSelect').value
    var poster = this.props.username
    var type = 'text'
    var content = ''
    var votedPos = [ this.props.username ]
    var cont = document.getElementById('textInput').value
    if (document.getElementById('textLabel').style.textDecoration.includes('underline')) {
      content = type + '|' + cont
      socket.emit('putPost',{ poster: poster, sharedWith: shared, content: content, createdDate: date, votedPos: votedPos })
      window.location.reload()
    }
    else if (document.getElementById('imgLabel').style.textDecoration.includes('underline')) {
      type = 'img'
      cont = document.getElementById('imgInput').children.item(0).files[0].name
      content = type + '|' + cont
      socket.emit('putPost',{ poster: poster, sharedWith: shared, content: content, createdDate: date, votedPos: votedPos })
      document.forms['imgInput'].submit()
    }
    else if (document.getElementById('linkLabel').style.textDecoration.includes('underline')) {
      type = 'link'
      cont = document.getElementById('linkInput').value
      content = type + '|' + cont
      socket.emit('putPost',{ poster: poster, sharedWith: shared, content: content, createdDate: date, votedPos: votedPos })
      window.location.reload()
    }
  }

  sendMsg = () => {
    // alert('This is where we\'d send the message...')
    var msg = document.getElementById('msgToSend').value
    // alert("Message to send:\n" + msg)
    socket.emit("new_message", { username: this.props.username, message: msg })
    // alert('Message sent!')
    document.getElementById('msgToSend').value = ''
  }

  isKeyEnter = (event) => {
    if (!document.getElementById('msgToSend').value || document.getElementById('msgToSend').value === '' || document.getElementById('msgToSend').value === ' ' || document.getElementById('msgToSend').value === '\n') {
      event.preventDefault()
      return
    }
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("sendMsgBtn").click();
    }
    else {
      socket.emit('typing', { username: this.props.username })
    }
  }

  getTypingData() {
    if (!this.state || !this.state.typing) {
      return
    }
    var typing = this.state.typing
    document.getElementById('isTypingDiv').style.display = 'block'
    document.getElementById('isTyping').textContent = typing + ' is typing'
  }

  getMsgData() {
    if (!this.state || !this.state.msgs || this.state.msgs === []) {
      return
    }
    if (document.getElementById('isTyping')) {
      document.getElementById('isTyping').textContent = ''
      document.getElementById('isTypingDiv').style.display = 'none'
    }
    return this.state.msgs.map(msg => {
      var isMe = (msg.username === this.props.username)
      var rightOrLeft = 'left'
      var parClass = 'container-flex '
      var classes =  ''
      if (isMe) {
        classes = 'container-flex pull-right bg-info'
        rightOrLeft = 'right'
        parClass += 'text-right'
      }
      else {
        classes = 'container-flex pull-left  bg-dark'
        parClass += 'text-left'
      }
      var user = isMe? 'You' : msg.username
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < charactersLength; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      var intoView = (e) => {
        e.preventDefault()
        document.getElementById('forMsgs').scrollTop = document.getElementById('forMsgs').scrollHeight
      }
      return(
        <div className={ parClass } style={{ width: '100%', textAlign: rightOrLeft }} onLoad={ intoView }>
          <p style={{ fontSize: 'small' }}>{ user } <i className="fa fw fa-caret-right" /> { msg.time.toString() }</p>
          <div className={ classes } style={{ borderRadius: '15px', marginTop: '-2vh', width: 'fit-content' }}>
            <p style={{ margin: '1vh' }}>{ msg.message }</p>
          </div>
          <br />
        </div>
      )
    })
  }

  displayMore = (event) => {
    event.preventDefault();
    var prevDisplay = this.state.displayCount;
    var currDisplay = prevDisplay + 20;
    this.setState({ displayCount: currDisplay });
    var len = this.state.posts.length;
    var posts = this.state.posts;
    // alert('Posts:\n'+posts)
    var max = 0, count = 0;
    if (currDisplay - len < 0) { // If there are more than another 20  previously not-displayed posts
      document.getElementById('podText').textContent = currDisplay + " Posts On Display";
      max = currDisplay;
    }
    else {  // If there are exactly another 20 posts, i.e. we're displaying all posts
      document.getElementById('loadMoreBtn').setAttribute("disabled", "disabled");
      document.getElementById('loadMoreBtn').textContent = 'All Posts Displayed'
      max = len-1;
    }
    var groupNames = []
    this.state.groups.forEach(g => 
      {
        groupNames.push(g.name)
      })
    const sendVote = (postId, vote, votedPos, votedNeg, likes) => {
      // alert('You, ' + this.props.username + ', is going to vote ' + (vote === 1 ? 'POSITIVELY' : 'NEGATIVELY') + ' on post with ID=' + postId)
      socket.emit("voteOnPost", { voter: this.props.username, postId: postId, vote: vote, votedPos: votedPos, votedNeg: votedNeg, likes: likes })
    }
    for (var i = prevDisplay; i < max; i++) {
      var post = posts[i];
      // alert('Going to display: ' + JSON.stringify(post))
      var elem;
      var parts = post.content.split('|') 
      var prof = this.state.profiles.find(p =>  p['username'] === post.poster)
      prof = prof['profile']
      var imgLocation = 'images/user_profiles/' + prof
      if ((!groupNames.includes(post.sharedWith) && groupNames !== post.sharedWith) && post.sharedWith.toLowerCase() !== 'all') {
        // alert('"' + post.sharedWith + '" in ' + groupNames.toString() + '?\n' + groupNames.includes(post.sharedWith))
        elem = document.createElement('div')
        elem.style.display = 'none'
      }
      else {
        count++;
        function castPosVote() { sendVote(post._id, 1, post.votedPos, post.votedNeg, post.likes) }
        function castNegVote() { sendVote(post._id, -1, post.votedPos, post.votedNeg, post.likes) }
        elem = document.createElement('div')
        elem.classList.add('container-fluis')
        elem.style.alignContent = 'center'
        elem.setAttribute("key", post._id)
        elem.style.margin = '1%'
        elem.style.textAlign = 'center'
        elem.style.display = 'inline-block'
        elem.style.maxWidth = '90%'
        elem.style.background = 'rgb(70,100,100,0.7)'
          var row1 = document.createElement('div')
          row1.classList.add('row')
          row1.style.background = 'rgb(160,160,160,0.7)'
            var img = document.createElement('img')
            img.src = imgLocation
            img.alt = 'posterProfile'
            img.style.margin = '1%'
            img.style.height = '4%'
            img.style.width = '4%'
            img.style.borderRadius = '50%'
          row1.appendChild(img)
            var h6 = document.createElement('h6')
            h6.style.marginLeft = '1%'
            h6.style.marginTop = '2vh'
            h6.textContent = post.poster + ' @ ' + post.sharedWith
          row1.appendChild(h6)
        elem.appendChild(row1)
          var row2 = document.createElement('div')
          row2.classList.add('row')
          row2.style.margin = '1vh'
          row2.style.display = 'inline-block'
          row2.style.alignContent = 'center'
          var cont;
          if (parts[0] === 'text') {
            cont = document.createElement('p')
            cont.textContent = parts[1]
          }
          else if (parts[0] === 'link') {
            cont = document.createElement('a')
            cont.classList.add('link')
            cont.style.wordBreak = 'break-all'
            cont.href = parts[1]
            cont.textContent = parts[1]
          }
          else if (parts[0] === 'img') {
            cont = document.createElement('img')
            cont.src = '/images/user_posts/' + parts[1]
            cont.alt = 'userPost'
            cont.style.maxWidth = '100%'
            cont.style.maxHeight = '100%'
          }
          row2.appendChild(cont)
        elem.appendChild(row2)
          var row3 = document.createElement('div')
          row3.classList.add('row')
          row3.style.marginBottom = '1vh'
            var col1 = document.createElement('div')
            col1.classList.add('col-5')
              var btnPos = document.createElement('button')
              btnPos.classList.add('text-success')
              btnPos.disabled = post.votedPos.includes(this.props.username)
              btnPos.onclick = castPosVote
              btnPos.style.background = 'transparent'
              btnPos.style.border = 'transparent'
                var posIcon = document.createElement('i')
                posIcon.classList.add('fa', 'fw', 'fa-thumbs-up')
              btnPos.appendChild(posIcon)
            col1.appendChild(btnPos)
              var span = document.createElement('span')
              span.style.marginLeft = '1vw'
              span.style.marginRight = '1vw'
              span.textContent = post.likes
            col1.appendChild(span)
              var btnNeg = document.createElement('button')
              btnNeg.classList.add('text-danger')
              btnNeg.disabled = post.votedNeg.includes(this.props.username)
              btnNeg.onclick = castNegVote
              btnNeg.style.background = 'transparent'
              btnNeg.style.border = 'transparent'
                var negIcon = document.createElement('i')
                negIcon.classList.add('fa', 'fw', 'fa-thumbs-down')
              btnNeg.appendChild(negIcon)
            col1.appendChild(btnNeg)
          row3.appendChild(col1)
            var col2 = document.createElement('div')
            col2.classList.add('col-7')  
              var date = document.createElement('span')
              date.style.fontWeight = 'lighter'
              date.style.fontSize = '90%'
              date.textContent = post.createdDate.split('T')[1].substr(0,8) + ' of ' + post.createdDate.split('T')[0]
            col2.appendChild(date)
          row3.append(col2)
        elem.appendChild(row3)
      }
      document.getElementById('myScrollable').appendChild(elem)
    }
    document.getElementById('podText').textContent = (prevDisplay +  count) + " Posts On Display";
  }

  profileClick = (event) => {
    event.preventDefault();
    $('#profileInput').click();    
  }

  render() {
    if (this.props === undefined) {
      window.location.reload()
    }
    return (
      <div>
        <div className='social'>
        </div>
        {(this.props.loggedIn) ? (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className='container-fluid' style={{ background: 'yellow', fontWeight: 'lighter', color: 'blue', fontFamily: 'Josefin Sans', marginBottom: '0%' }}>
              <br />
                <h2 id="socialHeader">The Social Corner of <span style={{ fontWeight: 'bolder' }}>The Book Place</span></h2>
              <p style={{ color: 'transparent', fontSize: '1%' }}>...</p>
            </div>
            <div className="container-fluid">
              <div className="row row-space">
                <div className="col-1" style={{ textAlign: 'center' }}>
                  <form method="POST" action="/api/updateProfilePic" encType="multipart/form-data">
                    <img className="click-img" id='profileImg' onClick={ this.profileClick } alt='userProfile' src={ '/images/user_profiles/' + this.props.profile } style={{ height: '21vh', width: '8vw', borderRadius: '50%' }}></img>
                    <label id="profileEditLbl" className="text-bold text-warning text-w-shadow" htmlFor="profileImg" style={{ marginLeft: '1vw', marginUp: '2vh' }}><i className="fa fw fa-hand-o-up"></i> to Edit</label>
                    <input accept='image/*' type="file" id="profileInput" name="profileInput" style={{ display: 'none' }}></input>
                    <input type="text" id="uname" name="uname" style={{ display: 'none' }} value={ this.props.username }></input>
                    <button className="btn-warning btn-cool" type="submit" id="profSubmit" style={{ marginTop: '1vh', marginBottom: '1vh', color: 'white', display: 'none' }}>Save</button>
                  </form>
                  <label id="profileName" htmlFor="profileImg" style={{ fontSize: 'xx-large', fontFamily: 'Josefin Sans', color: 'white', fontWeight: 'bold',
                    textShadow: '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black', marginLeft: '0.5vw' }}>{ this.props.name }</label>
                  <p htmlFor="#profileName" style={{ fontSize: 'large', marginLeft: '1vw', color: 'white', fontWeight: 'bolder', textShadow: '-0.5px 0 black, 0 1.5px black, 1.5px 0 black, 0 -0.5px black' }}>{ this.props.status }
                  </p>
                </div>
                <div className="col-5" style={{ marginRight: '3vw' }}>
                  <div className="container" style={{ height: '100%', width: '100%', background: 'rgb(100,100,100,0.3)', color: 'white', textAlign: 'center', marginLeft: '1vw' }}>
                    <div className='container' style={{ height: '1vh', width: '100%' }}></div>
                    <h3 id="h3-title" style={{ textDecoration: 'underline', fontWeight: 'bold', marginBottom: '-0.5vh' }}>Social Feed</h3>
                    <input type="text" id="searchPostsBar" style={{ marginBottom: "1%", borderRadius: '10px', marginTop: '1.25vh', background: 'rgb(255, 253, 251, 0.7)', textAlign: 'center', width: '75%' }} 
                    onKeyUp={this.searchPosts} placeholder="Search for specific keyowrds in posts"/>
                    <div className='container' id='myScrollable' style={{ height: '65vh', width: '100%', overflowY: 'scrol', overflowX: 'hidden', textAlign: 'center', scrollbarColor: 'rgb(100,100,200,0.6) rgb(100,100,100,0.5)' }}>
                      { this.getPostData() }
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col-6 text-left">
                          <br />
                          <p id="podText" className="text-light text-bold">0 Posts On Display</p>
                        </div>
                        <div className="col-6 text-right">
                          <br />
                          <button id="loadMoreBtn" onClick={ this.displayMore } type="button" className="btn btn-primary" disabled>Display More Posts</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="container">
                    <div className="row text-light" style={{ height: '100%', width: '102%', textAlign: 'center', backgroundColor: 'rgb(70,100,130,0.4)', textDecoration: 'underline' }}>
                      <h4 style={{ textAlign: 'center', margin: '1vw', fontWeight: 'bolder' }}>Live Chat</h4>
                    </div>
                    <div className="row">
                      <div className='container' style={{ position: 'relative', background: 'rgb(70,100,130,0.4)', color: 'white', marginRight: '1vw' }}>
                        <div className='container' id='myOtrScrollable'>
                          <div id="isTypingDiv">
                            <span id="isTyping"></span>
                            <i className="fa fa-spinner fa-pulse fa-fw"></i>
                            <span className="sr-only"></span>
                          </div>
                          <div className='container-fluid' id='forMsgs' style={{ height: '65vh', width: '100%', overflowY: 'scrol', overflowX: 'hidden', scrollbarColor: 'rgb(100,100,200,0.6) rgb(100,100,100,0.5)' }}>
                            { this.getMsgData() }
                          </div>
                        </div>
                        <input id='msgToSend' name='msgToSend' type='text' style={{ margin: '1%', height: '5vh', width: '95%', background: 'rgb(255, 253, 251, 0.8)' }} placeholder='Your message here...' onKeyUp={this.isKeyEnter}></input>
                        <div className='text-right'>
                          <button className='btn-primary' id='sendMsgBtn' onClick={this.sendMsg} style={{ fontFamily: 'Fugaz One', textShadow: '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black', 
                          boxShadow: '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black', borderRadius: '15px', marginRight: '1vw', marginBottom: '1vh' }}> Send </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid" style={{ verticalAlign: 'bottom', textAlign: 'left', marginTop: '1%', marginBottom: '1vh' }}>
                <div className="collapse" id="collapseExample">
                  <div className="card card-body" style={{ background: 'rgba(200,220,220,0.7)' }}>
                    <div className='form-control text-dark' style={{ border: 'transparent', background: 'transparent' }}>
                      <div className='row'>
                        <div className='col-7'>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" style={{ visibility: 'hidden' }} onClick={ this.selectTextInput } checked/>
                            <label className="form-check-label" id='textLabel' htmlFor="inlineRadio1" style={{ fontWeight: 'bolder', textDecoration: 'underline', cursor: 'pointer' }}>Text</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" style={{ visibility: 'hidden' }} onClick={ this.selectImgInput } />
                            <label className="form-check-label" style={{ cursor: 'pointer' }} id='imgLabel' htmlFor="inlineRadio2">Image</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" style={{ visibility: 'hidden' }} onClick={ this.selectLinkInput } />
                            <label className="form-check-label" style={{ cursor: 'pointer' }} id="linkLabel" htmlFor="inlineRadio3">Hyperlink</label>
                          </div>
                        </div>
                        <div className='form-group col-5 row' style={{ textAlign: 'right' }}>
                          <label className='col-4' htmlFor="shareSelect" style={{ fontSize: 'smaller' }}>Share with: </label>
                          <select id='shareSelect' name='shareSelect' className="form-control col-8" style={{ width: 'auto',  height: '4vh', fontSize: 'smaller', marginTop: '-1%' }}>
                            <option id='allOption'>All</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='container-fluid'>
                      <textarea placeholder='Your post' id='textInput' style={{ width: '100%', height: '40%' }}></textarea>
                      <form id='imgInput' method='POST' action='/api/postImgUpload' style={{ display: 'none' }} encType='multipart/form-data'>
                        <input accept='image/*' name='imgFileInput' type='file'/>
                      </form>
                      <input id='linkInput' type='text' style={{ display: 'none', width: '100%', height: 'auto' }} placeholder="Your link" />
                    </div>
                    <div className='text-right'>
                      <button style={{ width: '10%', marginTop: '1vh', marginRight: '1vw', fontFamily: 'Fugaz One', textShadow: '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black', 
                          boxShadow: '-1px 0 black, 0 2px black, 2px 0 black, 0 -1px black', borderRadius: '15px' }} className="btn-primary" onClick={ this.sendPost }>Post</button>
                    </div>
                  </div>                  
                </div>
                <button id='newPostBtn' type="button" data-toggle="tooltip" data-placement="right" title="Write new post" className='btn-primary' onClick={ this.scrollInto }
                style={{ color: 'blue', background: 'yellow', fontSize: '200%', borderRadius: '50%', border: 'transparent' }}>
                  <i className="fa fw fa-pencil-square-o" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></i>
                </button>
              </div>
              <div id='thisIsTheBottom' style={{ color: 'transparent', marginTop: '5vh' }}>Bottom of the Page</div>
          </div>
        ) : (
          <p>Social networking is only available for registered users</p>
        )}
      </div>
    )
  }
}

export default Social