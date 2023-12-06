"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => (req, res, next) => {
    res.cookie('XSRF-Token', req.csrfToken());
    next();
};
