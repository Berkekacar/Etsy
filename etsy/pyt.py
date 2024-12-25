package main

import (
    "log"
    "os"
    "time"

    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
    "github.com/go-rod/rod/lib/stealth"
)

func main() {
    var dataDir string = ""
    browserPath, _ := launcher.LookPath()
    log.Println("Chrome browser location:", browserPath)

    l, err := launcher.New().Bin(browserPath).Headless(false).UserDataDir(dataDir).Launch()
    if err != nil {
        log.Println("Error launching browser:", err)
        time.Sleep(5 * time.Second)
    } else {
        log.Println("Control URL:", l)
        browser := rod.New().ControlURL(l).MustConnect()
        defer browser.MustClose()

        page := stealth.MustPage(browser)
        page.MustNavigate("https://www.etsy.com")
        page.MustWaitLoad()

        captchaSelector := "#captcha-input" // CAPTCHA giriş alanı ID'si
        if page.MustElement(captchaSelector).Visible() {
            log.Println("CAPTCHA detected, attempting to bypass...")

            // CAPTCHA'yı manuel olarak çöz
            captchaToken := "d9abc168c62e16885692c86e3c5f6370" // Tokeni buraya elle yazabilirsiniz
            
            page.MustElement(captchaSelector).Input(captchaToken)
            page.MustElement("#captcha-submit").MustClick()
        } else {
            log.Println("No CAPTCHA detected.")
        }

        log.Println("Page Title:", page.MustInfo().Title)
        select {}
    }
}
