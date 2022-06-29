const router = require('express').Router();
const { User } = require('../../models');

// GET 
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password']}
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
        attributes: { exclude: ['password']},
        
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user dound with this id'});
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
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    });
});

// PUT
router.put('/:id', (req, res) => {
    // req.body is the new data we want to use
    User.update(req.body, {
        where: {
            // where we want to use the new data
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id '})
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
            res.status(404).json({ message: 'No user found'});
            return 
        };
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});


module.exports = router;