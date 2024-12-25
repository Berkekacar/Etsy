const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Headless mode kapalı
  const page = await browser.newPage(); // Yeni bir sayfa açılıyor

  const targetURL = 'https://www.etsy.com/listing/1838394279'; // Hedef URL
  const captchaContainerId = 'captcha-container'; // Aranan captcha-container id değeri

  try {
    // Hedef URL'ye gidiyoruz
    await page.goto(targetURL, { waitUntil: 'load' });

    // İframe içindeki captcha-container div'ini arıyoruz
    const captchaContainerContent = await page.evaluate((id) => {
      return new Promise((resolve, reject) => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            const captchaFrame = iframe.contentDocument.querySelector(`div#${id}`);
            if (captchaFrame) {
              resolve(captchaFrame.innerHTML); // iframe içindeki div'nin içeriğini al
            } else {
              resolve('Captcha container bulunamadı.');
            }
          };
        } else {
          resolve('Iframe bulunamadı.');
        }
      });
    }, captchaContainerId);

    console.log('Captcha Container İçeriği:', captchaContainerContent);
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    await browser.close(); // Tarayıcıyı kapat
  }
})();
