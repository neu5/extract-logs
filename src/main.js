import Chart from "chart.js/auto";
import "./styles.css";

// Function to fetch log data from a JSON file
async function fetchLogData(fileName) {
  const response = await fetch(`/logData/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${fileName}`);
  }
  const data = await response.json();
  return data;
}

// Function to create a chart
function createChart(chartId, logData) {
  const labels = logData.map((entry) => entry.phase);
  const data = logData.map((entry) => entry.duration);

  // Calculate sum of durations
  const sum = data.reduce((acc, curr) => acc + curr, 0);

  // Create the pie chart
  const ctx = document.getElementById(chartId).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(199, 199, 199, 0.2)",
            "rgba(83, 102, 255, 0.2)",
            "rgba(34, 202, 236, 0.2)",
            "rgba(255, 159, 127, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
            "rgba(83, 102, 255, 1)",
            "rgba(34, 202, 236, 1)",
            "rgba(255, 159, 127, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(2)} minutes`;
            },
          },
        },
      },
    },
  });

  // Display sum of durations next to the chart
  const chartContainer = document
    .getElementById(chartId)
    .closest(".chart-container");
  const sumElement = document.createElement("div");
  sumElement.classList.add("chart-sum");
  sumElement.textContent = `Total: ${sum.toFixed(2)} minutes`;
  chartContainer.appendChild(sumElement);
}

// Function to initialize charts
async function initCharts() {
  const logFiles = [
    "logData1.json",
    "logData2.json",
    "logData3.json",
    "logData4.json",
    "logData5.json",
  ];

  const container = document.querySelector(".container");

  for (const fileName of logFiles) {
    const logData = await fetchLogData(fileName);

    // Create a new container for each chart
    const chartContainer = document.createElement("div");
    chartContainer.classList.add("chart-container");
    container.appendChild(chartContainer);

    // Create a new canvas element for each chart
    const canvas = document.createElement("canvas");
    canvas.classList.add("chart-canvas"); // Add a class for easier CSS targeting
    canvas.id = `chart-${fileName}`;
    chartContainer.appendChild(canvas);

    createChart(canvas.id, logData);
  }
}

// Call the function to initialize charts
initCharts();
