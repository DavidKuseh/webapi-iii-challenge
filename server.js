const express = 'express';
const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json());
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, Url: ${req.url}, Time: ${new Date().toISOString()}`)
};

module.exports = server;
