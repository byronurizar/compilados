const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const router = express.Router();

const upSert = (req, res, next) => {
    controller.upSert(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
router.post('/',upSert);

module.exports = router;