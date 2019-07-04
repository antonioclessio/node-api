'use strict';

const mongoose = require('mongoose');
const OrderModel = mongoose.model('OrderModel');

exports.get = async (data) => {
    let res = await OrderModel
                        .find({}, 'number status customer items')
                        .populate('customer', 'name')
                        .populate('items.product', 'title');
    return res;
}

exports.getById = async (id) => {
    return await OrderModel.findById(id);
}

exports.create = async (data) => {
    let Order = new OrderModel(data);
    await Order.save();
}

exports.finish = async (id) => {
    await OrderModel.findByIdAndUpdate(id, {
        $set: {
            status: 'done'
        }
    });
}