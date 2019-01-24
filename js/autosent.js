const puppeteer = require('puppeteer')
const readline = require('readline')

var user = "toandaominh1997@gmail.com";
var pass = "Machinelearning";
var id = 100012903457190;
(async()=>{
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage();
    await page.goto('https://m.facebook.com');
    await page.type('#m_login_email',user);
    await page.type('#m_login_password',pass);
    await page.click("button[value='Đăng nhập']");
    await page.waitForNavigation();
    await 	page.goto('https://m.facebook.com/messages/thread/'+id+'/');
    for(var i=0;i<50;i++){
        await page.type('#composerInput',"Lâu nay bạn còn thầm nhờ đến Vi hông");
        await page.click("button[value='Send']");
    }

})();
