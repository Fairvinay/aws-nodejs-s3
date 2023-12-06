"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionAuthService = void 0;
const bcrypt = require("bcryptjs");
const user_1 = require("../../../models/user");
const logger_1 = require("./../../../utils/logger");
class SessionAuthService {
    constructor(otp, userRepository) {
        this.otp = otp;
        this.userRepository = userRepository;
    }
    authenticate() {
        return (req, res, next) => {
            if (req.session && req.session.user) {
                req.user = req.session.user;
                next();
            }
            else {
                res.statusCode = 401;
                res.json({ msg: 'You are not authorized to perform this operation' });
            }
        };
    }
    login(loginRequest) {
        const email = loginRequest.email;
        return this.userRepository.getUserByEmail(email).then(user => {
            return bcrypt.compare(loginRequest.password, user.password).then(match => {
                if (match && user.confirmed) {
                    return this.otp.checkOtpIfRequired(loginRequest, user).then(() => {
                        loginRequest.session.user = user;
                        logger_1.default.info('auth.session_login_successful', { user });
                        return Promise.resolve(user_1.User.toSafeUser(user));
                    });
                }
                else {
                    logger_1.default.info('auth.session_login_failed', { user });
                    return Promise.reject();
                }
            });
        });
    }
    logout(session) {
        if (session && session.destroy) {
            return new Promise((resolve, reject) => {
                session.destroy((error) => {
                    if (!error) {
                        logger_1.default.info('auth.session_logout_successful', { user: session.user });
                        resolve();
                    }
                    else {
                        logger_1.default.error('auth.session_destroy_failed', { error });
                        reject(error);
                    }
                });
            });
        }
        else {
            logger_1.default.warn('auth.logout_session_not_found');
            return Promise.resolve();
        }
    }
    getCurrentUser(session) {
        if (session && session.user) {
            const user = user_1.User.build(session.user);
            const safeUser = user_1.User.toSafeUser(user);
            return Promise.resolve(safeUser);
        }
        else {
            return Promise.resolve();
        }
    }
}
exports.SessionAuthService = SessionAuthService;
