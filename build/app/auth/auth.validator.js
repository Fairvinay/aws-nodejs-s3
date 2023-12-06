"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const logger_1 = require("./../../utils/logger");
function passwordValidator() {
    return express_validator_1.check('password').isLength({ min: 5 })
        .withMessage('must have at least 5 characters');
}
function emailValidator() {
    return express_validator_1.check('email').isEmail()
        .withMessage('is not valid');
}
function errorParser() {
    return function (req, res, next) {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            logger_1.default.warn('auth.signup_validation_failed', { errors: errors.array() });
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
exports.default = [passwordValidator(), emailValidator(), errorParser()];
