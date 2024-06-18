import fs from "fs";
import path from "path";

// Define the directory where the log files are located
const logDir = path.join("public", "logData");

// Function to process a single log file and extract necessary data
function processLogFile(logFile) {
  const logContent = fs.readFileSync(path.join(logDir, logFile), "utf-8");
  const logLines = logContent.split("\n");

  const logData = [];
  let startTime = null;
  let phaseName = "";

  logLines.forEach((line) => {
    const logStartMatch = line.match(/\[(.*?)\] LOG_START: (.*)/);
    const logEndMatch = line.match(/\[(.*?)\] LOG_END: (.*)/);

    if (logStartMatch) {
      startTime = new Date(logStartMatch[1]);
      phaseName = logStartMatch[2];
    } else if (logEndMatch && phaseName) {
      const endTime = new Date(logEndMatch[1]);
      const duration = (endTime - startTime) / (1000 * 60); // Duration in minutes

      logData.push({
        phase: phaseName,
        duration: duration,
      });

      // Reset for the next phase
      startTime = null;
      phaseName = "";
    }
  });

  return logData;
}

// Process each log file and save the results as JSON files
const logFiles = fs.readdirSync(logDir).filter((file) => file.endsWith(".txt"));

logFiles.forEach((logFile) => {
  const logData = processLogFile(logFile);
  const jsonFileName = logFile.replace(".txt", ".json");
  fs.writeFileSync(
    path.join(logDir, jsonFileName),
    JSON.stringify(logData, null, 2)
  );
});

console.log("Log data processed successfully.");
