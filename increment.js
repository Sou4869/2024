function removeFirstRow(matrix) {
    return matrix.slice(1);
}
// 例として使用する二次元配列
var exampleMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
// 最初の行を削除
var modifiedMatrix = removeFirstRow(exampleMatrix);
// 結果を出力
console.log("最初の行を削除した後の配列:");
console.log(modifiedMatrix);
