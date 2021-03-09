// Functions
const getLastDateOfMonth = (month, year) => {
    const date = new Date(year, month, 0);
    return moment(date).format('YYYY-MM-DD');
}

// https://stackoverflow.com/a/58422363
const getDaysDiff = (start_date, end_date, date_format = 'YYYY-MM-DD') => {
    const getDateAsArray = (date) => {
        return moment(date.split(/\D+/), date_format);
    }
    return getDateAsArray(end_date).diff(getDateAsArray(start_date), 'days') + 1;
}

// https://stackoverflow.com/a/59901201
const getDatesBetweenTwoDates = (startDate, endDate) => {
    let date = []
    while (moment(startDate) <= moment(endDate)) {
        date.push(startDate);
        startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
}

// Exports
export {
    getLastDateOfMonth,
    getDaysDiff as differenceBetweenTwoDates,
    getDatesBetweenTwoDates
};