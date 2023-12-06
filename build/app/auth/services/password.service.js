"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const randtoken = require('rand-token');
const bcrypt = require("bcryptjs");
const config_1 = require("../../../config");
const in_memory_user_repository_1 = require("../repositories/in-memory/in-memory-user.repository");
const logger_1 = require("./../../../utils/logger");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
class PasswordService {
    setup(email, confirmationCode, password) {
        return userRepository.getUserByEmail(email).then(user => {
            if (user && !user.confirmed && user.confirmationCode === confirmationCode) {
                return bcrypt.hash(password, 10).then(hashedPassword => {
                    user.password = hashedPassword;
                    user.confirmed = true;
                    user.confirmationCode = undefined;
                    logger_1.default.info('auth.password_setup_successful', { user });
                });
            }
            else {
                logger_1.default.warn('auth.password_setup_failed', { user });
                return Promise.reject();
            }
        });
    }
    requestRecovery(email) {
        const recoveryCode = randtoken.uid(256);
        return userRepository.getUserByEmail(email).then(user => {
            if (user && user.confirmed) {
                user.recovery = {
                    code: recoveryCode,
                    requested: new Date()
                };
                this.sendRecoveryEmail(email, recoveryCode);
                logger_1.default.info('auth.password_recovery_request_successful', { user });
            }
            else {
                logger_1.default.warn('auth.password_recovery_request_failed', { user });
                return Promise.reject();
            }
        });
    }
    recover(email, recoveryCode, password) {
        return userRepository.getUserByEmail(email).then(user => {
            if (user && user.confirmed && user.recovery && user.recovery.code === recoveryCode) {
                return bcrypt.hash(password, 10).then(hashedPassword => {
                    user.password = hashedPassword;
                    user.recovery = undefined;
                    logger_1.default.info('auth.password_recovery_successful', { user });
                });
            }
            else {
                logger_1.default.warn('auth.password_recovery_failed', { user });
                return Promise.reject();
            }
        });
    }
    sendRecoveryEmail(email, code) {
        const link = `${config_1.default.clientUrl}/password?email=${email}&code=${code}&recovery=true`;
        console.log(`>>> LINK >>>: ${link}`);
        logger_1.default.info('auth.password_recovery_email_sent', { email });
    }
}
exports.PasswordService = PasswordService;
