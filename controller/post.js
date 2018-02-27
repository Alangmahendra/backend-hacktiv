const Model = require('../models/post')

class Post {
  static findAll(req, res) {
    Model.find({}).populate('creator').populate('comments.creator').exec((err, data) => {
      if (err) {
        res.status(500).json({
          message: err
        })
      } else {
        res.status(200).json({ message: 'all post', data: data })
      }
    })
  }


  static findOne(req, res) {
    Model.findById(req.params.id).populate('creator').populate('comments.creator').exec((err, data) => {
      if (err) {
        res.status(500).json({ message: err })
      } else {
        res.status(200).json({ message: 'data find', data: data })
      }
    })
  }


  static addPost(req, res) {
    let obj = {
      ask: req.body.ask,
      creator: req.user._id
    }
    Model.create(obj, (err, data) => {
      if (err) {
        res.status(500).json({ message: err })
      } else {
        res.status(200).json({ message: 'your question has added', data: data })
      }
    })
  }

  static updatePost(req, res) {
    let obj = {
      ask: req.body.ask
    }
    Model.findByIdAndUpdate(req.params.id, obj, { new: true })
      .then(data => {
        res.status(200).json({ message: 'terapdate', data: data })
      })
      .catch(err => {
        res.status(500).json({ message: err })
      })
  }

  static removePost(req, res) {
    Model.findOneAndRemove(
      {
        _id: req.params.id,
        creator: req.user._id
      })
      .then(data => {
        res.status(200).json({ message: 'terhapus', data: data })
      })
      .catch(err => {
        res.status(500).json({ message: err })
      })
  }

  static addComment(req, res) {
    let obj = {
      creator: req.user._id,
      text: req.body.text
    }
    Model.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: obj
      }
    }, { new: true }).populate('comments.creator').exec((err, data) => {
      if (err) {
        res.status(500).json({ message: err })
      } else {
        res.status(200).json({ message: 'ngomen', data: data })
      }
    })
  }


  static findAllMypost(req, res) {
    Model.find({ creator: req.user._id }).populate('comments.creator').exec((err, data) => {
      if (err) {
        res.status(500).json({ message: err })
      } else {
        res.status(200).json({ message: 'all of your post', data: data })
      }
    })
  }

  static toggleVotePost(req, res) {
    Model.findById(req.params.id).populate('comments.creator').populate('creator')
      .then(data => {

        if (!data || data.creator._id == req.user._id) {
          console.log(data.creator)
          console.log(req.user._id)
          res.status(403).json({ message: 'hanya alay yg ngelike postingan' })
        } else {
          const direction = req.body.direction
          const isUpvote = direction == 'up'
          console.log('udah neh dia ke atas', isUpvote)
          const isCurrentUpvoters = data.upvoters.indexOf(req.user._id) >= 0
          const isCurrentDownvoters = data.downvoters.indexOf(req.user._id) >= 0

          if (isUpvote && !isCurrentUpvoters) {
            data.downvoters.pull(req.user._id)
            data.upvoters.push(req.user._id)
          }
          if (!isUpvote && !isCurrentDownvoters) {
            data.downvoters.push(req.user._id)
            data.upvoters.pull(req.user._id)
          }
          return data.save()
        }
      })
      .then(data => {
        res.status(200).json({ message: 'voted / downvote success', data: data })
      })
      .catch(err => {
        res.status(500).json({ message: err })
      })
  }

  static toggleVoteComment(req, res) {
    Model.findOne({
      _id: req.params.id,
    }).populate('comments.creator')
      // .populate('comments')
      .then(post => {
        console.log('haaeety', post)
        // for (let index = 0; index < post.comments.length; index++) {
        //   if (post.comments[index] == req.params.commentId) {
        //     console.log('ooooooooyyyyyyy', post.comments[index])
        //   }

        // }
        if (!post || post.creator._id == req.user._id) {
          console.log(post.creator)
          console.log(req.user._id)
          res.status(403).json({ message: 'hanya alay yg ngelike postingan' })
        } else {
          // res.status(200).json({post})
          const direction = req.body.direction
          const isUpvote = direction == 'up'

          for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i]._id == req.params.commentId) {
              let comment = post.comments[i]
              let isCurrentDownvoters = comment.downvoters.indexOf(req.user._id) >= 0
              let isCurrentUpvoters = comment.upvoters.indexOf(req.user._id) >= 0

              if (isUpvote && !isCurrentUpvoters) {
                console.log('voteupplase')
                comment.upvoters.push(req.user._id)
                comment.downvoters.pull(req.user._id)
              }
              if (!isUpvote && !isCurrentDownvoters) {
                console.log('votedopwnlpplse')
                comment.upvoters.pull(req.user._id)
                comment.downvoters.push(req.user._id)
              }

              post.save()
                .then(post => {
                  res.json({
                    message: 'ada nih',
                    data: comment
                  })
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }

      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: err })
      })
  }

}

module.exports = Post