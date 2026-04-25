import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  base: { service: "flex-launch" },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.apiKey",
      "*.secret",
      "*.stripeSecretKey",
    ],
    censor: "[REDACTED]",
  },
});

export type Logger = typeof logger;
