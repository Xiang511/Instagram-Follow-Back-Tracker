
const fs = require('fs');
const puppeteer = require('puppeteer-core');

 let not_found_list = []

async function getProfilePicture(username) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // 指定 Chrome 瀏覽器的路徑
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.threads.net/${username}`, { waitUntil: 'networkidle2' });
  
  try {
    await page.waitForSelector('img[alt*="的大頭貼照"]', { timeout: 6000 });

  } catch (error) {
    console.log(`${username} not found`);
    not_found_list.push(username);
    await browser.close();
    return null;
  }

  const profilePictureElement = await page.$('img[alt*="的大頭貼照"]');
  const profilePictureUrl = await profilePictureElement.getProperty('src');
  const profilePictureUrlValue = await profilePictureUrl.jsonValue();

  // 下載抓取到的圖片
  const viewSource = await page.goto(profilePictureUrlValue);

  if (!fs.existsSync('profile_pictures')) {
    fs.mkdirSync('profile_pictures');
  }
  fs.writeFile(`profile_pictures/${username}_profile_picture.png`, await viewSource.buffer(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`${username}e was saved!`);
  });
  await browser.close();

  return profilePictureUrlValue;
}

async function processUsernames(values) {
  for (const username of values) {
    const profilePictureUrl = await getProfilePicture(username);
    if (profilePictureUrl) {
      let unfollowedData = fs.readFileSync('unfollowed.json');
      let unfollowedValues = JSON.parse(unfollowedData);

      unfollowedValues.push({ username, profilePicture: `profile_pictures/${username}_profile_picture.png` });
      fs.writeFileSync('unfollowed.json', JSON.stringify(unfollowedValues, null, 2)); // 格式化 JSON 以便於閱讀
    }
    else{
      let unfollowedData = fs.readFileSync('unfollowed.json');
      let unfollowedValues = JSON.parse(unfollowedData);
      unfollowedValues.push({ username, profilePicture: 'profile_pictures/default_profile_picture.png' });
        fs.writeFileSync('unfollowed.json', JSON.stringify(unfollowedValues, null, 2)); // 格式化 JSON 以便於閱讀
    }
  }
}
const data = fs.readFileSync('filtered_following.json', 'utf8');

// 解析 JSON 資料
const jsonData = JSON.parse(data);

// 遍歷每個物件並新增 profilePicture 屬性
jsonData.forEach(item => {
  item.profilePicture = `profile_pictures/${item.value}_profile_picture.png`;
});

// 將更新後的資料寫回 JSON 檔案
fs.writeFileSync('filtered_following.json', JSON.stringify(jsonData, null, 2));

console.log('已新增 profilePicture 屬性並更新 filtered_following.json 檔案');

// 使用示例
const values = [
  // "this.web",
  // "explainthis.io",
  // "spongetwmeme88",
  // "spongebob_meme714",
  // "viral.coder",
  // "beunickdev",
  // "coding_dev_",
  // "seba.frontend.tips",
  // "parth.webdev",
  // "isu_ga_isme",
  // "bluee_wong",
  // "cat_minsikk",
  // "tiny_cat_22",
  // "lions_cat_tabi",
  // "xiuxzzhi",
  // "wowtchout",
  // "gulden.krgoz",
  // "doru.ragdoll",
  // "lunaistabby",
  // "omochi__0726",
  // "coconut.___________",
  // "worldofivo",
  // "melody_mew2",
  // "nono.02.14",
  // "coding_comedy",
  // "mio_baby0815",
  // "msaaddev",
  // "eeveeandyoshi",
  // "_charlie_liao",
  // "aggaworld",
  // "web_talks",
  // "pearlsragdolls",
  // "achrafcodes",
  // "techgeekz.official",
  // "cyberediting",
  // "late.226",
  // "reginasorr",
  // "pei_love_hamster",
  // "logo_elite",
  // "janjan_20210503",
  // "meimeimei1022",
  // "battlebots",
  // "uye_doka",
  // "khnstien",
  // "le_dahye",
  // "simpsons__meme",
  // "a_designer_my",
  // "kabosu0425",
  // "jojo_lai123",
  // "mashu.cat",
  // "diaryofollie",
  // "blesseddaynotes",
  // "ao_munchkincat",
  // "sola.channel_",
  // "shake.ragdoll",
  // "fighterstudiohk0",
  // "fighterstudiohk1",
  // "r_po0608",
  // "bigheadmunchkin2",
  // "papaya.cat",
  // "marumaru06260908",
  // "peanut.britishcat",
  // "easy.to.physio",
  // "__ao.siberian__",
  // "spongebob_memes_forever",
  // "whitechubbs",
  // "ballchi_meow",
  // "foongyixin.ba",
  // "allure.lynn152style",
  // "dianbo_cat",
  // "lativ_ig",
  // "funnycute8857",
  // "spongbob_memespicture",
  // "muchimuchi_roy",
  // "mister_phobia",
  // "jks_shop",
  // "uniqlo_taiwan",
  // "gu_taiwan",
  // "___dsdaily___",
  // "spongepaige",
  // "popure_tw",
  // "a_nya.0606",
  // "__merryday",
  // "kucing_bang_jago",
  // "nicodiary0716",
  // "masmas.kenko",
  // "bigheadmunchkin",
  // "scoutmeme_",
  // "csie_meme",
  // "ru_ku730",
  // "neko.ponta.neko",
  // "chestnut.bbang",
  // "fuu_fusagoro",
  // "dric",
  // "wunshannoname",
  // "hanachan_316",
  // "dacon.come",
  // "purinharumaki_karameru",
  // "ozturkmenmuhendislik",
  // "unico_uniuni",
  // "bugcat_capoo",
  // "usgmen_gif",
  // "puffymoney_",
  // "tunamayo_1124",
  // "commonwealth_magazine",
  // "sonicrockkimo",
  // "myuuuuchan_1116",
  // "wataamenekoko",
  // "meow_cash",
  // "shizuwarahinata",
  // "isu.guitar.club",
  // "tomo_nan_nan",
  // "mdzz3310",
  // "shirasu_nya",
  // "kina_0818",
  // "shuyu.minmin2.0",
  // "tangtang.shortlegs",
  // "___.nine.___",
  // "ttshow.you",
  // "treeholehk.psychology",
  // "techikoma_0307",
  // "hellohorlung",
  // "sugobar_goyoung",
  // "bapa_nike",
  // "nemu_catlog",
  // "ragdoll.baron",
  // "1117meow",
  // "momota_0808",
  // "wordup_tw",
  // "milo.akamaimu",
  // "dreamsubmarine",
  // "belly_mm",
  // "toramaru.0108",
  // "c.ling_meme",
  // "myspacekittens",
  // "isucsie123",
  // "hatto0112",
  // "suzume0513",
  // "taro20190202",
  // "nekonoyomogi",
  // "cuttingedgeracket",
  // "congzzi_",
  // "owen_lin106",
  // "plainme_life",
  // "felirafelira",
  // "dear.mir_",
  // "super_fish2020_",
  // "ddo_o_da",
  // "isu_b.t",
  // "chinkaopei",
  // "haru.200308",
  // "halla_cat",
  // "dear.mycats",
  // "pantorochiroru",
  // "siru.vely",
  // "lum0403",
  // "isu_mae",
  // "kan.ch_o",
  // "peachkittenpp",
  // "luna_pooh_cats_",
  // "invastzel",
  // "amaccho5160",
  // "dafu.is.a.cat",
  // "gymcademia",
  // "complete_badminton_training",
  // "plainlaw.me",
  // "isusa_since1992",
  // "yogusuke",
  // "lemon.20180701",
  // "ginzo_haruko",
  // "funi0202",
  // "str_network",
  // "miugram0126",
  // "chomiputi",
  // "inves_engineer",
  // "jc0615meme",
  // "10secondsclass",
  // "superbadpainter",
  // "jc0615reshare",
  // "alain_cat",
  // "_maron_fran",
  // "pixie2020cat",
  // "wordssharinghouse",
  // "good_memerep",
  // "godgwawa",
  // "duncan_design",
  // "lonely.crocodile",
  // "oilheadjunior",
  // "youfat_tw",
  // "cat_silva.s",
  // "theworldofleocat",
  // "kome_komecha",
  // "wanghaoscience",
  // "doctormeme_tw",
  // "sparksine",
  // "shuyu.minmin",
  // "omg_this_post_so_87",
  // "dcard.tw",
  // "meow.meme.w",
  // "fomo.the.cat",
  // "kote218",
  // "yomogi0825",
  // "s.yukichii",
  // "victorsport_taiwan",
  // "h.appypotato",
  // "discovery",
  // "wofulcibei",
  // "nasahubble",
  // "heybobguy",
  // "h557360",
  // "nasa",
  // "onece.co",
  // "taurustw88",
  // "onece.chungsir",
  // "wunshanmiyin",
  // "eisland.tw",
  // "happyfunvac",
  // "goodnightpoem",
  // "tai8_meme",
  // "__dooing__",
  // "oh_hayao",
  // "artmajeur",
  // "dotcept",
  // "beginneros",
  // "victormagnus_cr",
  // "kwsa_14th",
  // "midwords_",
  // "mc.carry603",
  // "holdchiou",
  // "baxuan_ig",
  // "oneminlaw",
  // "egg_things",
  // "eva_art1998",
  // "clear_taiwan",
  // "resonating.quote",
  // "yoooooio123",
  // "funvdonews",
  // "incrediville_tw",
  // "wanchiger",
  // "clashroyale",
  // "sofunhahaha",
  // "godreplyme",
  // "shinybearnrd",
  // "tixxlucye",
  // "wholulu6707",
  // "cjn_._",
  // "wan_snap",
  // "yin_yu_words",
  // "m.y.writing",
  // "dudusuxx",
  // "__you__are__my__love__",
  // "cumeizi",
  // "_____qing_",
  // "_kai_1021",
  // "justin_91530"
 
]
processUsernames(values);
console.log(not_found_list);
