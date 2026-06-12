/**
 * Converts a numerical amount (integer or float) into words using the Indian numbering system (Lakh/Crore).
 * Handles decimals as Paise.
 * 
 * @param {number|string} amount - The amount to convert
 * @returns {string} The amount in words
 */
export function amountToWords(amount) {
    if (amount === null || amount === undefined) {
        return "";
    }

    // Clean formatting commas and spaces
    let cleanAmountStr = String(amount).replace(/,/g, "").trim();
    let num = parseFloat(cleanAmountStr);

    if (isNaN(num)) {
        return "";
    }

    if (num < 0) {
        return "Minus " + amountToWords(Math.abs(num));
    }

    if (num === 0) {
        return "Zero Rupees";
    }

    // Split rupees and paise
    let rupees = Math.floor(num);
    // Round to 2 decimal places to prevent float precision issues
    let paise = Math.round((num - rupees) * 100);

    // If paise rounds up to 100, add to rupees
    if (paise === 100) {
        rupees += 1;
        paise = 0;
    }

    let rupeeWords = convertIntegerToWords(rupees);
    let paiseWords = paise > 0 ? convertIntegerToWords(paise) : "";

    let result = "";
    if (rupees > 0) {
        result += rupeeWords + " Rupee" + (rupees === 1 ? "" : "s");
    }

    if (paise > 0) {
        if (rupees > 0) {
            result += " and ";
        }
        result += paiseWords + " Paise";
    }

    return result;
}

function convertIntegerToWords(n) {
    const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const doubleDigits = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tensMultiple = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (n === 0) return "";

    let words = "";

    // Crores (1,00,00,000)
    let crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore > 0) {
        words += convertIntegerToWords(crore) + " Crore ";
    }

    // Lakhs (1,00,000)
    let lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh > 0) {
        words += convertIntegerToWords(lakh) + " Lakh ";
    }

    // Thousands (1,000)
    let thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand > 0) {
        words += convertIntegerToWords(thousand) + " Thousand ";
    }

    // Hundreds (100)
    let hundred = Math.floor(n / 100);
    n %= 100;
    if (hundred > 0) {
        words += convertIntegerToWords(hundred) + " Hundred ";
    }

    // Tens and Units
    if (n > 0) {
        if (n < 10) {
            words += singleDigits[n];
        } else if (n < 20) {
            words += doubleDigits[n - 10];
        } else {
            let ten = Math.floor(n / 10);
            let unit = n % 10;
            words += tensMultiple[ten] + (unit > 0 ? " " + singleDigits[unit] : "");
        }
    }

    return words.trim();
}
