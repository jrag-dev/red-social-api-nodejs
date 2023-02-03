const jsonwebtoken = require('jsonwebtoken');


// TODO: Verificar token y colocar el usuario en el req
let verifyToken = (req, res, next) => {
  let token = req.get("token");

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token inválido"
        }
      })
    }

    req.user = decoded.user;

    return next();
  })
}


// TODO: Verificar el role de asministrador

let verifyRole = (req, res, next) => {
  
  let user = req.user;

  if (user.verifyRole === 'ADMIN_ROLE' ) {
    next();
  } else {
    return res.status(400).json({
      ok: false,
      message: "El usuario no es administrador"
    })
  }
}



module.exports = {
  verifyToken,
  verifyRole
}