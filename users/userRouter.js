const express = require('express');

const router = express.Router();

const Users = require('../users/userDb.js');
const Posts = require('../posts/postDb.js')

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id
  const body = {...req.body, user_id: id}

  Posts.insert(body)
  .then(result => res.status(201).json(result))
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.get('/', (req, res) => {
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(result => res.status(204).end())
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const {id} = req.params

  Users.update(id, req.body)
  .then(() => {
    Users.getById(id)
    .then(user => res.status(200).json(user))
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id)
  .then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
}

function validateUser(req, res, next) {
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;
