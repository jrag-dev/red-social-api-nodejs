const express = require('express');
const User = require('../models/users.model');


const routerAuth = express.Router();


routerAuth.post('/register', (req, res) => {

  res.json({
    ok: true,
    message: "Register"
  })

})


module.exports = routerAuth;


