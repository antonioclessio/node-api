'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', controller.create);
router.put('/', authService.authorize, controller.update);
router.delete('/', authService.authorize, controller.delete);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);

module.exports = router;