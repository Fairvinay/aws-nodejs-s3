"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_service_1 = require("./account.service");
const account_middleware_1 = require("./account.middleware");
const otp_service_1 = require("./../../auth/services/otp.service");
const role_middleware_1 = require("../../auth/role.middleware");
const accountService = new account_service_1.AccountService();
const otpService = new otp_service_1.OtpService();
const router = express_1.Router();
router.use('/users', role_middleware_1.hasRole('OWNER'));
router.get('/users', function (req, res) {
    const user = req.user;
    accountService.getUsers(user.accountId)
        .then(users => res.json(users));
});
router.post('/users', function (req, res) {
    const currentUser = req.user;
    const newUser = req.body;
    accountService.createUser(newUser.email, newUser.role, currentUser.accountId)
        .then(() => res.status(201).json())
        .catch((err) => res.status(401).json({ msg: err ? err : 'Creating user failed' }));
});
router.patch('/users/:id', account_middleware_1.allowOwnUserPatchOnly(), function (req, res) {
    const userToPatchId = req.params.id;
    const propsToPatch = req.body;
    accountService.patchUser(userToPatchId, propsToPatch, req.session)
        .then(() => res.status(201).json())
        .catch((err) => res.status(400).json({ msg: err ? err : 'Editing user failed' }));
});
router.delete('/users/:id', account_middleware_1.denyOwnUserDeletion(), account_middleware_1.userBelongsToAccount(), function (req, res) {
    const userToDeleteId = req.params.id;
    accountService.deleteUser(userToDeleteId)
        .then(() => res.sendStatus(204));
});
router.get('/secret', function (req, res) {
    const currentUser = req.user;
    if (currentUser.tfaSecret) {
        const keyuri = otpService.getOtpKeyUri(currentUser);
        res.status(200).json({ keyuri });
    }
    else {
        res.status(400).json({ msg: 'Error with generating code' });
    }
});
exports.default = router;
