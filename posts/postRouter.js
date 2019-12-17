const express = require('express');

const router = express.Router();

const Posts = require('../posts/postDb.js');

router.get('/', (req, res) => {
  Posts.get()
  .then(posts => res.status(200).json(posts))
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.text) {
    Posts.update(id, body)
    .then(() => {
      Posts.getById(id)
      .then((post) => res.status(200).json(post))
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err })
    })
    } else {
      res.status(400).json({ message: "missing text" })
    }
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id

  Posts.getById(id)
  .then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: "invalid post id" })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err })
  })
}

module.exports = router;
