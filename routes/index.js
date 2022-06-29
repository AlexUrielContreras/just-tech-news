const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// catch all incase user enter a url not defined 
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;