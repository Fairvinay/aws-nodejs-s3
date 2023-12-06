"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowOwnUserPatchOnly = exports.denyOwnUserDeletion = exports.userBelongsToAccount = void 0;
const in_memory_user_repository_1 = require("../../auth/repositories/in-memory/in-memory-user.repository");
const repository = new in_memory_user_repository_1.InMemoryUserRepository();
function userBelongsToAccount() {
    return function (req, res, next) {
        const currentUser = req.user;
        const requestedUserId = req.params.id;
        if (!requestedUserId) {
            return next();
        }
        repository.getUserById(requestedUserId).then(requestedUser => {
            if (requestedUser.accountId === currentUser.accountId) {
                return next();
            }
            else {
                res.status(403).json({ msg: 'You are not authorized to perform this operation' });
                return next('Unauthorized');
            }
        }).catch(() => res.sendStatus(404));
    };
}
exports.userBelongsToAccount = userBelongsToAccount;
function denyOwnUserDeletion() {
    return function (req, res, next) {
        const user = req.user;
        const userToDeleteId = req.params.id;
        if (userToDeleteId && userToDeleteId === user.id && req.method.toUpperCase() === 'DELETE') {
            res.status(403).json({ msg: 'Cannot delete your own user' });
        }
        else {
            next();
        }
    };
}
exports.denyOwnUserDeletion = denyOwnUserDeletion;
function allowOwnUserPatchOnly() {
    return function (req, res, next) {
        const user = req.user;
        const userToPatchId = req.params.id;
        if (userToPatchId && userToPatchId === user.id && req.method.toUpperCase() === 'PATCH') {
            next();
        }
        else {
            res.status(403).json({ msg: 'Operation not permitted' });
        }
    };
}
exports.allowOwnUserPatchOnly = allowOwnUserPatchOnly;
