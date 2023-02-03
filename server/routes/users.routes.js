const express = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/users.model');
const { verifyToken } = require('../middlewares/auth.middleware');

const routerUsers = express.Router();


// TODO: Obtener los usuarios: espeficicar el limite y comienzo por la query
routerUsers.get('/', verifyToken, async (req, res) => {
  try {
    let limit = req.query.limit || 25;
    limit = Number(limit);

    let offset = req.query.offset || 0;
    offset = Number(offset);

    User.find({ state: true })
      .skip(offset)
      .limit(limit)
      .exec( (err, usersdb) => {

        if (err) {
          return res.status(400).json({
            ok: false,
            message: err
          })
        }

        User.count({ state: true }, (err, count) => {
          res.status(200).json({
            ok: true,
            cuantos: count,
            usuarios: usersdb
          })
        })
      })
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err
    })
  }
})


// TODO: Obtener un usuario por su id
routerUsers.get("/:id", verifyToken, async (req, res) => {

  const { id } = req.params;

  try {
    const usersdb = await User.findById(id);

    if (!usersdb) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      })
    }

    res.status(200).json({
      ok: true,
      usuario: usersdb
    })
    
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err
    })
  }
})


// TODO: Actualizar un usuario por su id
routerUsers.put("/:id", verifyToken, async (req, res) => {

  if (req.body.userId === req.params.id || req.user.role === "ADMIN_ROLE") {
    if (req.body.password) {
      try {
        const salt = await bcryptjs.genSalt(10);
        req.body.password = await bcryptjs.hash(req.body.password, salt);
      }
      catch (err) {
        return res.status(500).json({
          ok: false,
          message: err
        })
      }
    }
    try {
      const user = await User.findByIdAndUpdate({ _id: req.params.id }, 
        req.body, 
        { 
          new: true
        }
      )

      res.status(200).json({
        ok: true,
        message: "Usuario actualizado correctamente",
        user: user
      })
    } catch (err) {
      return res.status(404).json({
        ok: false,
        message: err
      })
    }
  } else {
    return res.status(403).json({
      ok: false,
      message: "Tú solo puedes actualizar tu cuenta"
    })
  }
})


// TODO: Eliminando completamente el usuario de la aplicación
routerUsers.delete("/:id", verifyToken, async (req, res) => {

  if (req.user._id === req.params.id || req.user.role === "ADMIN_ROLE") {
    try {

      const userDeleted = await User.findByIdAndRemove({ _id: req.params.id })

      if (!userDeleted) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
          err: err
        })
      }

      res.status(200).json({
        ok: true,
        message: "Usuario eliminado correctamente",
        usuario: userDeleted
      })

    } catch (err) {
      res.status(500).json({
        ok: false,
        err: err
      })
    } 
  } else {
    return res.status(403).json({
      ok: false,
      message: "Tú solo puedes eliminar tu cuenta"
    })
  }
})


// TODO: Eliminar usuario cambiando sólo su estado a false
routerUsers.put("/delete/:id", verifyToken, (req, res) => {
  if (req.body.userId === req.params.id || req.user.role === "ADMIN_ROLE") {
    User.findById({ _id: req.params.id }, (err, userdb) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        })
      }

      if (!userdb) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado"
        })
      }

      let changeState = {
        state: false
      }

      User.updateOne({ _id: req.params.id }, changeState, (err, userDeleted) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err: err
          })
        }

        res.status(200).json({
          ok: true,
          usuario: userDeleted,
          message: "Usuario eliminado correctamente"
        })
      })
    })
  } else {
    res.status(403).json({
      ok: false,
      message: "Sólo puedes eliminar tu cuenta",
    })
  }
})


module.exports = routerUsers;