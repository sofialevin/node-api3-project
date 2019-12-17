const express = require('express');

const server = express();

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('origin') || 'localhost'}`
  );

  next();
}

module.exports = server;
