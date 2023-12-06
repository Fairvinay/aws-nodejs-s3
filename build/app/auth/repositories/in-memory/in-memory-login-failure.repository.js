"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryLoginFailureRepository = void 0;
const login_failure_1 = require("./../../../../models/login.failure");
class InMemoryLoginFailureRepository {
    getLastFailures(userEmail, number) {
        const ascendingByTime = (f1, f2) => f1.datetime.getTime() - f2.datetime.getTime();
        const lastFailures = LOGIN_FAILURES.sort(ascendingByTime).slice(-number);
        return Promise.resolve(lastFailures);
    }
    registerFailedLogin(userEmail, datetime) {
        LOGIN_FAILURES.push(new login_failure_1.LoginFailure(userEmail, datetime));
        return Promise.resolve();
    }
}
exports.InMemoryLoginFailureRepository = InMemoryLoginFailureRepository;
const LOGIN_FAILURES = [];
