import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToMilitaryDate(date: Date) {
  // Ensure the input is a Date object
  if (!(date instanceof Date)) {
    throw new Error("Input must be a Date object");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${day}${month}${year}`;
}

export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  // Ensure startDate is before endDate
  if (startDate > endDate) {
    throw new Error("startDate must be before endDate");
  }

  // Calculate the difference in milliseconds
  const diffInMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays + 1;
}
