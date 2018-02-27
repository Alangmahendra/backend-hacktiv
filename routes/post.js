const express = require('express')
const router = express.Router()
const Post = require('../controller/post')
const auth = require('../auth/auth')

router.get('/',Post.findAll)
router.post('/',auth.isLogin,Post.addPost)
router.get('/myquestion',auth.isLogin,Post.findAllMypost)
router.put('/:id',auth.isLogin,Post.updatePost)
router.put('/:id/comment',auth.isLogin,Post.addComment)
router.put('/:id/togglevote',auth.isLogin,Post.toggleVotePost)
router.put('/:id/comment/:commentId/togglevote',auth.isLogin,Post.toggleVoteComment)
router.delete('/:id',auth.isLogin,Post.removePost)
router.get('/:id',Post.findOne)

module.exports = router