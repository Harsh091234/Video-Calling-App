"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const demo_controller_js_1 = require("./demo.controller.js");
const router = (0, express_1.Router)();
router.post("/send", demo_controller_js_1.sendName);
exports.default = router;
