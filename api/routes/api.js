const express = require('express')
const router = express.Router()
const Message = require('../database/models/message')
const Book = require('../database/models/book')
const Order = require('../database/models/order')
const Room = require('../database/models/room')
const Post = require('../database/models/post')
const JoinRequest = require('../database/models/joinRequest')
const User = require('../database/models/user')
var formidable = require('formidable')
const fs = require('fs')
var passRecovery = require('./passRecovery')
const { isNull, isNumber } = require('util')
var dir_path = __dirname.substr(0,(__dirname.length+1 - '/routes/'.length)) + '/public/images/'

/*
** Function to check if a request's session hasn't expired and has an apprporiate user
*/
async function validSession (sess, roles = null) {
    if (isNull(sess)) return false
    console.log('Session:', sess)
    var now = Date.now()
    if (now > Date.parse(sess.cookie.expires)) {
        console.log('Now:', now, ' but Expiration:', sess.cookie.expires)
        return false
    }
    console.log(JSON.stringify(sess.passport))
    u_id = sess.passport.user._id
    doc = await User.findById(u_id)
    if (!doc || doc.length == 0) return false
    else {
        console.log('Found a user in session')
        if (roles != null) {
            console.log(doc.role, 'included in', roles, '?', roles.includes(doc.role))
            return roles.includes(doc.role) ? true : false
        }
        return true
    }
}

async function validClient (clientId) {
    client = await User.findById(clientId)
    if (!client || client.length == 0) return false
    else return true
}

async function validBooks (books) {
    bs = await Book.find().where('_id').in(books).exec()
    if (!bs || bs.length == 0) return -1
    else {
        tot = 0
        bs.forEach(b => { tot += b.price })
        return tot
    }
}

/*
** Public resources
*/
router.post('/message', (req, res) => {
    console.log('message send');

    const { name, email, subject, content } = req.body
    if (!name || !email) {
        res.send(400)
    }
    const newMsg = new Message({
        name: name,
        email: email,
        subject: subject,
        content: content
    })
    newMsg.save((err, savedMsg) => {
      if (err) return res.json(err)
      res.json(savedMsg)
    })
})


router.post('/forgot_password', passRecovery.forgot_password);
router.post('/reset_password', passRecovery.reset_password);

/*
** Protected Resources
*/
router.get('/books', (req, res) => {
    console.log('books get - req:', JSON.stringify(req.session));
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            Book.find((err, books) => {
                if (err) {
                    console.log('Books get error: ', err)
                } else if (books) {
                    res.json(books)
                }
            })
        }
    })
})

router.get('/orders', (req, res) => {
    console.log('orders get');
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            Order.find((err, orders) => {
                if (err) {
                    console.log('Orders get error: ', err)
                } else if (orders) {
                    // console.log('Found orders:\n' + JSON.stringify(orders))
                    res.json(orders)
                }
            })
        }
    })
})

router.post('/order', (req, res) => {
    console.log('order post');
    const { clientId, books, total, date } = req.body
    console.log(req.body)
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            if (clientId != req.session.passport.user._id) {
                console.log('ClientID not the same as the user who requested the order')
                console.log('ClientID=', clientId, 'Passport_id=', req.session.passport.user._id)
                res.send(400)
            }
            else {
                validClient(clientId).then((c) => {
                    if (c) {
                        validBooks(books).then((b) => {
                            if (b > 0) {
                                var t_num = Number(total)
                                if (!isNaN(t_num) && b - total < 0.01) {
                                    const newOrder = new Order({
                                        clientId: clientId,
                                        books: books,
                                        total: total,
                                        creationDate: Date.now()
                                    })
                                    newOrder.save((err, savedOrder) => {
                                        if (err) return res.json(err)
                                        console.log('Saved Order:\n' + JSON.stringify(savedOrder))
                                        res.json(savedOrder)
                                    })
                                }
                                else {
                                    console.log('Inavlid total - total=',total,'b=',b)
                                    res.send(400)
                                }
                            }
                            else {
                                res.send(400)
                            }
                        })
                    }
                    else {
                        console.log('Invalid client')
                        res.send(400)
                    }
                })
            }
        }
    })
})

router.post('/coverUpload', function(req,res) {
    var valid = validSession(req.session, ['admin', 'supplier'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            var form = new formidable.IncomingForm();

            form.parse(req);
        
            form.on('fileBegin', function (name, file){
                try {
                    if (fs.existsSync(dir_path + file.name)) {
                      // file exists
                    }
                    else {
                        file.path = dir_path + file.name;
                    }
                } 
                catch(err) {
                    file.path = dir_path + file.name;
                }
            });
        
            form.on('file', function (name, file){
                console.log('Uploaded ' + file.name);
            });
          
            res.sendStatus(204)
        }
    })
})

