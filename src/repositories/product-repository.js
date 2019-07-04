'use strict';

const mongoose = require('mongoose');
const ProductModel = mongoose.model('ProductModel');

exports.get = async () => {
    let res = await ProductModel.find({
        active: true,
    }, 'title price slug');

    return res;
}

exports.getBySlug = async (slug) => {
    const res = await ProductModel.findOne({
        slug: slug,
        active: true
    }, 'title description tags price slug');

    return res;
}

exports.getById = async (id) => {
    let res = await ProductModel.findById(id);
    return res;
}

exports.getByTag = async (tag) => {
    let res = await ProductModel
                .find({
                    tags: tag,
                    active: true
                }, 'title description price slug tags');
    return res;
}

exports.create = async (data) => {
    let product = new ProductModel(data);
    await product.save()
}

exports.update = async (id, data) => {
    await ProductModel
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
}

exports.delete = async (id) => {
    await ProductModel.findByIdAndRemove(id);
}