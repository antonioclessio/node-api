'use strict';

const mongoose = require('mongoose');
const CustomerModel = mongoose.model('CustomerModel');

exports.get = async () => {
    return await CustomerModel.find({}, 'name email');
}

exports.getById = async (id) => {
    return await CustomerModel.findById(id, 'name email');
}

exports.create = async (data) => {
    var Customer = new CustomerModel(data);
    await await Customer.save()
}

exports.update = async (id, data) => {
    await CustomerModel.findOneAndUpdate(id, {
        $set: {
            'name': data.name,
            'email': data.email
        }
    });
}

exports.delete = async (id) => {
    await CustomerModel.findOneAndRemove(id);
}