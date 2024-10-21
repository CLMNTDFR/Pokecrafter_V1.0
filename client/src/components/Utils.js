// Parses a date from a timestamp or date string and formats it to a locale-specific format
export const dateParser = (num, locale = "en-GB") => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Parse the input to get a timestamp, then create a date object
  const timestamp = Date.parse(num);
  const date = new Date(timestamp).toLocaleDateString(locale, options);

  return date.toString();
};

// Parses a timestamp and formats it to a locale-specific date string
export const timestampParser = (num, locale = "en-GB") => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Create a date object from the timestamp and format it
  const date = new Date(num).toLocaleDateString(locale, options);

  return date.toString();
};

// Checks if a value is empty (undefined, null, or empty object/string)
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
