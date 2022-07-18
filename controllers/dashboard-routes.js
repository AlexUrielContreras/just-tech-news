const router = require('express').Router();
const sequelize = require('../config/connections');
const withAuth = require('../utils/auth')

const { Post, User, Comment } = require('../models')


router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_url',
            'post_title',
            'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_body', 'post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attribute: ['username']
                }
            }, 
            {
                model: User,
                attribute: ['username']
            }
        ]

    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain:true}))
        res.render('dashboard', { posts, loggedIn: true})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
    
})

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id','post_url', 'post_title','createdAt', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_body', 'post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attribute: ['username']
                }
            }, 
            {
                model: User,
                attribute: ['username']
            }
        ]
    })
    .then(updatedPostData => {
        
        const post = updatedPostData.get({plain: true})
        res.render('edit-post', {post , loggedIn: true})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})




module.exports = router