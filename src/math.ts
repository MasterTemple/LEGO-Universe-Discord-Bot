import { decimalPlaces } from "./config";

function gcd(a, b) {
  return (b) ? gcd(b, a % b) : a;
}

export function decimalToFraction(_decimal): string {
  _decimal = Math.floor(_decimal * 100000) / 100000;
  if (_decimal == 1) {
    return '1';
  } else {
    var top = _decimal.toString().replace(/\d+[.]/, '');
    var bottom = Math.pow(10, top.length);
    if (_decimal > 1) {
      top = +top + Math.floor(_decimal) * bottom;
    }
    var x = gcd(top, bottom);
    return `${top / x}/${bottom / x}`;
  }
};

export function percent(num: number) {
  return `${(round(num, 5) * 100).toFixed(decimalPlaces)}%`;
}

export function round(decimal: number, places: number = 2) {
  return Math.round(decimal * Math.pow(10, places)) / Math.pow(10, places);
}

export function formatNum(decimal: number) {
  return decimal.toString().replace(/(.)(?=(\d{3})+$)/g, '$1,');
}