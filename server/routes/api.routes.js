const express = require('express')

const controller = require('../controllers/controller');
const userController = require('../controllers/user.controller');
const labsController = require('../controllers/labs.controller');

const router = express.Router();

router.use('/', controller)
router.use('/user', userController);
router.use('/labs', labsController);

module.exports = router;