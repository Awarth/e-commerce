function convertCurrencyIntoINS(value) {
  let string = String(value);
  let newStr = [];
  let i = 0;

  string = string.split("").reverse();

  for (i; i < string.length; i++) {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) {
      newStr.push(",");
    }
    newStr.push(string[i]);
  }

  return newStr.reverse().join("");
}

export { convertCurrencyIntoINS };
