export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
export const getTodayString = () => new Date().toISOString().slice(0, 10);
export const getMonthYear = (date) => date.toLocaleString('default', { month: 'short', year: 'numeric' });
