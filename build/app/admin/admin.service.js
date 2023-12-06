"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const config_1 = require("./../../config");
class AdminService {
    constructor() {
        this.store = config_1.default.sessionConfig.store;
    }
    getActiveSessions() {
        return new Promise((resolve, reject) => {
            this.store.all ? ((err, sessions) => {
                if (err) {
                    return reject(err);
                }
                if (sessions) {
                    const result = Object.entries(sessions).map(([sessionId, session]) => {
                        var _a, _b;
                        return {
                            sessionId,
                            user: {
                                email: (_a = session.user) === null || _a === void 0 ? void 0 : _a.email,
                                role: (_b = session.user) === null || _b === void 0 ? void 0 : _b.role
                            }
                        };
                    });
                    resolve(result);
                }
            }) : [];
        });
    }
    destroySession(sessionId) {
        return new Promise((resolve, reject) => {
            this.store.destroy(sessionId, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }
}
exports.AdminService = AdminService;
