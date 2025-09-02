var followersData = [];
var followingData = [];
var followerValues = [];
var OldfollowerValues = [];
var followingValues = [];
// 新增忽略名單與標籤儲存結構
let ignoreList = []; // array of username strings
let tagMap = {};     // { username: "tag" }

let fileInput = document.getElementById('fileInput');
let fileInput2 = document.getElementById('fileInput2');
var result = document.getElementById('result');
let YMDCheck = document.getElementById('YMDCheck');
let CheckLastFile = document.getElementById('CheckLastFile');
let CheckOldName = document.getElementById('CheckOldName');
let switchbtn = document.getElementById('switch');

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
})



CheckLastFile.addEventListener('change', function () {
    if (CheckLastFile.checked) {
        // 清空input
        fileInput.value = '';
        fileInput2.value = '';
        result.innerHTML = '';
        switchbtn.innerHTML = 'Old Follower file';
        // toast 您以切換為第二選項
        Toast.fire({
            icon: 'success',
            title: '已切換為第二選項',
            text: '請將您之前的 Follower file 上傳',
            width: '30rem'
        })
    } else {
        // 清空input
        fileInput.value = '';
        fileInput2.value = '';
        result.innerHTML = '';
        switchbtn.innerHTML = 'Following file';
        CheckOldName.checked = false
        // toast 您以切換為第一選項
        Toast.fire({
            icon: 'success',
            title: '已切換為預設選項',
        })
    }

});



CheckOldName.addEventListener('change', function () {
    if (CheckOldName.checked && CheckLastFile.checked) {

    } else if (CheckOldName.checked) {
        Swal.fire({
            title: "請先選擇第二選項",
            text: "此功能與第二項綁定",
            icon: "question"
        });
        CheckOldName.checked = false; // Uncheck CheckOldName if CheckLastFile is not checked
    }

});



function Follower() {

    followerValues = followersData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href,
            timestamp: data.timestamp
        }))
    ).flat();
    console.log(followerValues);

}
function OldFollower() {

    OldfollowerValues = followersData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href,
            timestamp: data.timestamp
        }))
    ).flat();
    console.log(OldfollowerValues);

}

function Following(arg) {
    followingData = arg.relationships_following;

    followingValues = followingData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href,
            timestamp: data.timestamp
        }))
    ).flat();

}

document.getElementById('fileInput').addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            let content = e.target.result;
            try {
                let json = JSON.parse(content);
                followersData = json;
                Toast.fire({
                    icon: 'success',
                    title: '上傳成功',
                })


                Follower();
            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                Swal.fire({
                    title: "請選擇正確的檔案",
                    text: "該檔案內容不是有效的 JSON 格式",
                    icon: "question"
                });
                fileInput.value = ''; // 清空檔案輸入欄位
            }
        };

        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "看來你在選擇檔案過程中出現問題",
            footer: '請重新嘗試</br>若仍然無法解決歡迎前往留言區提問</a>'
        });
    }
});

document.getElementById('fileInput2').addEventListener('change', function () {
    if (fileInput2.files.length > 0) {
        let file = fileInput2.files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            let content = e.target.result;
            try {
                let json = JSON.parse(content);
                followersData = json;
                Toast.fire({
                    icon: 'success',
                    title: '上傳成功',
                })

                if (CheckLastFile.checked) {
                    OldFollower();
                } else {
                    Following(json);
                }

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                Swal.fire({
                    title: "請選擇正確的檔案",
                    text: "該檔案內容不是有效的 JSON 格式",
                    icon: "question"
                });
                fileInput2.value = ''; // 清空檔案輸入欄位
            }
        };

        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "看來你在選擇檔案過程中出現問題",
            footer: '請重新嘗試</br>若仍然無法解決歡迎前往留言區提問</a>'
        });

    }
});



