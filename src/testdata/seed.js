export const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wedne"]

export const daysInAWeek = {
  sunday: {
    dayNumber: 0,
    name: "Sunday"
  },
  monday: {
    dayNumber: 1,
    name: "Monday"
  },
  tuesday: {
    dayNumber: 2,
    name: "Tuesday"
  }
};

export const periods = {
  morning: "Morning 1",
  brunch: "Morning 2",
  afternoon: "lunch",
  lateAfternoon: "lunch second"
};

const TestItemsList = [
  {
    uniqueIdentifier: 11,
    period: periods.morning,
    day: 0,
    shortName: "morning option",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 12,
    period: periods.lateAfternoon,
    day: 1,
    shortName: "morning option",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 25,
    period: periods.morning,
    day: 1,
    shortName: "morning option",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 14,
    period: periods.morning,
    day: 3,
    shortName: "Shake and banana",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 16,
    period: periods.morning,
    day: 3,
    shortName: "4 eggs and an apple",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 19,
    period: periods.morning,
    day: 6,
    shortName: "morning option",
    description: "First thing in the morning"
  },
  {
    uniqueIdentifier: 21,
    period: periods.morning,
    day: 6,
    shortName: "morning option",
    description: "First thing in the morning"
  }
];

export default TestItemsList;
