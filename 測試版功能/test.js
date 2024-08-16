document.getElementById('fileInput').addEventListener('change', function () {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);
                followersData = json;

                

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                alert('檔案內容不是有效的 JSON 格式，請選擇正確的檔案');
                fileInput.value = ''; // 清空檔案輸入欄位
            }
        };

        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        alert('請選擇一個檔案');
    }
});

function main(){
    var listElement = document.getElementById('followingList');
        if (!listElement) {
            listElement = document.createElement('ul');
            listElement.id = 'followingList';
            document.body.appendChild(listElement);
        }

        listElement.innerHTML = '';
        console.log(followersData);
        

        followersData.forEach(item => {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            var div = document.createElement('div');
            var span = document.createElement('span');
            //建立img元素
            var img = document.createElement('img');

            moment.locale('zh-tw');
            if(YMDCheck.checked){
                span.textContent = `您於 ${moment.unix(item.timestamp).format("YYYY年MM月")} 開始追蹤此用戶`;
            }else{
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
            img.style.width = '15%'
            img.style.marginRight = '0.5em'
            img.style.borderRadius = '50%';
            img.src = item.profilePicture;
            img.onerror = function() {
                this.src = 'profile_pictures/default_profile_picture.png';

            };
        
           
            div.appendChild(img);
            div.appendChild(link);
            listItem.appendChild(div);      
            listItem.appendChild(span);
            result.appendChild(listItem);
        });
}
//將找不到的圖片預設為defale.png
