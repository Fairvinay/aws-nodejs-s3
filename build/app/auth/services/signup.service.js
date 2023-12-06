"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupService = void 0;
const randtoken = require('rand-token');
const bcrypt = require("bcryptjs");
const config_1 = require("../../../config");
const otp_service_1 = require("./otp.service");
const in_memory_account_repository_1 = require("../repositories/in-memory/in-memory-account.repository");
const in_memory_user_repository_1 = require("../repositories/in-memory/in-memory-user.repository");
const in_memory_categories_repository_1 = require("../../settings/categories/in-memory-categories.repository");
const logger_1 = require("./../../../utils/logger");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
const accountRepository = new in_memory_account_repository_1.InMemoryAccountRepository();
const categoriesRepository = new in_memory_categories_repository_1.InMemoryCategoriesRepository();
const otp = new otp_service_1.OtpService();
class SignupService {
    signup(signupRequest) {
        const confirmationCode = randtoken.uid(256);
        return bcrypt.hash(signupRequest.password, 10)
            .then(hashedPassword => accountRepository.createAccount({})
            .then(accountId => Promise.all([
            categoriesRepository.createDefaultCategories(accountId),
            userRepository.createUser({
                accountId: accountId,
                email: signupRequest.email,
                password: hashedPassword,
                role: 'OWNER',
                confirmed: false,
                confirmationCode,
                createdWith: 'password',
                tfaSecret: otp.generateNewSecret()
            })
        ])).then(() => {
            logger_1.default.info('auth.signup_successful', { email: signupRequest.email });
            this.sendConfirmationEmail(signupRequest.email, confirmationCode);
            return Promise.resolve();
        }).catch(error => {
            logger_1.default.error('auth.signup_failed', { email: signupRequest.email });
            throw error;
        }));
    }
    confirm(email, confirmationCode) {
        return userRepository.getUserByEmail(email).then(user => {
            if (user && !user.confirmed && user.confirmationCode === confirmationCode) {
                user.confirmed = true;
                user.confirmationCode = undefined;
                logger_1.default.info('auth.confirmation_successful', { email });
            }
            else {
                logger_1.default.warn('auth.confirmation_failed', { email });
                return Promise.reject();
            }
        });
    }
    sendConfirmationEmail(email, code) {
        const link = `${config_1.default.clientUrl}/confirm?email=${email}&code=${code}`;
        console.log(`>>> LINK >>>: ${link}`);
        logger_1.default.info('auth.signup_confirmation_email_sent', { email });
    }
}
exports.SignupService = SignupService;
