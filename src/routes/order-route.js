'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', authService.authorize, controller.post);
router.put('/:id/finish', authService.authorize, controller.finish);

module.exports = router;