// 創建列表
function creatList(filteredFollowingValues) {

    let listElement = document.getElementById('followingList');
    if (!listElement) {
        listElement = document.createElement('ul');
        listElement.id = 'followingList';
        document.body.appendChild(listElement);
    }

    listElement.innerHTML = '';

    // 新增匯出按鈕（JSON / CSV）
    let exportContainer = document.getElementById('exportContainer');

    document.getElementById('exportJsonBtn').onclick = () => exportToJSON(filteredFollowingValues, 'filtered_following.json');
    document.getElementById('exportCsvBtn').onclick = () => exportToCSV(filteredFollowingValues, 'filtered_following.csv');
    document.getElementById('manageIgnoreBtn').onclick = () => {
        const list = ignoreList.join(',');
        const input = prompt('請以逗號分隔編輯忽略名單（username1,username2）:', list);
        if (input === null) return;
        ignoreList = input.split(',').map(s => s.trim()).filter(Boolean);
        saveIgnoreData();
        Toast.fire({ icon: 'success', title: '忽略名單已更新' });
    };

    // 列表項目建立：新增忽略按鈕與標籤按鈕
    filteredFollowingValues.forEach(item => {
        let listItem = document.createElement('li');
        let leftWrap = document.createElement('div');
        let rightWrap = document.createElement('div');
        leftWrap.style.display = 'flex';
        leftWrap.style.alignItems = 'center';
        leftWrap.style.gap = '0.5rem';

        let link = document.createElement('a');
        let span = document.createElement('span');
        let btnIgnore = document.createElement('button');
        let btnTag = document.createElement('button');
        let tagLabel = document.createElement('small');

        moment.locale('zh-tw');
        if (YMDCheck.checked) {
            span.textContent = `您於 ${moment.unix(item.timestamp).format("YYYY年MM月")} 開始追蹤此用戶`;
        } else {
            span.textContent = `您於 ${moment.unix(item.timestamp).fromNow()} 開始追蹤此用戶`;
        }


        span.style.fontSize = '.5em';
        if (window.innerWidth > 992) {
            span.style.fontSize = '1em';
        }
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.alignItems = 'center';
        listItem.classList.add('list-group-item');

        link.textContent = item.value;
        link.href = item.href;
        link.target = "_blank";


        leftWrap.appendChild(link);

        // Conditionally add tag label and tool buttons
        if (document.getElementById('showTools').checked) {
            // 標籤顯示
            tagLabel.style.marginLeft = '6px';
            tagLabel.textContent = tagMap[item.value] ? ` ${tagMap[item.value]}` : '';
            leftWrap.appendChild(tagLabel);

            // 標籤按鈕
            btnTag.className = 'btn btn-sm btn-outline-primary';
            btnTag.textContent = '✏';
            btnTag.onclick = () => {
                setTag(item.value);
                tagLabel.textContent = tagMap[item.value] ? ` ${tagMap[item.value]}` : '';
            };

            // 忽略按鈕
            btnIgnore.className = 'btn btn-sm btn-outline-danger';
            btnIgnore.textContent = isIgnored(item.value) ? '取消忽略' : '忽略';
            btnIgnore.onclick = () => {
                toggleIgnore(item.value);
                btnIgnore.textContent = isIgnored(item.value) ? '取消忽略' : '忽略';
                // 重新渲染列表（簡易方式）
                main();
            };

            rightWrap.appendChild(span);
            rightWrap.appendChild(btnTag);
            rightWrap.appendChild(btnIgnore);
        } else {
            rightWrap.appendChild(span);
        }

        listItem.appendChild(leftWrap);
        listItem.appendChild(rightWrap);
        result.appendChild(listItem);
        
    })
}



