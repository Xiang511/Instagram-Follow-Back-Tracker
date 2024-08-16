const fs = require('fs');

// 讀取 JSON 檔案
const data = fs.readFileSync('filtered_following.json', 'utf8');

// 解析 JSON 資料
const jsonData = JSON.parse(data);

// 提取 value 值並組成新陣列
const valuesArray = jsonData.map(item => item.value);

// 將新陣列寫入新的 JSON 檔案
fs.writeFileSync('values.json', JSON.stringify(valuesArray, null, 2));

console.log('提取完成，結果已寫入 values.json');