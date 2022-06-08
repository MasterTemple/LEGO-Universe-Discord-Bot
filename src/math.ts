function gcd(a, b) {
  return (b) ? gcd(b, a % b) : a;
}

export function decimalToFraction(_decimal) {
  _decimal = Math.floor(_decimal * 100000) / 100000
  if (_decimal == 1) {
    return `${top / x}/${bottom / x}`
  } else {
    var top = _decimal.toString().replace(/\d+[.]/, '');
    var bottom = Math.pow(10, top.length);
    if (_decimal > 1) {
      top = +top + Math.floor(_decimal) * bottom;
    }
    var x = gcd(top, bottom);
    return `${top / x}/${bottom / x}`
  }
};