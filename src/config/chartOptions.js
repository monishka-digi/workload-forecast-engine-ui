import chartColors from "./chartColors";

export const commonOptions = {
  responsive: true,

  maintainAspectRatio: false,

  interaction: {
    mode: "index",

    intersect: false,
  },

  plugins: {
    legend: {
      position: "top",

      labels: {
        color: chartColors.text,

        usePointStyle: true,

        pointStyle: "circle",

        padding: 20,
      },
    },

    tooltip: {
      backgroundColor: "#1d232c",

      borderColor: "#2a3140",

      borderWidth: 1,

      titleColor: "#fff",

      bodyColor: "#fff",
    },
  },

  scales: {
    x: {
      ticks: {
        color: chartColors.muted,
      },

      grid: {
        color: chartColors.grid,
      },
    },

    y: {
      beginAtZero: true,

      ticks: {
        color: chartColors.muted,
      },

      grid: {
        color: chartColors.grid,
      },
    },
  },
};

export const doughnutOptions = {
  responsive: true,

  maintainAspectRatio: false,

  cutout: "72%",

  plugins: {
    legend: {
      position: "bottom",

      labels: {
        color: "#ffffff",

        usePointStyle: true,

        pointStyle: "circle",

        padding: 16,

        font: {
          size: 12,
        },
      },
    },

    tooltip: {
      backgroundColor: "#1d232c",

      borderColor: "#2a3140",

      borderWidth: 1,

      titleColor: "#fff",

      bodyColor: "#fff",
    },
  },
};

export const horizontalBarOptions = {
  indexAxis: "y",

  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      backgroundColor: "#1d232c",

      borderColor: "#2a3140",

      borderWidth: 1,

      titleColor: "#fff",

      bodyColor: "#fff",
    },
  },

  scales: {
    x: {
      beginAtZero: true,

      ticks: {
        color: "#8b93a3",
      },

      grid: {
        color: "#2a3140",
      },
    },

    y: {
      ticks: {
        color: "#ffffff",
      },

      grid: {
        display: false,
      },
    },
  },
};
