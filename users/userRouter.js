const express = require('express');

const router = express.Router();

const Users = require('../users/userDb.js');
const Posts = require('../posts/postDb.js')

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
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

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
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
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
