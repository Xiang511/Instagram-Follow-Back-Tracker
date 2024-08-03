var followersData = [];
var followingData = [];
var followerValues = [];
var followingValues = [];

var result = document.getElementById('result');

var toastTrigger = document.getElementById('liveToastBtn')
var toastLiveExample = document.getElementById('liveToast')

let toast_body = document.querySelector('.toast-body');


function Follower(arg) {
    followersData = arg.text_post_app_text_post_app_followers;

    followerValues = followersData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href
        }))
    ).flat();
    // console.log(followerValues);
    let toast = new bootstrap.Toast(toastLiveExample)
    toast.show()




}

function Following(arg) {
    followingData = arg.text_post_app_text_post_app_following;

    followingValues = followingData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href
        }))
    ).flat();

    let toast = new bootstrap.Toast(toastLiveExample)
    toast.show()


}

document.getElementById('fileInput').addEventListener('change', function () {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);
                toast_body.textContent = " ✅ 資料上傳成功 " + `${file.name}`
                Follower(json);

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                alert('檔案內容不是有效的 JSON 格式');
                fileInput.value = ''; // 清空檔案輸入欄位
            }
        };

        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        alert('請選擇一個檔案');
    }
});


document.getElementById('fileInput2').addEventListener('change', function () {
    var fileInput2 = document.getElementById('fileInput2');
    if (fileInput2.files.length > 0) {
        var file = fileInput2.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);
                toast_body.textContent = " ✅ 資料上傳成功 " + `${file.name}`
                Following(json)

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                alert('檔案內容不是有效的 JSON 格式');
                fileInput2.value = ''; // 清空檔案輸入欄位
            }
        };

        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        alert('請選擇一個檔案');
    }
});

function main() {

    if (fileInput.files.length > 0 && fileInput2.files.length > 0) {

        var filteredFollowingValues = followingValues.filter(following =>
            !followerValues.some(follower => follower.value === following.value));

        console.log(filteredFollowingValues);

        var listElement = document.getElementById('followingList');
        if (!listElement) {
            listElement = document.createElement('ul');
            listElement.id = 'followingList';
            document.body.appendChild(listElement);
        }

        listElement.innerHTML = '';


        filteredFollowingValues.forEach(item => {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = item.href;
            link.target = "_blank";
            link.textContent = item.value;
            listItem.classList.add('list-group-item');
            listItem.appendChild(link);
            result.appendChild(listItem);
        });
    } else {
        alert('Please upload information first (follower and following)');
    }
}



//即時查詢總人數
const firstSpan = document.querySelector('.sitestatesJs');
//取得字串
const text = firstSpan.textContent;
//取得數字
const Real_Time_Number = text.substring(text.length - 4);


//今日訪客
const spans = document.querySelectorAll(".sitestatesJs");
const secondSpan = spans[1];
const secondSpan_txt = secondSpan.textContent;
const secondSpan_result = secondSpan_txt.substring(text.length - 4);

//線上人數
const online = document.querySelectorAll(".sitestatesJs");
const onlineSpan = online[2];
const onlineSpan_txt = onlineSpan.textContent;
const onlineSpan_result = onlineSpan_txt.substring(text.length - 4);

document.getElementById("Total").innerHTML = "累計訪客:" + "&ensp;" + Real_Time_Number;
// document.getElementById("month").innerHTML = "本月訪客:"+ month;
document.getElementById("Today").innerHTML = "今日訪客:" + "&ensp;" + secondSpan_result;
document.getElementById("online").innerHTML = "線上人數:" + "&ensp;" + onlineSpan_result;