"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginThrottler = void 0;
const in_memory_login_failure_repository_1 = require("../repositories/in-memory/in-memory-login-failure.repository");
const config_1 = require("./../../../config");
let loginFailures = new in_memory_login_failure_repository_1.InMemoryLoginFailureRepository();
class LoginThrottler {
    constructor() {
        this.MAX_FAILURES = config_1.default.loginThrottle.maxFailures;
        this.TIME_WINDOW = config_1.default.loginThrottle.timeWindowInMinutes;
    }
    isLoginBlocked(userEmail) {
        return loginFailures.getLastFailures(userEmail, this.MAX_FAILURES).then(failures => {
            if (failures.length >= this.MAX_FAILURES) {
                const currentTime = new Date();
                const oldestFailure = failures.reduce((a, b) => a.datetime.getTime() < b.datetime.getTime() ? a : b);
                if (oldestFailure.datetime.getTime() >= currentTime.getTime() - this.TIME_WINDOW * 1000 * 60) {
                    return Promise.resolve(true);
                }
            }
            return Promise.resolve(false);
        });
    }
    registerLoginFailure(userEmail) {
        return loginFailures.registerFailedLogin(userEmail, new Date());
    }
}
exports.LoginThrottler = LoginThrottler;
