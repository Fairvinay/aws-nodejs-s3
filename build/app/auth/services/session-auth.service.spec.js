"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_auth_service_1 = require("./session-auth.service");
const otp_service_1 = require("./otp.service");
const authRequest_1 = require("./../../../models/authRequest");
const user_1 = require("./../../../models/user");
const fakeUser = {
    email: 'bartosz@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e',
    confirmed: true,
    tfa: true,
    tfaSecret: 'abc'
};
const request = {
    session: { user: fakeUser }
};
const responseMock = () => {
    return {
        statusCode: 0,
        json: jest.fn()
    };
};
const nextMock = jest.fn();
const otpStub = () => {
    return {
        checkOtpIfRequired: jest.fn(() => Promise.resolve())
    };
};
const userRepoStub = (user = fakeUser) => {
    return {
        getUserByEmail: jest.fn(() => Promise.resolve(user))
    };
};
describe('SessionAuthService', () => {
    describe('authenticate method', () => {
        it('returns a request handler', () => {
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            const result = sessionAuthService.authenticate();
            expect(typeof result).toBe('function');
        });
        it('returns a handler that continues execution when user in session', () => {
            const newResponseMock = responseMock();
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            const handler = sessionAuthService.authenticate();
            handler(request, newResponseMock, nextMock);
            expect(nextMock).toHaveBeenCalled();
        });
        it('returns a handler that finishes execution when no user in session', () => {
            const newResponseMock = responseMock();
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            const requestWithoutUser = { session: { user: null } };
            const handler = sessionAuthService.authenticate();
            handler(requestWithoutUser, newResponseMock, nextMock);
            expect(newResponseMock.statusCode).toBe(401);
            expect(newResponseMock.json).toHaveBeenCalled();
        });
    });
    describe('login method', () => {
        it('logs in and returns the logged user', (done) => {
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            const request = new authRequest_1.AuthRequest('bartosz@app.com', '123', '', {});
            sessionAuthService.login(request).then((user) => {
                expect(user).toBeTruthy();
                done();
            });
        });
        it('fails to login with a wrong password', (done) => {
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            const request = new authRequest_1.AuthRequest('bartosz@app.com', 'wrong', '', {});
            sessionAuthService.login(request).catch(() => {
                done();
            });
        });
        it('fails to login unconfirmed user with a valid password', (done) => {
            const unconfirmedUser = Object.assign(Object.assign({}, fakeUser), { confirmed: false });
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub(unconfirmedUser));
            const request = new authRequest_1.AuthRequest('bartosz@app.com', '123', '', {});
            sessionAuthService.login(request).catch(() => {
                done();
            });
        });
        it('fails to login with invalid otp - classic style', (done) => {
            const otp = new otp_service_1.OtpService();
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otp, userRepoStub());
            const request = new authRequest_1.AuthRequest('bartosz@app.com', '123', 'invalid', {});
            sessionAuthService.login(request).catch((error) => {
                expect(error.toString().toLowerCase()).toContain('invalid');
                done();
            });
        });
        it('fails to login with invalid otp - London style', (done) => {
            const otpMock = {
                checkOtpIfRequired: jest.fn(() => Promise.reject())
            };
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpMock, userRepoStub());
            const request = {
                email: 'bartosz@app.com',
                password: '123'
            };
            sessionAuthService.login(request).catch(() => {
                expect(otpMock.checkOtpIfRequired).toHaveBeenCalledWith(request, fakeUser);
                done();
            });
        });
        it('fails to login without any otp', (done) => {
            const otp = new otp_service_1.OtpService();
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otp, userRepoStub());
            const request = new authRequest_1.AuthRequest('bartosz@app.com', '123', '', {});
            sessionAuthService.login(request).catch((error) => {
                expect(error).toBe('OTP_REQUIRED');
                done();
            });
        });
    });
    describe('logout method', () => {
        it('logs out successfully', () => {
            const session = {
                user: fakeUser,
                destroy: jest.fn((cb) => cb())
            };
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            sessionAuthService.logout(session);
            expect(session.destroy).toHaveBeenCalled();
        });
        it('does nothing when session not found', (done) => {
            const session = {};
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            sessionAuthService.logout(session).then(() => {
                done();
            });
        });
        it('rejects a promise if error occured', (done) => {
            const session = {
                user: fakeUser,
                destroy: jest.fn((cb) => cb({ error: 'error' }))
            };
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            sessionAuthService.logout(session).catch(() => {
                done();
            });
        });
    });
    describe('getCurrentUser method', () => {
        it('returns the user', () => {
            const session = {
                user: fakeUser,
            };
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            sessionAuthService.getCurrentUser(session).then((user) => {
                expect(user).toEqual(user_1.User.toSafeUser(fakeUser));
            });
        });
        it('returns nothing if no user found', (done) => {
            const session = {};
            const sessionAuthService = new session_auth_service_1.SessionAuthService(otpStub(), userRepoStub());
            sessionAuthService.getCurrentUser(session).then((user) => {
                done();
            });
        });
    });
});
