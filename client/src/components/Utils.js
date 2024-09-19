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
