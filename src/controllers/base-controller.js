'use strict';

const authService = require('../services/auth-service');

exports.createReturn = async (res, func, data, params) => {
    try {
        let data = await func();
        res.status(normalizeStatusCode(params)).send({
            success: true,
            message: params && params.message ? params.message : 'Requisição executada com sucesso',
            data: data
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({
            success: false,
            message: 'Falha ao processar sua requisição',
            data: {
                e
            }
        });
    }
}

exports.createSimpleReturn = async (res, params) => {
    res.status(normalizeStatusCode(params)).send({
        success: true,
        message: params && params.message ? params.message : 'Requisição executada com sucesso',
        data: params.data
    })
}

exports.decodeToken = async (req) => {
    let token = authService.getToken(req);
    let data = await authService.decodeToken(token);

    return data;
}

function normalizeStatusCode(params) {
    let statusCode = 200;
    if (params && params.statusCode) {
        statusCode = params.statusCode;
    }

    return statusCode;
}