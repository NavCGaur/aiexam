import { getHealthStatus } from "../services/cronJobService.js";

export const healthCheck = (req, res) => {
    try {
        console.log("inside health check controller");
        const result = getHealthStatus();
        return res.status(200).json(result);
    } catch (error) {
        console.error("Health check error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
