"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const randtoken = require('rand-token');
const config_1 = require("../../../config");
const logger_1 = require("./../../../utils/logger");
const in_memory_user_repository_1 = require("../../auth/repositories/in-memory/in-memory-user.repository");
const user_1 = require("../../../models/user");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
const PATCHABLE_PROPS = ['tfa'];
class AccountService {
    getUsers(accountId) {
        return userRepository.getUsers(accountId)
            .then(users => users.map(u => user_1.User.toSafeUser(u)));
    }
    createUser(userEmail, role, accountId) {
        const confirmationCode = randtoken.uid(256);
        return userRepository.createUser({
            accountId: accountId,
            email: userEmail,
            password: undefined,
            role: role,
            confirmed: false,
            confirmationCode,
            createdWith: 'password'
        }).then(() => {
            logger_1.default.info('settings.create_user_successful', { email: userEmail });
            this.sendConfirmationEmail(userEmail, confirmationCode);
            return Promise.resolve();
        }).catch(error => {
            logger_1.default.error('settings.create_user_failed', { email: userEmail });
            throw error;
        });
    }
    patchUser(userId, data, session) {
        const filteredUser = Object.keys(data)
            .filter(property => PATCHABLE_PROPS.includes(property))
            .reduce((user, property) => {
            user[property] = data[property];
            return user;
        }, {});
        return userRepository.patchUser(userId, filteredUser)
            .then(patchedUser => {
            if (session && session.user && session.user.id === userId) {
                session.user = patchedUser;
            }
        });
    }
    deleteUser(userId) {
        return userRepository.deleteUser(userId);
    }
    sendConfirmationEmail(email, code) {
        const link = `${config_1.default.clientUrl}/password?email=${email}&code=${code}`;
        console.log(`>>> LINK >>>: ${link}`);
        logger_1.default.info('settings.create_user_confirmation_email_sent', { email });
    }
}
exports.AccountService = AccountService;
