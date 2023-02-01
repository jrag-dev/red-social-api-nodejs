const express = require('express');


const routerUsers = express.Router();


routerUsers.get('/', (req, res) => {

  res.json({
    ok: true,
    message: "Users"
  })

})


module.exports = routerUsers;


