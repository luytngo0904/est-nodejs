const {check} = require('express-validator');

module.exports.validateBoard = () => {
    return [ 
        check('name', 'name does not Empty').not().isEmpty(),
        check('created_by', 'created_by dose not Empty').not().isEmpty(),
    ]; 
}

module.exports.validateAuth = () => {
    return [
        check('email', 'email dose not Empty').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('newpass', 'new password dose not Empty').not().isEmpty(),
        check('newpass', 'password more than 6 degits').isLength({ min: 6 })
    ]
}
   