'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const base = require('./base-controller');

const emailService = require('../services/email-service');

exports.get = (req, res, next) => base.createReturn(res, async () => await repository.get());
exports.getById = (req, res, next) => base.createReturn(res, async () => await repository.getById(req.params.id));

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
            password: md5(req.body.password + global+SALT_KEY)
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