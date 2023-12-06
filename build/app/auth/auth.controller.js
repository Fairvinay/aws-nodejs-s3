"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRequest_1 = require("../../models/authRequest");
const signup_service_1 = require("./services/signup.service");
const password_service_1 = require("./services/password.service");
const external_auth_controller_1 = require("./external-auth.controller");
const auth_service_instance_1 = require("./services/auth.service.instance");
const auth_validator_1 = require("./auth.validator");
const router = express_1.Router();
const signupService = new signup_service_1.SignupService();
const passwordService = new password_service_1.PasswordService();
router.post('/signup', auth_validator_1.default, function (req, res) {
    const signupRequest = authRequest_1.AuthRequest.buildFromRequest(req);
    signupService.signup(signupRequest).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.status(400).json({ msg: 'Signup failed' });
    });
});
router.post('/confirm', function (req, res) {
    let email = req.body.email;
    let confirmationCode = req.body.code;
    signupService.confirm(email, confirmationCode).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.status(400).json({ msg: 'Confirmation failed' });
    });
});
router.post('/setup', function (req, res) {
    let email = req.body.email;
    let code = req.body.code;
    let password = req.body.password;
    passwordService.setup(email, code, password).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.status(400).json({ msg: 'Setting password failed' });
    });
});
router.post('/recover-request', function (req, res) {
    let email = req.body.email;
    passwordService.requestRecovery(email).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.status(400).json({ msg: 'Recovery failed' });
    });
});
router.post('/recover', function (req, res) {
    let email = req.body.email;
    let code = req.body.code;
    let password = req.body.password;
    passwordService.recover(email, code, password).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.status(400).json({ msg: 'Recovery failed failed' });
    });
});
router.post('/login', function (req, res) {
    const loginRequest = authRequest_1.AuthRequest.buildFromRequest(req);
    auth_service_instance_1.default.login(loginRequest).then(result => {
        res.json(result);
    }).catch((err) => {
        res.status(401).json({ msg: err ? err : 'Login failed' });
    });
});
router.get('/logout', function (req, res) {
    auth_service_instance_1.default.logout(req.session).then(() => {
        res.sendStatus(204);
    });
});
router.get('/user', function (req, res) {
    auth_service_instance_1.default.getCurrentUser(req.session).then((user) => {
        res.status(200).json(user);
    });
});
router.use('/external', external_auth_controller_1.default);
exports.default = router;