router.post('/book', function(req, res) {
    var valid = validSession(req.session, ['admin', 'supplier'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('book post')

            const { title, author, isbn, tags, numOfPages, yearPublished,
            publisher, language, cover, price } = req.body
            const newBook = new Book({
                title: title,
                author: author,
                isbn: isbn,
                tags: tags,
                numOfPages: numOfPages,
                yearPublished: yearPublished,
                publisher: publisher,
                language: language,
                cover: cover,
                price: price
            })
            newBook.save((err, savedBook) => {
            if (err) return res.json(err)
            console.log('Saved Book:\n' + JSON.stringify(savedBook))
            res.json(savedBook)
            })
        }
    })
})

router.post('/delete', function (req,res) {
    var valid = validSession(req.session, ['admin', 'supplier'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('post book delete')
            var toDel = req.body.id
            console.log('Book to delete: ' + toDel)
            Book.deleteOne({ _id : toDel }, function (err) {
                if(err) console.log(err);
                console.log("Successful book deletion");
            })
        }
    })
})

router.post('/delete_order', function(req,res){
    var valid = validSession(req.session, ['admin', 'clerk'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('post order delete')
            var toDel = req.body.id
            console.log('Order to delete: ' + toDel)
            Order.deleteOne({ _id : toDel }, function (err) {
                if(err) console.log(err);
                console.log("Successful order deletion");
            })
        }
    })
})

router.post('/update', function(req, res) {
    var valid = validSession(req.session, ['admin', 'supplier'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('post book update')
            var toUp = req.body.id
            var newPrice = req.body.price
            console.log('Book to update: ' + toUp)
            Book.update({ _id: toUp },{ price: newPrice }, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            })
        }
    })
})

router.post('/update_order', function(req, res) {
    var valid = validSession(req.session, ['admin', 'clerk'])
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('post order update\n' + JSON.stringify(req.body))
            var toUp = req.body.id
            var newTotal = req.body.total
            var newStat = req.body.status
            console.log('Order to update: ' + toUp)
            Order.update({ _id: toUp },{ total: newTotal, status: newStat }, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            })
        }
    })
})

router.get('/groups', function(req, res) {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            Room.find({}, function(err, groups) {
                if (err) {
                    console.log('There was an error finding rooms/groups:\n' + err)
                    res.send(err)
                }
                else {
                    res.send(groups)
                }
            })
        }
    })
})

router.post('/user_groups', function(req, res) {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            const user = req.body.user
            console.log('Going to look for groups with user: ' + user)
            Room.find({ members: user }, function(err, groups) {
                if (err) {
                    console.log('There was an error finding rooms/groups:\n' + err)
                    res.send(err)
                }
                else {
                    res.send(groups)
                }
            })
        }
    })
})

router.get('/profiles', function(req, res) {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Goint to GET profiles')
            User.find({}, function(err, users) {
                if (err) {
                    console.log('Error retrieving profiles:\n' + err)
                    res.send(err)
                }
                else if (users) {
                    var result = []
                    users.forEach(user => {
                        result.push({ username: user.username, profile: user.profilePic })
                    });
                    console.log('Profiles Over')
                    res.send(result)
                }
            })
        }
    })
})

router.post('/postImgUpload', function(req,res) {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Going to try and upload post')
            var form = new formidable.IncomingForm();

            form.parse(req);

            form.on('fileBegin', function (name, file){
                try {
                    if (fs.existsSync(dir_path + 'user_posts/' + file.name)) {
                    // file exists
                    }
                    else {
                        file.path = dir_path + 'user_posts/' + file.name;
                    }
                } 
                catch(err) {
                    file.path = dir_path + 'user_posts/' + file.name;
                }
            });

            form.on('file', function (name, file){
                console.log('Uploaded ' + file.name);
            });
        
            res.sendStatus(204)
        }
    })
})

router.post('/updateProfilePic', function(req,res) {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Going to try and upload profile pic:')
            var form = new formidable.IncomingForm();
            console.log(JSON.stringify(form))
            var username, pic;

            console.log('>>>> Dir name:',__dirname)
            form.parse(req, (err, fields, files) => {
                console.log('Profile pic update user: ' + fields.uname)
                username = fields.uname
                console.log('(NEW) Profile pic file name: ' + files.profileInput.name)
                pic = files.profileInput.name;
            });
                
            form.on('fileBegin', function (name, file){
                try {
                    if (fs.existsSync(dir_path + 'user_profiles/' + file.name)) {
                    // file exists
                    }
                    else {
                        file.path = dir_path + 'user_profiles/' + file.name;
                    }
                } 
                catch(err) {
                    file.path = dir_path + 'user_profiles/' + file.name;
                }
            });

            setTimeout(() => {
                User.updateOne(
                { username: username },
                { profilePic: pic },
                function (err, result) {
                    if (err) {
                        console.log(err)
                        res.send(err);
                    } else {
                        console.log("Successfully updated user=" + username + "'s profilePic=" + pic)
                        res.sendStatus(204);
                    }
                });
            }, 100)
        }
    })
})

