"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// CSVファイルパス
var filePath = 'PSMrawdata.csv';
var totalnum = 36;
// CSV処理関数
function parseCSV(csvData) {
    var lines1 = csvData.trim().split('\n');
    var lines2 = lines1.slice(1);
    return lines2.map(function (line2) { return line2.replace('\r', '').split(','); });
}
// ファイル読み込み関数
function readCSVFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var parsedData = parseCSV(data);
                resolve(parsedData);
            }
        });
    });
}
// 型変換
function convertNumber(matrix) {
    var result = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = [];
        for (var j = 0; j < matrix[i].length; j++) {
            var num = parseFloat(matrix[i][j]);
            row.push(isNaN(num) ? 0 : num);
        }
        result.push(row);
    }
    return result;
}
// ファイル処理関数
function FileProcess(fileInfo) {
    var counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0;
    var percentage = Array.from({ length: 14 }, function () { return Array.from({ length: 5 }, function () { return 0; }); });
    for (var i = 0; i <= 13; i++) {
        for (var j = 0; j < totalnum; j++) {
            if (fileInfo[j][1] <= i * 50)
                counter1 += 1;
            if (fileInfo[j][2] >= i * 50)
                counter2 += 1;
            if (fileInfo[j][3] <= i * 50)
                counter3 += 1;
            if (fileInfo[j][4] >= i * 50)
                counter4 += 1;
        }
        percentage[i][0] = i * 50;
        percentage[i][1] = counter1 / totalnum;
        percentage[i][2] = counter2 / totalnum;
        percentage[i][3] = counter3 / totalnum;
        percentage[i][4] = counter4 / totalnum;
        counter1 = 0;
        counter2 = 0;
        counter3 = 0;
        counter4 = 0;
    }
    return percentage;
}
//座標算出関数
function PointFunction(filePercentage) {
    var point = Array.from({ length: 16 }, function () { return Array.from({ length: 2 }, function () { return 0; }); });
    for (var i = 0; i <= 12; i++) {
        //妥協価格
        if (filePercentage[i][1] <= filePercentage[i][2]) {
            point[0][0] = i * 50;
            point[0][1] = filePercentage[i][1];
            point[1][0] = i * 50 + 50;
            point[1][1] = filePercentage[i + 1][1];
            point[2][0] = i * 50;
            point[2][1] = filePercentage[i][2];
            point[3][0] = i * 50 + 50;
            point[3][1] = filePercentage[i + 1][2];
        }
        //最低品質保証価格
        if (filePercentage[i][1] <= filePercentage[i][4]) {
            point[4][0] = i * 50;
            point[4][1] = filePercentage[i][1];
            point[5][0] = i * 50 + 50;
            point[5][1] = filePercentage[i + 1][1];
            point[6][0] = i * 50;
            point[6][1] = filePercentage[i][4];
            point[7][0] = i * 50 + 50;
            point[7][1] = filePercentage[i + 1][4];
        }
        //最高価格
        if (filePercentage[i][3] <= filePercentage[i][2]) {
            point[8][0] = i * 50;
            point[8][1] = filePercentage[i][3];
            point[9][0] = i * 50 + 50;
            point[9][1] = filePercentage[i + 1][3];
            point[10][0] = i * 50;
            point[10][1] = filePercentage[i][2];
            point[11][0] = i * 50 + 50;
            point[11][1] = filePercentage[i + 1][2];
        }
        //理想価格
        if (filePercentage[i][3] <= filePercentage[i][4]) {
            point[12][0] = i * 50;
            point[12][1] = filePercentage[i][3];
            point[13][0] = i * 50 + 50;
            point[13][1] = filePercentage[i + 1][3];
            point[14][0] = i * 50;
            point[14][1] = filePercentage[i][4];
            point[15][0] = i * 50 + 50;
            point[15][1] = filePercentage[i + 1][4];
        }
    }
    console.log(point);
    return point;
}
// 2点を通る直線の方程式
function LineEquation(x1, y1, x2, y2) {
    var a = (y2 - y1) / (x2 - x1);
    var b = y1 - a * x1;
    return { a: a, b: b };
}
// 2つの直線の交点を求める
function Intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    var line1 = LineEquation(x1, y1, x2, y2);
    var line2 = LineEquation(x3, y3, x4, y4);
    var x = (line2.b - line1.b) / (line1.a - line2.a);
    var y = line1.a * x + line1.b;
    return { x: x, y: y };
}
readCSVFile(filePath)
    .then(function (data) {
    console.log('CSVデータ読み込み成功');
    var cleandata = convertNumber(data);
    var PSMdata = FileProcess(cleandata);
    var Pointdata = PointFunction(PSMdata);
    var CompromisePrice = Intersection(Pointdata[0][0], Pointdata[0][1], Pointdata[1][0], Pointdata[1][1], Pointdata[2][0], Pointdata[2][1], Pointdata[3][0], Pointdata[3][1]);
    var LowestQualityGuaranteedPrice = Intersection(Pointdata[4][0], Pointdata[4][1], Pointdata[5][0], Pointdata[5][1], Pointdata[6][0], Pointdata[6][1], Pointdata[7][0], Pointdata[7][1]);
    var HighestPrice = Intersection(Pointdata[8][0], Pointdata[8][1], Pointdata[9][0], Pointdata[9][1], Pointdata[10][0], Pointdata[10][1], Pointdata[11][0], Pointdata[11][1]);
    var IdealPrice = Intersection(Pointdata[12][0], Pointdata[12][1], Pointdata[13][0], Pointdata[13][1], Pointdata[14][0], Pointdata[14][1], Pointdata[15][0], Pointdata[15][1]);
    console.log('最高価格：', HighestPrice.x, '円');
    console.log('妥協価格：', CompromisePrice.x, '円');
    console.log('理想価格：', IdealPrice.x, '円');
    console.log('最低品質保証価格：', LowestQualityGuaranteedPrice.x, '円');
})
    .catch(function (err) {
    console.error('Error', err);
});
