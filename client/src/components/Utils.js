export const dateParser = (num, locale = "en-GB") => {
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let timestamp = Date.parse(num);
  let date = new Date(timestamp).toLocaleDateString(locale, options);

  return date.toString();
};

export const timestampParser = (num, locale = "en-GB") => {
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let date = new Date(num).toLocaleDateString(locale, options);

  return date.toString();
};

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
