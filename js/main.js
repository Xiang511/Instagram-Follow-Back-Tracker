var followersData = [];
var followingData = [];
var followerValues = [];
var OldfollowerValues = [];
var followingValues = [];

let fileInput = document.getElementById('fileInput');
let fileInput2 = document.getElementById('fileInput2');
var result = document.getElementById('result');
let YMDCheck = document.getElementById('YMDCheck');
let CheckLastFile = document.getElementById('CheckLastFile');


const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
})

CheckLastFile.addEventListener('change', function () {
    if (CheckLastFile.checked) {
        // 清空input
        fileInput.value = '';
        fileInput2.value = '';

        // toast 您以切換為第二選項
        Toast.fire({
            icon: 'success',
            title: '已切換為第二選項',
        })
    }else{
        // 清空input
        fileInput.value = '';
        fileInput2.value = '';

        // toast 您以切換為第一選項
        Toast.fire({
            icon: 'success',
            title: '已切換為預設選項',
        })
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


    filteredFollowingValues.forEach(item => {
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        let span = document.createElement('span');

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


        listItem.appendChild(link);
        listItem.appendChild(span);
        result.appendChild(listItem);
    })
}



function main() {
    result.innerHTML = '';
    if (fileInput.files.length > 0 && fileInput2.files.length > 0) {


        let filteredFollowingValues = followingValues.filter(following =>
            !followerValues.some(follower => follower.value === following.value));

        let filteredFollowingValuesLast = followerValues
            .filter(following =>
                !OldfollowerValues.some(follower => follower.value === following.value)
            );


        // console.log(filteredFollowingValues);
        // console.log(filteredFollowingValuesLast);
        if (CheckLastFile.checked) {
            return creatList(filteredFollowingValuesLast);
        }
        else {
            return creatList(filteredFollowingValues);
        }


    } 
    else {
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


