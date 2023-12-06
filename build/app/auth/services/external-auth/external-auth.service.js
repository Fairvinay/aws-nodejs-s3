"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalAuthService = void 0;
const in_memory_user_repository_1 = require("../../repositories/in-memory/in-memory-user.repository");
const in_memory_account_repository_1 = require("../../repositories/in-memory/in-memory-account.repository");
const in_memory_categories_repository_1 = require("../../../settings/categories/in-memory-categories.repository");
const external_auth_factory_1 = require("./external-auth.factory");
const logger_1 = require("../../../../utils/logger");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
const accountRepository = new in_memory_account_repository_1.InMemoryAccountRepository();
const categoriesRepository = new in_memory_categories_repository_1.InMemoryCategoriesRepository();
class ExternalAuthService {
    login(provider, authCode, session) {
        const authProvider = external_auth_factory_1.getExternalAuthProvider(provider);
        return authProvider.getAccessToken(authCode, 'login').then((token) => authProvider.getUserInfo(token).then(userInfo => userRepository.getUserByExternalId(provider, userInfo.id).then(user => {
            session.user = user;
            logger_1.default.info(`auth.${provider}.session_login_successful`, { user });
        }).catch(() => {
            logger_1.default.error(`auth.${provider}.session_login_failed`, { userInfo });
            return Promise.reject('User not found');
        })));
    }
    signup(provider, authCode, session) {
        const authProvider = external_auth_factory_1.getExternalAuthProvider(provider);
        return authProvider.getAccessToken(authCode, 'signup').then((token) => authProvider.getUserInfo(token).then((userInfo) => userRepository.assertUserWithExternalIdNotExist(provider, userInfo.id).then(() => this.doSignup(provider, userInfo).then(() => {
            logger_1.default.info(`auth.${provider}.signup_successful`, { email: userInfo.email });
            userRepository.getUserByExternalId(provider, userInfo.id).then(user => {
                session.user = user;
                logger_1.default.info(`auth.${provider}.session_login_successful`, { user });
            });
        }).catch(error => {
            logger_1.default.error(`auth.${provider}.signup_failed`, { email: userInfo.email });
            throw error;
        }))));
    }
    doSignup(provider, userInfo) {
        return accountRepository.createAccount({}).then(accountId => Promise.all([
            categoriesRepository.createDefaultCategories(accountId),
            userRepository.createUser({
                accountId: accountId,
                email: userInfo.email,
                role: 'OWNER',
                confirmed: true,
                createdWith: provider,
                externalId: { [provider]: userInfo.id }
            })
        ]));
    }
}
exports.ExternalAuthService = ExternalAuthService;
