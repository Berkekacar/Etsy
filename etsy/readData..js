// readData.js
const fs = require('fs'); // Dosya sistemi modülünü import ediyoruz

// Dosyadaki veriyi bir listeye dönüştüren fonksiyon
const readData = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Dosya okunamadı:", err);
            callback(err, null);  // Hata durumunda geri çağırma fonksiyonuna hata mesajı gönderiyoruz
            return;
        }
        // Dosyadaki her satırı bir listeye dönüştürme
        const list = data.split('\n').map(item => item.trim());
        callback(null, list);  // Başarı durumunda listeyi geri çağırma fonksiyonuna gönderiyoruz
    });
};

// Fonksiyonu dışa aktar
module.exports = readData;
