const express = require('express');


const routerUsers = require('./users.routes');
const routerAuth = require('./auth.routes');


const app = express();


app.use("/api/users", routerUsers);
app.use("/api/auth", routerAuth);


module.exports = app;