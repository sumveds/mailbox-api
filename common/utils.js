const moment = require('moment');
// const uuidGenerator = require('uuid');

/*const uuid = () => {
    return uuidGenerator.v4();
};*/

const randomNumber = (start, end) => {
    return Math.floor(Math.random() * (end - start)) + start;
};

const randomDecimal = (start, end) => {
    return (Math.random() * (end - start) + start).toFixed(2);
};

const generateRandomFixedInteger = (length) => {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
};

const getDateTimeString = (timestamp, format) => {
    const dateTimeStr = moment.unix(timestamp / 1000).format(format);
    return dateTimeStr;
};

const toFixed = (number, to) => {
    return parseFloat(number.toFixed(to));
};

module.exports = {
    randomNumber,
    randomDecimal,
    generateRandomFixedInteger,
    getDateTimeString,
    uuid,
    toFixed
};
