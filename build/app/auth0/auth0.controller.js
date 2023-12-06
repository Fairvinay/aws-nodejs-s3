"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth0_service_1 = require("./auth0.service");
const state_service_1 = require("../auth/services/external-auth/state.service");
const config_1 = require("../../config");
const router = express_1.Router();
const auth0 = new auth0_service_1.Auth0Service();
router.get('/', function (req, res) {
    res.redirect(`${config_1.default.auth0.authorizeUrl}` +
        `?client_id=${config_1.default.auth0.clientID}` +
        `&state=${state_service_1.default.setAndGetNewState(req.session)}` +
        `&response_type=code` +
        `&scope=${config_1.default.auth0.scope}` +
        `&redirect_uri=${config_1.default.auth0.callbackURL}`);
});
router.get('/callback', function (req, res) {
    const authCode = req.query.code;
    const state = req.query.state;
    state_service_1.default.assertStateIsValid(req.session, state)
        .then(() => checkErrors(req))
        .then(() => auth0.login(authCode, req.session))
        .then(() => res.redirect('/'))
        .catch((err) => res.redirect(`/login?msg=${err}`));
});
function checkErrors(req) {
    if (req.query.error) {
        throw new Error(req.query.error_description);
    }
}
exports.default = router;
