const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const router = express.Router();

const listar = (req, res, next) => {
    controller.list(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
router.get('/', listar);

module.exports = router;