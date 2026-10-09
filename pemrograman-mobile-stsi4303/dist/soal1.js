// SOAL 1 - POLA SEGITIGA
// NIM: 048068753
let nim = "048068753";
// Digit terakhir sebagai tinggi segitiga
let tinggi = Number(nim.slice(-1));
console.log("SOAL 1 - POLA SEGITIGA");
console.log("NIM:", nim);
console.log("Tinggi segitiga:", tinggi);
console.log("");
for (let i = 1; i <= tinggi; i++) {
    let baris = [];
    for (let j = 1; j <= i; j++) {
        baris.push(j);
    }
    console.log(baris.join(" "));
}
export {};
