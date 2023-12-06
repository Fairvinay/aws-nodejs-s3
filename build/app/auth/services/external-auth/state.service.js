"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randtoken = require('rand-token');
const logger_1 = require("../../../../utils/logger");
const LENGTH = 32;
exports.default = {
    setAndGetNewState(session) {
        session.oauthState = randtoken.generate(LENGTH);
        return session.oauthState;
    },
    getAndRemoveState(session) {
        const state = session.oauthState;
        session.oauthState = null;
        return state;
    },
    assertStateIsValid(session, state) {
        return new Promise((resolve, reject) => {
            if (!!state && state.length === LENGTH && state === session.oauthState) {
                logger_1.default.info('auth.external.state.valid_check', { state });
                resolve();
            }
            else {
                logger_1.default.error('auth.external.state.failed_check', { state: state, expectedState: session.oauthState });
                reject('Invalid state paramater');
            }
        });
    }
};
