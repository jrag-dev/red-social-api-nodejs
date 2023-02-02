const express = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/users.model');
const jsonwebtoken = require('jsonwebtoken');


const routerAuth = express.Router();


routerAuth.post('/register', async (req, res) => {

  const body = req.body;
  const { password } = body;

  try {

    // verificar longitud del password
    if ( !password) {
      return res.status(400).json({
        ok: false,
        message: 'El password debe contener minimo 6 caracteres'
      })
    }

    // encriptar el password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(body.password, salt);

    // crear un nuevo usuario
    const user = new User({
      username: body.username,
      email: body.email,
      password: hashedPassword
    });

    // guardar en la db
    const userdb = await user.save();

    // responder al cliente
    res.status(201).json({
      ok: true,
      user: userdb
    })
    
  } catch (err) {
    console.log(err)
    // responder con el error si exiete un falló
    res.status(500).json({
      ok: false,
      err: err
    })
  }

})

routerAuth.post("/login", async (req, res) => {

  console.log(req.body)
  
  const body = req.body;

  try {

    const userdb = await  User.findOne({ email: body.email })

    if (!userdb) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      })
    }

    console.log( userdb )

    if (!bcryptjs.compareSync(body.password, userdb.password)) {
      return res.status(400).json({
        ok: false,
        message: "Email/Password incorrectos"
      })
    }

    const token = jsonwebtoken.sign(
      {
        user: userdb,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRE_IN_TOKEN
      }
    )

    res.status(200).json({
      ok: true,
      user: userdb,
      token: token
    })
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      err: err
    })
  }

})


module.exports = routerAuth;


