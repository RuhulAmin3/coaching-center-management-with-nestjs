import { MONTH } from '@prisma/client';

export function getTotalDaysInMonth(month) {
  const months = {
    January: 31,
    February: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  const capitalizedMonth =
    month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

  if (months.hasOwnProperty(capitalizedMonth)) {
    return months[capitalizedMonth];
  } else {
    return null; // Invalid month name
  }
}

export function getMonthsUpToIndex(index: number) {
  const months = Object.keys(MONTH);
  // Return the array of months up to the provided index
  return months.slice(0, index + 1);
}