function main() {
    result.innerHTML = '';
    if (fileInput.files.length > 0 && fileInput2.files.length > 0) {

        // 先計算差異，再把被忽略的 username 排除
        let filteredFollowingValues = followingValues
            .filter(following =>
                !followerValues.some(follower => follower.value === following.value)
            )
        if (showIgnore.checked) {
            filteredFollowingValues = filteredFollowingValues.filter(item => !isIgnored(item.value));
        }

        let filteredFollowingValuesLast = followerValues
            .filter(following =>
                !OldfollowerValues.some(follower => follower.value === following.value)
            )
            .filter(item => !isIgnored(item.value));

        let oldname = OldfollowerValues
            .filter(following =>
                !followerValues.some(follower => follower.value === following.value)
            )
            .filter(item => !isIgnored(item.value));

        if (CheckOldName.checked && CheckLastFile.checked) {
            return creatList(oldname);
        } else if (CheckLastFile.checked) {
            return creatList(filteredFollowingValuesLast);
        } else {
            return creatList(filteredFollowingValues);
        }

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "請先上傳您的檔案",
            footer: '請重新嘗試</br>若仍然無法解決歡迎前往留言區提問</a>'
        });
    }
}


//即時查詢總人數
const firstSpan = document.querySelector('.sitestatesJs');
//取得字串
const text = firstSpan.textContent;
//取得數字
const Real_Time_Number = text.substring(text.length - 5);


//今日訪客
const spans = document.querySelectorAll(".sitestatesJs");
const secondSpan = spans[1];
const secondSpan_txt = secondSpan.textContent;
const secondSpan_result = secondSpan_txt.substring(text.length - 6);

//線上人數
const online = document.querySelectorAll(".sitestatesJs");
const onlineSpan = online[2];
const onlineSpan_txt = onlineSpan.textContent;
const onlineSpan_result = onlineSpan_txt.substring(text.length - 4);

document.getElementById("Total").innerHTML = "累計訪客:" + "&ensp;" + Real_Time_Number;
// document.getElementById("month").innerHTML = "本月訪客:"+ month;
document.getElementById("Today").innerHTML = "今日訪客:" + "&ensp;" + secondSpan_result;
document.getElementById("online").innerHTML = "線上人數:" + "&ensp;" + onlineSpan_result;

// 新增匯出輔助函式
function exportToJSON(data, filename) {
    const enriched = (data || []).filter(d => !isIgnored(d.value)).map(d => ({ ...d, tag: tagMap[d.value] || '' }));
    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
}

function exportToCSV(data, filename) {
    const filtered = (data || []).filter(d => !isIgnored(d.value));
    if (filtered.length === 0) {
        Swal.fire({ icon: 'info', title: '沒有資料可匯出' });
        return;
    }
    const headers = ['value', 'href', 'timestamp', 'date', 'profilePicture', 'tag'];
    const rows = filtered.map(item => {
        const date = item.timestamp ? moment.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss') : '';
        const vals = [
            item.value || '',
            item.href || '',
            item.timestamp || '',
            date,
            item.profilePicture || '',
            tagMap[item.value] || ''
        ];
        return vals.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csv = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// 載入忽略資料
function loadIgnoreData() {
    try {
        const raw = localStorage.getItem('ig_ignore_data');
        if (raw) {
            const obj = JSON.parse(raw);
            ignoreList = obj.ignore || [];
            tagMap = obj.tags || {};
        }
    } catch (e) {
        console.error('loadIgnoreData error', e);
        ignoreList = [];
        tagMap = {};
    }
}

// 儲存忽略資料
function saveIgnoreData() {
    try {
        localStorage.setItem('ig_ignore_data', JSON.stringify({ ignore: ignoreList, tags: tagMap }));
    } catch (e) {
        console.error('saveIgnoreData error', e);
    }
}

// 判斷是否被忽略
function isIgnored(username) {
    return ignoreList.includes(username);
}

// 新增 / 移除忽略
function toggleIgnore(username) {
    if (isIgnored(username)) {
        ignoreList = ignoreList.filter(u => u !== username);
    } else {
        ignoreList.push(username);
    }
    saveIgnoreData();
}

// 設定標籤
function setTag(username) {
    const current = tagMap[username] || '';
    const tag = prompt(`為 ${username} 輸入標籤（留空表示移除）:`, current);
    if (tag === null) return; // 取消
    if (tag.trim() === '') {
        delete tagMap[username];
    } else {
        tagMap[username] = tag.trim();
    }
    saveIgnoreData();
}

// 載入儲存的忽略資料
loadIgnoreData();


