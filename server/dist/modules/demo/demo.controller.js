"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendName = void 0;
const sendName = async (req, res) => {
    try {
        const name = req.body.name;
        res.json({ message: `Welcome ${name}, to MERN-TS-VITE integrated with Shadcn, RTK QUERY` });
    }
    catch (error) {
        console.log("Error in sendName:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.sendName = sendName;
