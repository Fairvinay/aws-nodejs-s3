"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
exports.default = () => (err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        logger_1.default.info('auth.invalid_csrf_token');
        res.status(401).json({ msg: 'Invalid CSRF Token - refresh the page!' });
    }
    else if (err) {
        next(err);
    }
    else {
        next();
    }
};
