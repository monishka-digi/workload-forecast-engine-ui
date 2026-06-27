export const kpiData = [
  {
    title: "Predicted Jobs",
    value: "4,812",
    subText: "▲ 6.4% vs prior 60d",
    positive: true,
  },
  {
    title: "Avg Confidence",
    value: "0.87",
    subText: "Stable",
    positive: true,
  },
  {
    title: "Branches Covered",
    value: "14",
    subText: "of 14 Active",
    positive: true,
  },
  {
    title: "Branches > P90",
    value: "3",
    subText: "BLR · HYD · PUN",
    alert: true,
    positive: false,
  },
  {
    title: "WAPE",
    value: "11.2%",
    subText: "▼ 0.8pp",
    positive: true,
  },
];

export const forecastData = {
  labels: [
    "Jun 1",
    "Jun 8",
    "Jun 15",
    "Jun 22",
    "Jun 29",
    "Jul 6",
    "Jul 13",
    "Jul 20",
  ],

  forecast: [520,548,560,575,592,610,628,641],

  actual: [515,540,560,null,null,null,null,null],
};

export const machineMix = [
  {
    label: "Excavator",
    value: 1820,
  },
  {
    label: "Dozer",
    value: 980,
  },
  {
    label: "Loader",
    value: 760,
  },
  {
    label: "Crane",
    value: 540,
  },
  {
    label: "Motor Grader",
    value: 410,
  },
  {
    label: "Others",
    value: 302,
  },
];

export const branchJobs = [
  {
    branch: "BLR",
    jobs: 890,
  },
  {
    branch: "CHN",
    jobs: 742,
  },
  {
    branch: "HYD",
    jobs: 705,
  },
  {
    branch: "PUN",
    jobs: 660,
  },
  {
    branch: "NGP",
    jobs: 512,
  },
];

export const capacityData = [
  {
    branch: "BLR",
    value: 95,
    color: "#ef5a5a",
  },
  {
    branch: "CHN",
    value: 84,
    color: "#f5b400",
  },
  {
    branch: "HYD",
    value: 91,
    color: "#ef5a5a",
  },
  {
    branch: "PUN",
    value: 74,
    color: "#34d6b8",
  },
  {
    branch: "NGP",
    value: 62,
    color: "#34d6b8",
  },
];

export const predictionRows = [
  {
    branch: "BR-BLR-01",
    geography: "South",
    machine: "Excavator",
    segment: "Fleet",
    period: "2026-08-25",
    prediction: 312,
    range: "280-344",
    confidence: 91,
  },
  {
    branch: "BR-CHN-02",
    geography: "South",
    machine: "Dozer",
    segment: "Government",
    period: "2026-08-25",
    prediction: 178,
    range: "155-201",
    confidence: 84,
  },
  {
    branch: "BR-HYD-03",
    geography: "South",
    machine: "Loader",
    segment: "Retail",
    period: "2026-08-25",
    prediction: 142,
    range: "120-164",
    confidence: 79,
  },
];