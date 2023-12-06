"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otp_service_1 = require("./otp.service");
const jwt_auth_service_1 = require("./jwt-auth.service");
const session_auth_service_1 = require("./session-auth.service");
const in_memory_user_repository_1 = require("../repositories/in-memory/in-memory-user.repository");
const config_1 = require("./../../../config");
const userRepository = new in_memory_user_repository_1.InMemoryUserRepository();
const otp = new otp_service_1.OtpService();
function getAuthService() {
    switch (config_1.default.auth) {
        case 'session':
            return new session_auth_service_1.SessionAuthService(otp, userRepository);
        case 'jwt':
            return new jwt_auth_service_1.JwtAuthService();
        default:
            throw 'AuthService not defined';
    }
}
exports.default = getAuthService();
