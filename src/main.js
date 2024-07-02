import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./styles.css";

Chart.register(ChartDataLabels);

const BG_COLORS = [
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
];

async function fetchLogData(fileName) {
  const response = await fetch(`/logData/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${fileName}`);
  }
  const data = await response.json();
  return data;
}

function createChart(chartId, logData, chartTitle) {
  const phases = logData.phases;
  const labels = phases.map((entry) => entry.phase);
  const data = phases.map((entry) => entry.duration);
  const sum = data.reduce((acc, curr) => acc + curr, 0);

  const ctx = document.getElementById(chartId).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: BG_COLORS,
          borderColor: BG_COLORS.map((color) => color.replace("0.2", "1")),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(2)} minutes`;
            },
          },
        },
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: (value) => {
            const percentage = ((value / sum) * 100).toFixed(2);
            return `${percentage}%`;
          },
          font: {
            size: 10,
            weight: "bold",
          },
          color: "black",
          backgroundColor: (context) =>
            context.dataset.backgroundColor[context.dataIndex],
          borderRadius: 4,
          borderWidth: 1,
          padding: 6,
        },
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 40,
          right: 40,
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  const chartContainer = document
    .getElementById(chartId)
    .closest(".chart-container");

  const titleElement = document.createElement("div");
  titleElement.classList.add("chart-title");
  titleElement.textContent = chartTitle;
  chartContainer.insertBefore(titleElement, chartContainer.firstChild);

  const labelsElement = document.createElement("ul");
  const fragment = new DocumentFragment();
  for (let i = 0; i < logData.phases.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${logData.phases[i].phase} (${logData.phases[
      i
    ].duration.toFixed(2)})`;
    li.style.backgroundColor = BG_COLORS[i];
    fragment.append(li);
  }

  labelsElement.append(fragment);
  labelsElement.classList.add("chart-labels");
  chartContainer.append(labelsElement);

  const sumElement = document.createElement("div");
  sumElement.classList.add("chart-sum");
  sumElement.textContent = `Total: ${sum.toFixed(2)} minutes`;
  chartContainer.appendChild(sumElement);

  const totalBuildDurationElement = document.createElement("div");
  totalBuildDurationElement.classList.add("chart-sum");
  totalBuildDurationElement.textContent = `Build duration: ${logData.totalBuildDuration.toFixed(
    2
  )} minutes`;
  chartContainer.appendChild(totalBuildDurationElement);
}

async function initCharts() {
  const logFiles = [
    "logData2.json",
    "logData3.json",
    "logData4.json",
    "logData5.json",
    "mkmk.json",
  ];

  const container = document.querySelector(".container");

  for (const fileName of logFiles) {
    const logData = await fetchLogData(fileName);

    const chartContainer = document.createElement("div");
    chartContainer.classList.add("chart-container");
    container.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    canvas.classList.add("chart-canvas");
    canvas.id = `chart-${fileName}`;
    chartContainer.appendChild(canvas);

    createChart(canvas.id, logData, fileName);
  }
}

initCharts();
