import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { initializeDatabase, closeConnection } from "./db/db.js";
import { startOrderSyncScheduler } from "./utils/scheduler.js";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Get port and environment from .env file or default to 3000 and development respectively
const { PORT, NODE_ENV } = process.env;
const port = PORT ? parseInt(PORT, 10) : 3000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? ["https://yourdomain.com"] // Replace with your production domains
        : true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV || "development",
  });
});

// API routes will be mounted here
// TODO: Add route handlers for GMV endpoints

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error occurred:", error);

  res.status(500).json({
    error: "Internal Server Error",
    message: NODE_ENV === "production" ? "Something went wrong" : error.message,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Start the Express server
 */
(async (): Promise<void> => {
  try {
    // Initialize database connection
    console.log("🔄 Initializing database connection...");
    await initializeDatabase();

    // Cron scheduler for periodic tasks
    startOrderSyncScheduler();

    // Start the server
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📊 Environment: ${NODE_ENV || "development"}`);
      console.log(`🌐 Health check: http://localhost:${port}/health`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("🔐 HTTP server closed");

        try {
          await closeConnection();
          console.log("✅ Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    // Handle process termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();