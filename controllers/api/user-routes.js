const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET 
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

// GET - single user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id', 'post_title', 'post_url', 'createdAt']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_body', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: Post,
                attributes: ['post_title'],
                through: Vote,
                as: 'voted_post'
            }
        ],
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user dound with this id' });
                return
            };
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

// POST
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            // res.session.save creates the session and then will run the callback function 
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});

// login 
router.post('/login', (req, res) => {
    // use find one to locate the user instance email
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with that email' })
                return
            };

            const validPassword = dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect Password!' })
                return
            }

            req.session.save(() => {
                // declare session variables
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true

                res.json({ user: dbUserData, message: 'You are now logged in' })
            })

        })
})

// PUT
router.put('/:id', (req, res) => {
    // req.body is the new data we want to use
    User.update(req.body, {
        individualHooks: true,
        where: {
            // where we want to use the new data
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id ' })
                return
            };
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});


// DELETE 
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found' });
                return
            };
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        })
    } else {
        res.status(404).end()
    }

})


module.exports = router;