const express = 'express';

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        res.status(500).json({error: 'Error adding a user'})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const { id } = req.params;
    const newPost = {...req.body, user_id: id};
    Posts.insert(newPost)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error creating a post for the user'})
        })
});

router.get('/', (req, res) => {
    Users.get(req.query)
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({error: 'Error retrieving users'})
    })
});

router.get('/:id', validateUserId, (req, res) => {
    Users.getById(req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'user does not exist'})
        }
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({
            message: 'error retrieving posts of user'
        })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    Users.remove(req.params.id)
    .then(data => {
        if (data) {
            res.status(200).json({ message: 'user removed'})
        } else {
            res.status(404).json({message: 'user not in database'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'error while removing user'})
    })
});

router.put('/:id', (req, res) => {
    Users.update(req.params.id, req.body) 
    .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'user does not exist'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'error updating user info'})
    })
});

//custom middleware
// validate user id
function validateUserId(req, res, next) {
Users.getById(req.params.id)
.then(user => {
    if(!user) {
        res.status(400).json({message: 'invalid user ID'})
    } else {
        req.user = req.params.id;
        next();
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'encountered an error validating user ID'})
    })
};

// validate body of request to create a new user
function validateUser(req, res, next) {
    if (!Object.keys(req.body).length) {
      res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name) {
      res.status(400).json({ message: 'missing required name field' });
    } else {
      next();
    }
  }

// validate body of request to create new post
function validatePost(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing post data" });
      } else if (!req.body.text) {
        res.status(400).json({ message: 'missing required text field' });
      } else {
        next();
      }
};

module.exports = router;
