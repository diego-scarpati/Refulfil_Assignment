/**
 * Scheduler utility that will run every X minutes to check for new orders.
 * It will fetch the orders from Shopify and save them to the database.
 */

import cron from "node-cron";
import { loopForScheduler } from "./orderCreator.js";

/**
 * Start the cron job to fetch orders periodically
 */
export const startOrderSyncScheduler = (): void => {
  const { CRON_SCHEDULE } = process.env;
  // CRON_SCHEDULE format:
  //                                        ┌──────────── minute
  //                                        │ ┌────────── hour
  //                                        │ │ ┌──────── day of month
  //                                        │ │ │ ┌────── month
  //                                        │ │ │ │ ┌──── day of week
  //                                        │ │ │ │ │
  //                                        │ │ │ │ │
  //                                        * * * * *
  const cronSchedule = CRON_SCHEDULE || "*/30 * * * *"; // Default to every 30 minutes

  console.log(`🕐 Starting order sync scheduler with pattern: ${cronSchedule}`);

  cron.schedule(
    cronSchedule,
    async () => {
      console.log("⏰ Running scheduled order sync...");

      try {
        // Fetch orders from the last hour
        const endDate = new Date();
        const startDate = new Date(
          endDate.getTime() - 60 * 60 * 1000
        ); // 1 hour ago

        await loopForScheduler(startDate, endDate);
        console.log("✅ Scheduled order sync completed successfully");
      } catch (error) {
        console.error("❌ Error in scheduled order sync:", error);
      }
    },
    {
      timezone: "Australia/Sydney", // Adjust timezone as needed
    }
  );
};

/**
 * Stop the cron job
 */
export const stopOrderSyncScheduler = (): void => {
  cron.getTasks().forEach((task) => {
    if (task.name === "orderSync") {
      task.stop();
      console.log("🛑 Stopped order sync scheduler");
    }
  });
}
