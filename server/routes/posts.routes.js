const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const Post = require('../models/post.model');


const routerPost = express.Router();


// TODO: Crear un post

routerPost.post("/", verifyToken, async (req, res) => {
  try {
    const post = {
      ...req.body,
      user: req.user._id
    }

    const newPost = new Post(post);

    const savePost = await newPost.save();

    res.status(200).json({
      ok: true,
      post: savePost
    })
    
  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err
    })
  }
})


// TODO: Obtener todos los posts

routerPost.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('user')

    res.status(200).json({
      ok: true,
      posts: posts
    })
  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err
    })
  }
})



// TODO: Obtener un post por su Id
routerPost.get("/:id", verifyToken, async (req, res) => {
  try {
    const postdb = await Post.findById({ _id: req.params.id }).populate('user')

    if (!postdb) {
      res.status(404).json({
        ok: false,
        message: "Post no encontrado"
      })
    }

    res.status(200).json({
      ok: true,
      post: postdb
    })

  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err
    })
  }
})


// TODO: Actualizar un post por su Id

routerPost.put("/:id", verifyToken, async (req, res) => {
  try {
    const postdb = await Post.findById({ _id: req.params.id })

    if (!postdb) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado"
      })
    }

    console.log(req.user._id, postdb.user.toString())

    if (req.user._id !== postdb.user.toString()) {
      return res.status(403).json({
        ok: false,
        message: "Sólo puedes actualizar tus posts"
      })
    }

    await postdb.updateOne({ $set : req.body })
    res.status(200).json({
      ok: false,
      message: "Post actualizado correctamente"
    })
  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err
    })
  }
})


// TODO: Eliminar un post por su Id

routerPost.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postdb = await Post.findById(req.params.id);

    if (!postdb) {
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado"
      })
    }

    if (req.user._id !== postdb.user.toString()) {
      return res.status(403).json({
        ok: false,
        message: "Sólo puedes eliminar tus posts"
      })
    }

    await postdb.deleteOne()
    res.status(200).json({
      ok: false,
      message: "Post eliminado correctamente"
    })
  } catch (err) {
    res.status(500).json({
      ok: false,
      err: err
    })
  }
})




module.exports = routerPost;