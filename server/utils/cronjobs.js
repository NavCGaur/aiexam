import cron from "node-cron";
import axios from "axios";

export const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      await axios.get("https://aiexam.onrender.com/api/health-check");
      console.log("Server pinged to prevent it from going idle");
    } catch (error) {
        console.error("Error pinging server:", error);   
     }
  });
}