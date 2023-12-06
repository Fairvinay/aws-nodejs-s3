"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalAuthProvider = void 0;
const github_auth_provider_1 = require("./github-auth.provider");
const google_auth_provider_1 = require("./google-auth.provider");
function getExternalAuthProvider(provider) {
    switch (provider) {
        case 'github':
            return new github_auth_provider_1.GithubAuthProvider();
        case 'google':
            return new google_auth_provider_1.GoogleAuthProvider();
        default:
            throw 'Auth provider not defined';
    }
}
exports.getExternalAuthProvider = getExternalAuthProvider;
