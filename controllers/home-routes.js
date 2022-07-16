const router = require('express').Router();
const sequelize = require('../config/connections');
const { Post, User, Comment } = require('../models')

router.get('/', (req, res) => {
    console.log(res.session);
    Post.findAll({
        attributes: ['id', 'post_url', 'post_title', 'createdAt', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_body', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // serialize the object down to one the properties we need
            const posts = dbPostData.map(post => post.get({ plain: true }))
            res.render('homepage', { posts, loggedIn: req.session.loggedIn })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'post_title', 'createdAt', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_body', 'post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'no post found with this id'});
            return
        }
        const post = dbPostData.get({ plain: true });
        res.render('single-post', { post, loggedIn: req.session.loggedIn })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return
    }

    res.render('login')
})

module.exports = router;