const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function getProfilePicture(username) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // 指定 Chrome 瀏覽器的路徑
    headless:true,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.threads.net/${username}`, { waitUntil: 'networkidle2' });

  // 等待頭貼圖片載入
  await page.waitForSelector('img[alt*="的大頭貼照"]', { timeout: 30000 });

  const profilePictureElement = await page.$('img[alt*="的大頭貼照"]');
  const profilePictureUrl = await profilePictureElement.getProperty('src');
  const profilePictureUrlValue = await profilePictureUrl.jsonValue();

  //下載抓取到的圖片
    const viewSource = await page.goto(profilePictureUrlValue);

    if (!fs.existsSync('profile_pictures')){
        fs.mkdirSync('profile_pictures');
    }
    fs.writeFile(`profile_pictures/${username}_profile_picture.png`, await viewSource.buffer(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });


//   await page.screenshot({ path: `${username}_screenshot.png` });
  await browser.close();

  return profilePictureUrlValue;
}

// 使用示例
const unfollowData = fs.readFileSync('filtered_following.json');
const unfollowValues = JSON.parse(unfollowData);
const values = unfollowValues.map(item => item.value);

values.forEach(async username => {
    await getProfilePicture(username);
   //將剛下載的圖片放入unfollowed.json物件中
    unfollowValues.find(item => item.value === username).profilePicture = `測試版功能/profile_pictures/${username}_profile_picture.png`;
    fs.writeFileSync('unfollowed.json', JSON.stringify(unfollowValues, null, 2));
    
});
