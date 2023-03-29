// 1. reverse NEGIE1
const str = "NEGIE1";
console.log(str.slice(0, 5).split("").reverse().join("") + str.slice(5));
// -- end

// 2. search length
const sentence = "Saya sangat senang mengerjakan soal algoritma".split(" ");
let longestString = "";

for (const str of sentence) {
  if (str.length > longestString.length) {
    longestString = str;
  }
}

console.log(longestString);
// -- end

// 3. find string
const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

const counts = [];
for (const q of QUERY) {
  let count = 0;
  for (const s of INPUT) {
    if (s === q) {
      count++;
    }
  }
  counts.push(count);
}

console.log(counts);
// -- end

// 4. matrix NxN
const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];
let diagonal1 = 0;
let diagonal2 = 0;

for (let i = 0; i < matrix.length; i++) {
  diagonal1 += matrix[i][i];
  diagonal2 += matrix[i][matrix.length - i - 1];
}

const diff = Math.abs(diagonal1 - diagonal2);
console.log(diff);
// -- end
