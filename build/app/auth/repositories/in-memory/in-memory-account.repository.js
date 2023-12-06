"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryAccountRepository = void 0;
class InMemoryAccountRepository {
    createAccount(account) {
        account.id = (ACCOUNTS.length + 1).toString();
        ACCOUNTS.push(account);
        return Promise.resolve(account.id);
    }
}
exports.InMemoryAccountRepository = InMemoryAccountRepository;
const ACCOUNTS = [
    {
        id: '1'
    },
    {
        id: '2'
    }
];
