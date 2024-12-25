const puppeteer = require('puppeteer');

// Etsy ürün sayfası URL'si
const ETSY_URL = 'https://www.etsy.com/listing/1838394279';

async function solveDragCaptcha(page) {
    try {
        console.log('CAPTCHA çözülüyor: Sürükleme işlemine başlanıyor...');
        
        // CAPTCHA slider'ını bul
        const sliderHandle = await page.waitForSelector('.slider__handle', { timeout: 10000 });

        // Slider başlangıç pozisyonunu al
        const sliderBox = await sliderHandle.boundingBox();

        if (!sliderBox) {
            console.error('Slider elemanı bulunamadı.');
            return false;
        }

        const sliderX = sliderBox.x + sliderBox.width / 2;
        const sliderY = sliderBox.y + sliderBox.height / 2;

        // Fareyi slider üzerine taşı ve sürüklemeye başla
        await page.mouse.move(sliderX, sliderY);
        await page.mouse.down();

        // Slider'ı sağa sürükle (yaklaşık bir hareket simüle ediliyor)
        await page.mouse.move(sliderX + 300, sliderY, { steps: 30 });
        await page.mouse.up();

        // CAPTCHA çözümünü bekle
        await page.waitForTimeout(3000);

        // Kontrol: CAPTCHA başarıyla geçildi mi?
        const captchaStillExists = await page.$('.slider__handle');
        if (captchaStillExists) {
            console.log('CAPTCHA geçilemedi. Tekrar deneyebilirsiniz.');
            return false;
        }

        console.log('CAPTCHA başarıyla çözüldü!');
        return true;
    } catch (error) {
        console.error('CAPTCHA çözümünde hata oluştu:', error.message);
        return false;
    }
}

async function run() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Sayfayı aç
    await page.goto(ETSY_URL);

    // CAPTCHA var mı kontrol et
    const isCaptcha = await page.evaluate(() => {
        return !!document.querySelector('.slider__handle');
    });

    if (isCaptcha) {
        console.log('CAPTCHA tespit edildi, çözülüyor...');
        const captchaSolved = await solveDragCaptcha(page);

        if (!captchaSolved) {
            console.error('CAPTCHA çözülemedi. İşlem sonlandırılıyor.');
            await browser.close();
            return;
        }
    } else {
        console.log('CAPTCHA tespit edilmedi.');
    }

    // Ürün sayfası tam yüklendi mi kontrol et
    try {
        await page.waitForSelector('#listing-page-cart', { timeout: 15000 }); // Ürün sayfasındaki bir element
        console.log('Ürün sayfası başarıyla yüklendi.');
    } catch (error) {
        console.error('Ürün sayfası yüklenemedi:', error.message);
    }

    // Sayfa tamamen yüklendiğinde ekran görüntüsü al
    await page.screenshot({ path: 'etsy_product.png' });
    console.log('Ekran görüntüsü alındı: etsy_product.png');

    await browser.close();
}

// İşlemi başlat
run().catch(console.error);
