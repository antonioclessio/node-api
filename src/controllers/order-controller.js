'use strict';

const repository = require('../repositories/order-repository');
const guid = require('guid');
const base = require('./base-controller');

exports.get = (req, res, next) => base.createReturn(res, async () => await repository.get());
exports.getById = (req, res, next) => base.createReturn(res, async () => await repository.getById(req.params.id));

exports.post = async (req, res, next) => {
    base.createReturn(res, async () =>
        await repository.create({
            customer: req.body.customer,
            number: guid.raw().substring(0, 6),
            itens: req.body.itens
        })
    );
};

exports.finish = (req, res, next) => base.createReturn(res, async () => await repository.finish(req.body.id));