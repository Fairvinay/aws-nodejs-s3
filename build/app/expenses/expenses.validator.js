"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const logger_1 = require("./../../utils/logger");
function value() {
    return express_validator_1.check('value').isNumeric()
        .withMessage('must be a number');
}
function datetime() {
    return express_validator_1.check('datetime').escape();
}
function counterparty() {
    return express_validator_1.check('counterparty').escape();
}
function errorParser() {
    return function (req, res, next) {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            logger_1.default.warn('expenses.validation_failed', { errors: errors.array() });
            res.status(422).json({ msg: formatErrors(errors.array()) });
        }
        else {
            next();
        }
    };
}
function formatErrors(errors) {
    return errors.map(e => `${e.param} ${e.msg}`).join(', ');
}
exports.default = [value(), datetime(), counterparty(), errorParser()];