router.post('/score', (req, res) => {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Requested /score with req:')
            console.log(JSON.stringify(req.body))
            if (req.body.username) {
                const user = req.body.username
                Post.find({ poster: user }, (err, docs) => {
                    if (err) res.sendStatus(406)
                    else {
                        if (docs.length < 1) {
                            res.send({ posCount: 0, negCount: 0 })
                        }
                        else {
                            var posCount = docs.map(d => { return d.votedPos.length }).reduce((acc, curr) => acc + curr);
                            console.log('User', user, ' pos vote count:', posCount)
                            var negCount = docs.map(d => { return d.votedNeg.length }).reduce((acc, curr) => acc + curr);
                            console.log('User', user, ' neg vote count:', negCount)
                            res.send({ posCount: posCount, negCount: negCount })
                        }
                    }
                })
            }
        }
    })
})

router.post('/join', (req, res) => {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Request to join from:')
            console.log(JSON.stringify(req.body))
            var data = req.body
            JoinRequest.find({ requester: data.requester.username, groupId: data.groupId },
                (err, doc) => {
                    if (err) { console.log('Find error', err); res.json({ message: err }); }
                    else if (doc.length > 0) {
                        res.json({ message: "You already have an open request to join this group." })
                    }
                    else {
                        console.log('User has not requested to join this group before')
                        const d = new Date();
                        const newRJ = new JoinRequest({
                            requester: data.requester,
                            groupId: data.groupId,
                            requestDate: d.toISOString()
                        })
                        newRJ.save((err, savedRJ) => {
                            if (err) { console.log(err); res.json({ message: err }); }
                            else if (savedRJ) {
                                res.json({ message: "Your request has been successfully saved and will be passed along to the group admin." })
                            }
                        })
                    }
                })
        }
    })    
})

router.post('/requests', (req, res) => {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Get requests to:')
            console.log(JSON.stringify(req.body))
            var data = req.body
            JoinRequest.find({ },
                (err, doc) => {
                    if (err) { console.log('Find error', err); res.json({ message: err }); }
                    else if (doc.length > 0) {
                        Room.find({ _id: { $in: doc.map(jr => jr.groupId) }, admin: data.username }, 
                        (error, rooms) => {
                            if (error) { console.log(error); res.json({ message: "Error" + error }); }
                            else {
                                JoinRequest.find({ groupId: { $in: rooms.map(r => r._id) } },
                                (er, jrs) => {
                                    if (er) { console.log(er); res.json({ message: "Error" + er }); }
                                    else if (jrs.length > 0) {
                                        res.json({ message: "Found join requests", jrs: jrs })
                                    }
                                    else {
                                        res.json({ message: "No requests found" });
                                    }
                                })
                            }
                        })
                    }
                    else {
                        res.json({ message: "No requests to join your groups." })
                    }
                })
        }
    }) 
})

router.post('/accept-join', (req, res) => {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Accept request:')
            console.log(JSON.stringify(req.body))
            var reqId = req.body.reqId
            JoinRequest.findByIdAndDelete(reqId, (err, jrs) => {
                if (err) { console.log(err); res.status(500).json(err); }
                else if (jrs) {
                    console.log("Found jrs:\n", JSON.stringify(jrs))
                    Room.findByIdAndUpdate(jrs.groupId, { $push: { members: jrs.requester.username } },
                        (error, room) => {
                            if (error) { console.log(error); res.status(500).json(error); }
                            else {
                                console.log("Successfully added", jrs.requester.username, "to group:", room.name)
                                res.status(200).json("Added to group")
                            }
                        })
                }
            })
        }
    })
})

router.post('/leave', (req, res) => {
    var valid = validSession(req.session)
    valid.then((v) => {
        console.log('>>>>>>>>>> Valid? ', v)
        if (!v) {
            console.log('Session was not valid')
            res.send(400)
        }
        else {
            console.log('Leave request:')
            console.log(JSON.stringify(req.body))
            var data = req.body
            Room.findByIdAndUpdate(data.groupId, { $pull: { members: data.username } },
                (err, room) => {
                    if (err) { console.log(err); res.status(500).json(err); }
                    else {
                        console.log("Successfully left group");
                        res.status(200).json("Successfully left group")
                    }
                })
        }
    })
})

module.exports = router
