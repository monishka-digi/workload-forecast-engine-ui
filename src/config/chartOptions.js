export const getChartColors = (theme) => {
  if (theme === "light") {
    return {
      text: "#1D2428",
      muted: "#757A7C",
      grid: "#EDF2F2",
      border: "#E3E8E9",
      tooltipBg: "#FFFFFF",
      tooltipBorder: "#E3E8E9",
      tooltipText: "#1D2428",
    };
  } else {
    return {
      text: "#ffffff",
      muted: "#8b93a3",
      grid: "#2a3140",
      border: "#2a3140",
      tooltipBg: "#1d232c",
      tooltipBorder: "#2a3140",
      tooltipText: "#ffffff",
    };
  }
};

export const getCommonOptions = (theme) => {
  const colors = getChartColors(theme);
  return {
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
          color: colors.text,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.muted,
        },
        grid: {
          color: colors.grid,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: colors.muted,
        },
        grid: {
          color: colors.grid,
        },
      },
    },
  };
};

export const getDoughnutOptions = (theme) => {
  const colors = getChartColors(theme);
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: colors.text,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
      },
    },
  };
};

export const getHorizontalBarOptions = (theme) => {
  const colors = getChartColors(theme);
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: colors.muted,
        },
        grid: {
          color: colors.grid,
        },
      },
      y: {
        ticks: {
          color: colors.text,
        },
        grid: {
          display: false,
        },
      },
    },
  };
};
