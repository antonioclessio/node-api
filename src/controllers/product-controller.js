'use strict';

// const mongoose = require('mongoose');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const base = require('./base-controller');
const config = require('./../config');
const guid = require('guid');

exports.get = async (req, res, next) => base.createReturn(res, async () => await repository.get());
exports.getBySlug = async (req, res, next) => base.createReturn(res, async () => await repository.getBySlug(req.params.slug));
exports.getById = async (req, res, next) => base.createReturn(res, async () => await repository.getById(req.params.id));
exports.getByTag = async (req, res, next) => base.createReturn(res, async () => await repository.getByTag(req.params.tag));

exports.post = async (req, res, next) => {
    if (!isBodyValid(req.body, res)) return;

    // Criando o blob service
    try {
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        
        // Salvando as imagens
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        base.createReturn(res, async () => await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.slug,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://estudosnodestore.blob.core.windows.net/product-images/' + filename
        }));
    } catch (e) {
        console.log(e);
    }
};

exports.put = async (req, res, next) => {
    if (!isBodyValid(req.body, res)) return;
    base.createReturn(res, async () => await repository.update(req.params.id, req.body));
};

exports.delete = async (req, res, next) => base.createReturn(res, async() => await repository.delete(req.body.id));

const isBodyValid = (data, res) => {
    let contract = new ValidationContract();
    contract.hasMinLen(data.title, 3, 'O título deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(data.slug, 3, 'O slug deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(data.description, 3, 'A descrição deve conter pelo menos 3 caracteres.');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return false;
    }

    return true;
}