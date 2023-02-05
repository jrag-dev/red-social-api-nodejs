const express = require('express');


const routerUsers = require('./users.routes');
const routerAuth = require('./auth.routes');
const routerPost = require('./posts.routes');


const app = express();


app.use("/api/users", routerUsers);
app.use("/api/auth", routerAuth);
app.use("/api/posts", routerPost)


module.exports = app;