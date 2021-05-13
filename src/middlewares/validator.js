const {check} = require('express-validator');

module.exports.validateBoard = () => {
    return [ 
        check('name', 'name does not Empty').not().isEmpty(),
        check('created_by', 'created_by dose not Empty').not().isEmpty(),
    ]; 
}

   