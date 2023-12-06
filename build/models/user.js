"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor() {
        this.confirmed = false;
        this.tfa = false;
        this.createdWith = 'password';
    }
    static toSafeUser(user) {
        const { id, accountId, email, role, confirmed, tfa } = user;
        return { id, accountId, email, role, confirmed, tfa };
    }
    static build(data) {
        const user = new User();
        return Object.assign(user, data);
    }
}
exports.User = User;
