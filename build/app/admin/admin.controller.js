"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_middleware_1 = require("../auth/role.middleware");
const admin_service_1 = require("./admin.service");
const router = express_1.Router();
const adminService = new admin_service_1.AdminService();
router.use(role_middleware_1.hasRole('ADMIN'));
router.get('/sessions', function (req, res) {
    adminService.getActiveSessions().then(sessions => {
        res.json(sessions);
    });
});
router.delete('/sessions/:sessionId', function (req, res) {
    const sessionId = req.params.sessionId;
    adminService.destroySession(sessionId).then(() => res.sendStatus(204));
});
exports.default = router;
