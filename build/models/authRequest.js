"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequest = void 0;
class AuthRequest {
    constructor(email, password, otp, session) {
        this.email = email;
        this.password = password;
        this.otp = otp;
        this.session = session;
    }
    static buildFromRequest(req) {
        return new AuthRequest(req.body.email, req.body.password, req.body.otp, req.session);
    }
}
exports.AuthRequest = AuthRequest;
