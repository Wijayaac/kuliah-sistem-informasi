// SOAL 2 - DERET ARITMATIKA
// NIM: 048068753
let nim = "048068753";
// 2 digit terakhir sebagai angka awal
let start = Number(nim.slice(-2));
// Digit ke-3 dari belakang
let digitKetiga = Number(nim[nim.length - 3]);
// Step = digit ke-3 dari belakang + 1
let step = digitKetiga + 1;
console.log("SOAL 2 - DERET ARITMATIKA");
console.log("NIM:", nim);
console.log("Start:", start);
console.log("Digit ke-3 dari belakang:", digitKetiga);
console.log("Step:", step);
console.log("");
let deret = [];
for (let i = 0; i < 10; i++) {
    deret.push(start + i * step);
}
console.log("10 angka pertama:");
console.log(deret.join(", "));
export {};
