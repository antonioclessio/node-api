'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const base = require('./base-controller');
const authService = require('../services/auth-service');

const emailService = require('../services/email-service');

exports.get = (req, res, next) => base.createReturn(res, async () => await repository.get());
exports.getById = (req, res, next) => base.createReturn(res, async () => await repository.getById(req.params.id));

exports.authenticate = async (req, res, next) => {
    const customer = await repository.authenticate({
        email: req.body.email,
        password: md5(req.body.password + global.SALT_KEY)
    });

    if (!customer) {
        base.createSimpleReturn(res, {
            statusCode: 404,
            message: 'Usuário ou senha inválidos'
        });

        return;
    }

    const token = await authService.generateToken({ 
        id: customer._id,
        email: customer.email,
        name: customer.name,
        roles: customer.roles
    });

    base.createSimpleReturn(res, {
        data: {
            token: token,
            customer: {
                email: customer.email,
                name: customer.name
            }
        }
    });
};

exports.refreshToken = async (req, res, next) => {
    const token = await base.decodeToken(req);
    const customer = await repository.getById(token.id);

    if (!customer) {
        base.createSimpleReturn(res, {
            statusCode: 404,
            message: 'Cliente não encontrado'
        });

        return;
    }

    const tokenData = await authService.generateToken({ 
        id: customer._id,
        email: customer.email,
        name: customer.name,
        roles: customer.roles
    });

    base.createSimpleReturn(res, {
        data: {
            token: tokenData,
            customer: {
                email: customer.email,
                name: customer.name
            }
        }
    });
};

exports.create = (req, res, next) => {
    if (!bodyIsValid(req.body, res)) return;
    
    emailService.send(
        req.body.email, 
        'Bem vindo ao Node Store', 
        global.EMAIL_TMPL.replace('{0}', req.body.name));

    base.createReturn(res, async () => 
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        }));
};

exports.update = (req, res, next) => {
    if (!bodyIsValid(req.body, res)) return;
    base.createReturn(res, async () => await repository.update(req.body));
};

exports.delete = (req, res, next) => base.createReturn(res, async () => await repository.delete(req.body.id));

const bodyIsValid = (data, res) => {
    let contract = new ValidationContract();
    contract.hasMinLen(data.name, 3, 'O nome deve conter pelo menos 3 caracteres.');
    contract.isEmail(data.email, 'E-mail inválido.');
    contract.hasMinLen(data.password, 6, 'A senha deve conter pelo menos 6 caracteres.');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return false;
    }

    return true;
}