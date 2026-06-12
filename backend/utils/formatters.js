/**
 * Formats a given string into Title Case.
 * Example: "  aPple  juIce " -> "Apple Juice"
 * @param {String} str The string to format
 * @returns {String} The formatted string
 */
function toTitleCase(str) {
    if (typeof str !== 'string') return str;
    
    // Trim extra spaces and split by one or more spaces
    return str
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

module.exports = {
    toTitleCase
};
