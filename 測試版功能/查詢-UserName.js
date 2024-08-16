const fs = require('fs');
const puppeteer = require('puppeteer-core');

async function getProfilePicture(username) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // 指定 Chrome 瀏覽器的路徑
    headless:false
  });
  const page = await browser.newPage();
  await page.goto(`https://www.threads.net/${username}`, { waitUntil: 'networkidle2' });

  await page.waitForSelector('h2.x1lliihq.x1plvlek.xryxfnj', { timeout: 30000 });

  const textElement = await page.$('h2.x1lliihq.x1plvlek.xryxfnj');
  const text = await textElement.evaluate(element => element.textContent);

  await browser.close();

  return text;
}

async function processUsernames(values) {
  for (const username of values) {
    const profilePictureUrl = await getProfilePicture(username);
    
    const unfollowedData = fs.readFileSync('unfollowed.json');
    const unfollowedValues = JSON.parse(unfollowedData);
    
    unfollowedValues.push({ username, profilePictureUrl });
    fs.writeFileSync('unfollowed.json', JSON.stringify(unfollowedValues));
  }
}

// 使用示例
const values = ['this.web', 'explainthis.io']; // 替換為實際的使用者名稱
processUsernames(values);
