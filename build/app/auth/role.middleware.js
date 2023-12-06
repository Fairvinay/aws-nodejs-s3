"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = exports.readerOnlyReads = void 0;
const types_1 = require("../../models/types");
const logger_1 = require("./../../utils/logger");
function readerOnlyReads() {
    return function (req, res, next) {
        const user = req.user;
        if (!isRoleFound(user)) {
            handleRoleNotFound(user, res);
        }
        else if (user.role && user.role.toUpperCase() === 'READER' && req.method.toUpperCase() !== 'GET') {
            logger_1.default.warn('auth.reader_check_failure', { user });
            res.status(403).json({ msg: 'You are not authorized to perform this operation' });
            next('Unauthorized');
        }
        else {
            next();
        }
    };
}
exports.readerOnlyReads = readerOnlyReads;
function hasRole(roleToCheck) {
    return function (req, res, next) {
        const user = req.user;
        if (!isRoleFound(user)) {
            handleRoleNotFound(user, res);
        }
        else if (user.role !== roleToCheck) {
            logger_1.default.warn('auth.role_check_failure', { roleToCheck, user });
            res.status(403).json({ msg: 'You are not authorized to perform this operation' });
        }
        else {
            next();
        }
    };
}
exports.hasRole = hasRole;
function isRoleFound(user) {
    return user && types_1.ROLES.find(r => r === user.role);
}
function handleRoleNotFound(user, res) {
    logger_1.default.error('auth.role_not_found', { user });
    res.status(500).json({ msg: 'System could not find your permissions' });
}
