"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0Service = void 0;
const user_1 = require("../../models/user");
const in_memory_account_repository_1 = require("../auth/repositories/in-memory/in-memory-account.repository");
const in_memory_categories_repository_1 = require("../settings/categories/in-memory-categories.repository");
const auth0_api_1 = require("./auth0.api");
const logger_1 = require("../../utils/logger");
const accountRepository = new in_memory_account_repository_1.InMemoryAccountRepository();
const categoriesRepository = new in_memory_categories_repository_1.InMemoryCategoriesRepository();
const auth0 = new auth0_api_1.Auth0Api();
class Auth0Service {
    constructor() {
        this.USER_DATA = 'https://budget.com/userdata';
    }
    login(authCode, session) {
        return auth0.getIdToken(authCode)
            .then(token => this.getUserFromToken(token))
            .then(user => this.doLogin(user, session))
            .catch((error) => {
            logger_1.default.error(`auth0.session_login_failed`, { error: error.toString() });
            throw error;
        });
    }
    doLogin(user, session) {
        return this.signupIfNeeded(user, session).then((signedUser) => {
            session.user = signedUser ? this.normalizeUserFromApi(signedUser) : user;
            logger_1.default.info(`auth0.session_login_successful`, { user });
        });
    }
    signupIfNeeded(user, session) {
        if (this.isUserSignedUp(user)) {
            return Promise.resolve();
        }
        else {
            let accountId;
            return accountRepository.createAccount({})
                .then(createdAccountId => { accountId = createdAccountId; })
                .then(() => categoriesRepository.createDefaultCategories(accountId))
                .then(() => this.setUserAccountAndRole(user.id, accountId, 'OWNER'))
                .then(signedUser => {
                logger_1.default.info(`auth0.signup_successful`, { user: signedUser });
                return signedUser;
            });
        }
    }
    setUserAccountAndRole(userId, accountId, role) {
        return auth0.getAccessToken()
            .then(token => auth0.updateUser(token, userId, {
            app_metadata: {
                accountId, role,
            }
        }));
    }
    isUserSignedUp(user) {
        return user[this.USER_DATA]
            && user[this.USER_DATA].role
            && user[this.USER_DATA].accountId;
    }
    getUserFromToken(token) {
        const rawUser = token.split('.')[1];
        const user = JSON.parse(Buffer.from(rawUser, 'base64').toString());
        return this.normalizeUserFromToken(user);
    }
    normalizeUserFromToken(user) {
        const userdata = user[this.USER_DATA];
        Object.assign(user, userdata, { id: user.sub });
        return user_1.User.build(user);
    }
    normalizeUserFromApi(user) {
        const userdata = user.app_metadata;
        Object.assign(user, userdata, { id: user.user_id });
        return user_1.User.build(user);
    }
}
exports.Auth0Service = Auth0Service;
