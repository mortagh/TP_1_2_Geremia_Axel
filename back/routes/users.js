const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//get
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/role/:role', userController.getUsersByRole);

//post
router.post('/', userController.createUser);

//put
router.put('/:id', userController.updateUser);

//delete
router.delete('/:id', userController.deleteUser);

module.exports = router;