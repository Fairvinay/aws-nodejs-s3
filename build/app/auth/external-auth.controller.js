"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const external_auth_service_1 = require("./services/external-auth/external-auth.service");
const state_service_1 = require("./services/external-auth/state.service");
const config_1 = require("../../config");
const router = express_1.Router();
const externalAuthService = new external_auth_service_1.ExternalAuthService();
router.get('/:provider/:action', function (req, res) {
    const provider = req.params.provider;
    const action = req.params.action === 'signup' ? 'signup' : 'login';
    console.log("provider " + provider);
    if (provider in config_1.default.externalAuth) {
        const providerConfig = config_1.default.externalAuth[provider];
        const redirect_uri = `${providerConfig.callbackURL}/${action}`;
        res.redirect(`${providerConfig.authorizeUrl}` +
            `?client_id=${providerConfig.clientID}` +
            `&response_type=code` +
            `&state=${state_service_1.default.setAndGetNewState(req.session)}` +
            `&scope=${providerConfig.scope}` +
            `&redirect_uri=${redirect_uri}`);
    }
    else {
        res.redirect(`/login?msg=Provider not supported`);
    }
});
router.get('/:provider/callback/signup', function (req, res) {
    const provider = req.params.provider;
    const authCode = req.query.code;
    const state = req.query.state;
    state_service_1.default.assertStateIsValid(req.session, state).then(() => externalAuthService.signup(provider, authCode, req.session).then(() => {
        res.redirect('/');
    })).catch((err) => {
        res.redirect(`/login?msg=${err ? err : 'Signup failed'}`);
    });
});
router.get('/:provider/callback/login', function (req, res) {
    const provider = req.params.provider;
    const authCode = req.query.code;
    const state = req.query.state;
    state_service_1.default.assertStateIsValid(req.session, state).then(() => externalAuthService.login(provider, authCode, req.session).then(() => {
        res.redirect('/');
    })).catch((err) => {
        res.redirect(`/login?msg=${err ? err : 'Login failed'}`);
    });
});
exports.default = router;
