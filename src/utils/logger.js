const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
require("dotenv").config();
const moment = require("moment/moment");

const VALID_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateLMID() {
  let lmid = "";
  for (let i = 0; i < 6; i++) {
    lmid += VALID_CHAR[Math.floor(Math.random() * VALID_CHAR.length)];
  }
  if (lmid === "AAAAAA") {
    return generateLMID();
  }
  return lmid;
}

const logDirectory = path.join(__dirname, process.env.LOG_PATH);
const logFormat = printf(({ level, message, label, timestamp }) => {
  const formatDate = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  return `${formatDate} [${label}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: "App" }),
    timestamp(),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: `${logDirectory}/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

module.exports = { logger, generateLMID };
