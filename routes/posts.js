const router = require('express').Router();
const verify = require ('./verifyToken')
//verify below is middleware
router.get('/', verify,  (req, res) => {
    res.json({posts : {title : 'my first post', description : 'Data after you are logged in!'}});
});

module.exports = router;