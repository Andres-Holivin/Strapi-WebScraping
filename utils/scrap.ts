const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
export const scrap = async ({ name }:{name:string}) => {
    let url = 'https://pro.maritimeoptima.com'
    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto(`${url}`, {
        waitUntil: "networkidle0",
        timeout: 500000
    });

    let body = await page.evaluate(() => {
        return document.body.innerHTML
    });//
    // console.log(body1)
    let $ = cheerio.load(body);
    await page.click("#root > div.sc-evZas.brgIDG > div.sc-breuTD.ifXifa > div > div.ant-space.css-l6tyap.ant-space-vertical > div:nth-child(2) > button")
    await page.type('#email', 'noknowme42@gmail.com');
    await page.type('#password', '@Nooneknowme43');
    await page.click("#root > div.sc-evZas.brgIDG > div.sc-breuTD.ifXifa > div > form > button")
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });

    await page.goto(`${url}/?q=%7B%22activeTab%22%3A%22vessels%22%2C%22search%22%3A%22${name}%22%7D`, {
        waitUntil: "networkidle0",
    });
    body = await page.evaluate(() => {
        return document.body.innerHTML
    });//
    // console.log(body1)
    $ = cheerio.load(body);
    let Vessels = $('#rc-tabs-0-panel-vessels > div > div > div > div > div > div > div.ant-table-body > div > table > tbody').find('.ant-table-row').map((i, e) => {
        return { "IMO": $(e).get(0).attribs['data-row-key'], "Name": $(e).find($('td:nth-child(2) > div > div:nth-child(2)')).html() }
    }).toArray()
    for (let i = 0; i < Vessels.length; i++) {
        await page.goto(`https://pro.maritimeoptima.com/vessels/${Vessels[i].IMO}?tab=questionnaire`, {
            waitUntil: "networkidle0",
        });
        let body = await page.evaluate(() => {
            return document.body.innerHTML
        });
        let $ = cheerio.load(body);
        console.log($('#root').has($('.ant-alert')).length)
        if ($('#root').has($('.ant-alert')).length === 1) {
            await page.click("#root > div.sc-jWEIYm.jbzJQk > div > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div.ant-alert-description > div > div:nth-child(2) > button")
            await delay(2000)
        }

        await page.click('#root > div.sc-jWEIYm.jbzJQk > div > div > div:nth-child(2) > div:nth-child(3) > section > div.sc-ibEqUB.gnOuKd > div:nth-child(1) > div > div > div.sc-bcSJjp.cjexhq > div:nth-child(2) > p');
        body = await page.evaluate(() => {
            return document.body.innerHTML
        });
        $ = cheerio.load(body);
        let Callsign = $("section[id='q88.sectionTitles.generalInfo'] > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2) > div > div > span > input").val()
        let MMSI = $("section[id='q88.sectionTitles.generalInfo'] > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > span > input").val()

        Vessels[i]['Callsign'] = Callsign
        Vessels[i]['MMSI'] = MMSI
    }
    await page.close();
    await browser.close();
    return Vessels;
};
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}