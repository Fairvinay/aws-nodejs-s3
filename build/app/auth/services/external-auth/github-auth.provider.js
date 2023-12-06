"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAuthProvider = void 0;
const axios = require('axios');
const config_1 = require("../../../../config");
const logger_1 = require("../../../../utils/logger");
class GithubAuthProvider {
    getAccessToken(authCode) {
        const options = { headers: { accept: 'application/json' } };
        const body = {
            client_id: config_1.default.externalAuth.github.clientID,
            client_secret: config_1.default.externalAuth.github.clientSecret,
            code: authCode
        };
        return axios.post(config_1.default.externalAuth.github.accessTokenUrl, body, options)
            .then((res) => res.data['access_token'])
            .catch((error) => {
            logger_1.default.error('auth.github.getAccessToken_failed', { error });
            throw error;
        });
    }
    getUserInfo(accessToken) {
        const options = { headers: { Authorization: `token ${accessToken}` } };
        return axios.get(config_1.default.externalAuth.github.userInfoUrl, options)
            .then((res) => {
            logger_1.default.info('auth.github.getUserInfo', { githubId: res.data.id });
            return {
                id: res.data.id.toString(),
                login: res.data.login,
                email: res.data.email
            };
        }).catch((error) => {
            logger_1.default.error('auth.github.getUserInfo_failed', { error });
            return Promise.reject('Could not get UserInfo from GitHub');
        });
    }
}
exports.GithubAuthProvider = GithubAuthProvider;
