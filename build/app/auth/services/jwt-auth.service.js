"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthService = void 0;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config_1 = require("../../../config");
const passport_1 = require("../passport");
const login_throttler_1 = require("./login.throttler");
const in_memory_user_repository_1 = require("../repositories/in-memory/in-memory-user.repository");
const user_1 = require("./../../../models/user");
const logger_1 = require("./../../../utils/logger");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
const loginThrottler = new login_throttler_1.LoginThrottler();
class JwtAuthService {
    authenticate() {
        return passport_1.default.authenticate('jwt', { session: false });
    }
    login(loginRequest) {
        const email = loginRequest.email;
        return userRepository.getUserByEmail(email).then(user => {
            return loginThrottler.isLoginBlocked(email).then(isBlocked => {
                if (isBlocked) {
                    logger_1.default.warn('auth.jwt_login_failed.user_blocked', { email });
                    throw `Login blocked. Please try in ${config_1.default.loginThrottle.timeWindowInMinutes} minutes`;
                }
                else {
                    return bcrypt.compare(loginRequest.password, user.password).then(match => {
                        if (match && user.confirmed) {
                            const token = createSignedToken(user);
                            logger_1.default.info('auth.jwt_login_successful', { user });
                            return { jwt: token };
                        }
                        else if (match && !user.confirmed) {
                            logger_1.default.info('auth.jwt_login_failed.not_confirmed', { user });
                            return Promise.reject('Please confirm your user profile');
                        }
                        else {
                            loginThrottler.registerLoginFailure(email);
                            logger_1.default.info('auth.jwt_login_failed.wrong_password', { user });
                            return Promise.reject();
                        }
                    });
                }
            });
        });
    }
    logout() {
        logger_1.default.info('auth.jwt_logout_successful');
        return Promise.resolve();
    }
    getCurrentUser() {
        return Promise.resolve();
    }
}
exports.JwtAuthService = JwtAuthService;
function createSignedToken(user) {
    const payload = user_1.User.toSafeUser(user);
    return jwt.sign(payload, config_1.default.jwtSecret, { expiresIn: 600 });
}
