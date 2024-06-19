import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";

async function processLogFile(logFilePath, outputFilePath) {
  const logData = await readFile(logFilePath, "utf-8");
  const logLines = logData.split("\n");
  const phaseDurations = [];

  logLines.forEach((line) => {
    const logStartMatch = line.match(/^\[(.*?)\]\s+LOG_START:\s+(.*)$/);
    const logEndMatch = line.match(/^\[(.*?)\]\s+LOG_END:\s+(.*)$/);

    if (logStartMatch) {
      const startTime = new Date(logStartMatch[1]);
      const phase = logStartMatch[2];
      phaseDurations.push({ phase, startTime });
    }

    if (logEndMatch) {
      const endTime = new Date(logEndMatch[1]);
      const phase = logEndMatch[2];
      const phaseDuration = phaseDurations.find(
        (p) => p.phase === phase && !p.endTime
      );
      if (phaseDuration) {
        phaseDuration.endTime = endTime;
        phaseDuration.duration =
          (endTime - phaseDuration.startTime) / (1000 * 60); // Convert to minutes
      }
    }
  });

  const completedPhases = phaseDurations
    .filter((p) => p.endTime)
    .map((p) => ({
      phase: p.phase,
      duration: p.duration,
    }));

  await writeFile(outputFilePath, JSON.stringify(completedPhases, null, 2));
}

async function processAllLogs() {
  const logDir = path.resolve("logs"); // Directory containing log files
  const outputDir = path.resolve("public", "logData"); // Directory to output JSON files

  // Ensure output directory exists
  await writeFile(outputDir, "", { flag: "a" }).catch(() => {});

  const files = await readdir(logDir);
  const logFiles = files.filter((file) => file.endsWith(".txt"));

  await Promise.all(
    logFiles.map((file) => {
      const logFilePath = path.join(logDir, file);
      const outputFilePath = path.join(
        outputDir,
        `${path.parse(file).name}.json`
      );
      return processLogFile(logFilePath, outputFilePath);
    })
  );

  console.log("All log data processed successfully");
}

processAllLogs().catch((err) =>
  console.error("Error processing log data:", err)
);
