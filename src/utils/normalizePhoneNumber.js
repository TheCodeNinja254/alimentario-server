const formatPhoneNumber = (phoneNumber) => {
  const normalizedNumber = phoneNumber.toString().replace(/^0/, '');
  if (normalizedNumber.length === 9) {
    return `254${normalizedNumber}`;
  } else {
    throw new Error('Invalid phone number format');
  }
};

module.exports = formatPhoneNumber;
