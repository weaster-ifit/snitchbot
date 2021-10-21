function convertToString(nonString) {
  try {
    return JSON.stringify(nonString, null, 2);
  } catch (e) {
    return 'Error logging entry: ' + e.message;
  }
}

export default convertToString;