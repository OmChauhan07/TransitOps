import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  
  const content = await page.evaluate(() => document.body.innerText);
  console.log('--- PAGE CONTENT ---');
  console.log(content);
  console.log('--------------------');
  
  await browser.close();
})();
