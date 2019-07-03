'use strict';

exports.createReturn = async (res, func, message = null) => {
    try {
        var data = await func();
        res.status(200).send({
            success: true,
            message: message || 'Requisição executada com sucesso',
            data: data
        });
    } catch(e) {
        res.status(500).send({
            success: false,
            message: 'Falha ao processar sua requisição'
        })        
    }
}