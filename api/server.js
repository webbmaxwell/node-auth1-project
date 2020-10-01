const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./errorHandler');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')

const usersRouter = require('../users/users-router')
const authRouter = require('../auth/auth-router')

const server = express();

const sessionConfig = {
    name: 'mwcookie',
    secret: "'i can't tell you because it's a secret",
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUnitialized: false,

    store: knexSessionStore({
        knex: require('../database/connection.js'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 60*60*1000
    })
}



server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors);

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({ api: "up" });
});

server.use(errorHandler);

module.exports = server;