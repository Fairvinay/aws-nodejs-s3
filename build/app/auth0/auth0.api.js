"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0Api = void 0;
const axios = require('axios');
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
class Auth0Api {
    getIdToken(authCode) {
        const options = { headers: { accept: 'application/json' } };
        const body = {
            client_id: config_1.default.auth0.clientID,
            client_secret: config_1.default.auth0.clientSecret,
            redirect_uri: config_1.default.auth0.callbackURL,
            grant_type: 'authorization_code',
            code: authCode
        };
        return axios.post(config_1.default.auth0.accessTokenUrl, body, options)
            .then((res) => res.data['id_token'])
            .catch((error) => {
            logger_1.default.error('auth0.getIdToken_failed', { error });
            throw error;
        });
    }
    getAccessToken() {
        const options = { headers: { accept: 'application/json' } };
        const body = {
            client_id: config_1.default.auth0.clientID,
            client_secret: config_1.default.auth0.clientSecret,
            audience: config_1.default.auth0.apiUrl,
            grant_type: 'client_credentials'
        };
        return axios.post(config_1.default.auth0.accessTokenUrl, body, options)
            .then((res) => res.data['access_token'])
            .catch((error) => {
            logger_1.default.error('auth0.getAccessToken_failed', { error });
            throw error;
        });
    }
    updateUser(accessToken, userId, data) {
        const options = { headers: { Authorization: `Bearer ${accessToken}` } };
        return axios.patch(`${config_1.default.auth0.apiUrl}users/${userId}`, data, options)
            .then((res) => {
            logger_1.default.info('auth0.user.updated', { userId, data });
            return res.data;
        }).catch((error) => {
            logger_1.default.error('auth0.user.update_failed', { error });
            return Promise.reject('Could not signup user');
        });
    }
}
exports.Auth0Api = Auth0Api;
