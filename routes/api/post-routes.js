const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connections')

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_title', 'post_url', 'createdAt', [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']],
        include: [
            {
                model: User, 
                attributes: ['username']
            }
        ],
        order: [['createdAt', 'DESC']],
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

router.get('/:id', (req, res) => {
    Post.findOne({
        attributes: ['id', 'post_title', 'post_url', 'createdAt',[sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count'] ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ],
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'no post with that id'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
    Post.create({
        post_title: req.body.post_title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

router.put('/upvote', (req, res) => {
    Post.upvote(req.body, {Vote})
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err)
    })

})

router.put('/:id', (req, res) => {
    Post.update({
        post_title: req.body.post_title
    }, 
    {
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'no post found with that id'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'no post found with this id'});
            return 
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})


module.exports = router;