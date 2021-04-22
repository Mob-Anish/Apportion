// Email body to receiver
const emailBody = ({emailFrom, downloadLink, size}) => {
    return `${emailFrom} ${downloadLink} ${size}`;
};

module.exports = emailBody;