var followersData = [];
var followingData = [];
var followerValues = [];
var followingValues = [];

function Follower() {
                
    followerValues = followersData.map(follower =>
        follower.string_list_data.map(data => ({
            value: data.value,
            href: data.href
        }))
    ).flat();

    console.log(followerValues);

}

function Following(arg) {
        followingData = arg.relationships_following;
    
        followingValues = followingData.map(follower =>
            follower.string_list_data.map(data => ({
                value: data.value,
                href: data.href
            }))
        ).flat();
    
        console.log(followingValues);
    
    }

document.getElementById('uploadButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);

                followersData = json;
                Follower();

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                alert('檔案內容不是有效的 JSON 格式');
            }
        };
       
        reader.readAsText(file); // 讀取檔案內容作為文字
    } else {
        alert('請選擇一個檔案');
    }
});


document.getElementById('uploadButton2').addEventListener('click', function() {
    var fileInput2 = document.getElementById('fileInput2');
    if (fileInput2.files.length > 0) {
        var file = fileInput2.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);
                Following(json)

            } catch (error) {
                console.error('解析 JSON 失敗:', error);
                alert('檔案內容不是有效的 JSON 格式');
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
            link.textContent = item.value; 
            listItem.appendChild(link); 
            listElement.appendChild(listItem);
        });
    }else{
        alert('Please upload information first (follower and following)');
    }
}
