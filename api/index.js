/* eslint-env node */
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jsonServer from 'json-server';
import config from './config.json';
import jwtToken from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import {system_config} from './config.js';
import {query, get_options} from './db/mysql.js';

const jsonPath = path.join(__dirname, 'data.json');
const app = express();
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//app.use(jsonServer.defaults);

// parse application/json
app.use(bodyParser.json());

// app.use(jwt({
//     secret: config.token.secret
// }).unless(req => {
//     const url = req.originalUrl;
//     const postsRE = /^\/posts(\/.*)?$/;
//
//     return (
//         url === '/signup' ||
//         url === '/login' ||
//         (postsRE).test(url) && req.method === 'GET'
//     );
// }));

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

function generateToken(username, password) {
    const payload = {username, password};
    return jwtToken.sign(payload, config.token.secret, {
        expiresInMinutes: config.token.expires
    });
}

function extractToken(header) {
    return header.split(' ')[1];
}

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    query("SELECT `user_pass`,`ID` FROM `" + mysql_prefix + "users`", function (err, vals, fields) {
        if (err) {
            res.sendStatus(401);
        } else {
            if (password === vals[0].user_pass) {
                const token = generateToken(username);
                const user = username;
                res.send({token, user});
            } else {
                res.sendStatus(401);
            }
        }
    });
});

app.get('/profile', (req, res) => {
    try {
        // const token = extractToken(req.headers.authorization);
        // const decode = jwtToken.decode(token);
        // const { email } = decode;
        fs.readFile(jsonPath, {
            encoding: 'utf-8'
        }, (error, db) => {
            const users = (JSON.parse(db)).users;
            const user = _.find(users, (user) => user.email === "email@adress");
            res.send(user);
        });
    } catch (error) {
        res.sendStatus(401);
    }
});

app.put('/profile', (req, res) => {
    try {
        fs.readFile(jsonPath, {
            encoding: 'utf-8'
        }, (error, db) => {
            let editedUser;

            const json = JSON.parse(db);

            const users = json.users.map(user => {
                if (user.email === "email@adress") {
                    return (editedUser = {...user, ...req.body});
                }

                return user;
            });

            if (!editedUser) res.sendStatus(404);

            json.users = users;

            fs.writeFile(jsonPath, JSON.stringify(json, null, '  '), err => {
                if (err) return res.sendStatus(500);

                res.send(editedUser);
            });
        });
    } catch (error) {
        res.sendStatus(401);
    }
});

app.get('/profile', (req, res) => {
    try {
        fs.readFile(jsonPath, {
            encoding: 'utf-8'
        }, (error, db) => {
            const json = JSON.parse(db);

            return json.users;
        });
    } catch (error) {
        res.sendStatus(401);
    }
});

app.get('/posts', (req, res) => {
    query("SELECT * FROM `" + mysql_prefix + "posts` WHERE `post_status` = 'publish'", function (err, vals, fields) {
        if (err) {
            res.sendStatus(401);
        } else {
            res.send(vals);
        }
    });
});

app.get('/posts/:id', (req, res) => {
    query("SELECT * FROM `" + mysql_prefix + "posts` WHERE `ID` = " + req.params.id + " AND `post_status` = 'publish'", function (err, vals, fields) {
        if (err) {
            res.sendStatus(401);
        } else {
            res.send(vals[0]);
        }
    });
});


app.use(jsonServer.router(jsonPath));

app.listen(system_config.API_server_port);
console.log("Now start HTTP-API server on port " + system_config.API_server_port + "...");

get_options("siteurl", function (back) {
    console.log(back);
});