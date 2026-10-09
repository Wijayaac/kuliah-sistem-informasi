// SOAL 3 - BILANGAN PRIMA
// NIM: 048068753
let nim = "048068753";
// 2 digit terakhir + 10 sebagai batas akhir
let batas = Number(nim.slice(-2)) + 10;
console.log("SOAL 3 - BILANGAN PRIMA");
console.log("NIM:", nim);
console.log("Batas akhir:", batas);
console.log("");
let prima = [];
for (let n = 2; n <= batas; n++) {
    let isPrima = true;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            isPrima = false;
            break;
        }
    }
    if (isPrima) {
        prima.push(n);
    }
}
console.log("Bilangan prima dari 1 sampai " + batas + ":");
console.log(prima.join(", "));
export {};
