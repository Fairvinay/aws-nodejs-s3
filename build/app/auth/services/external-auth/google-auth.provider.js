"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthProvider = void 0;
const axios = require('axios');
const config_1 = require("../../../../config");
const logger_1 = require("../../../../utils/logger");
class GoogleAuthProvider {
    getAccessToken(authCode, action) {
        const options = { headers: { accept: 'application/json' } };
        console.log("action : " + action);
        const body = {
            client_id: config_1.default.externalAuth.google.clientID,
            client_secret: config_1.default.externalAuth.google.clientSecret,
            redirect_uri: config_1.default.externalAuth.google.callbackURL + `/${action}`,
            grant_type: 'authorization_code',
            code: authCode
        };
        return axios.post(config_1.default.externalAuth.google.accessTokenUrl, body, options)
            .then((res) => res.data['access_token'])
            .catch((error) => {
            logger_1.default.error('auth.google.getAccessToken_failed', { error });
            throw error;
        });
    }
    getUserInfo(accessToken) {
        const options = { headers: { Authorization: `Bearer ${accessToken}` } };
        return axios.get(config_1.default.externalAuth.google.userInfoUrl, options)
            .then((res) => {
            logger_1.default.info('auth.google.getUserInfo', { googleId: res.data.sub });
            return {
                id: res.data.sub,
                email: res.data.email
            };
        }).catch((error) => {
            logger_1.default.error('auth.google.getUserInfo_failed', { error });
            return Promise.reject('Could not get UserInfo from Google');
        });
    }
}
exports.GoogleAuthProvider = GoogleAuthProvider;
