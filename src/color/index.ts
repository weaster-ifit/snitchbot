const colors = [
  [  0, 140,  50],
  [ 95,  92, 255],
  [  4, 199, 163],
  [212,   9,   2],
  [232, 145,   5],
  [131,  33, 217],
  [179,   4, 123]
];

export function getNextColor() {
  const color = colors.shift();
  colors.push(color);

  return color;
}

export default {
  getNext: getNextColor
}