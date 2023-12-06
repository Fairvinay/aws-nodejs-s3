"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const passport = require("passport");
const config_1 = require("../../config");
const passportOpts = {
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.jwtSecret
};
passport.use(new passport_jwt_1.Strategy(passportOpts, function (jwtPayload, done) {
    done(null, jwtPayload);
}));
exports.default = passport;
