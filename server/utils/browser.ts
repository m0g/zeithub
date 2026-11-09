import puppeteer, { type Browser } from 'puppeteer-core';

let browser: Promise<Browser> | undefined;

// One Chromium for the whole process, started on the first PDF request.
export function getBrowser() {
  if (!browser) {
    const executablePath = process.env.CHROME_BIN;
    if (!executablePath) {
      throw createError({
        statusCode: 503,
        statusMessage: 'PDF generation is not available: CHROME_BIN is not set',
      });
    }

    browser = puppeteer
      .launch({
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      })
      .then(instance => {
        instance.on('disconnected', () => {
          browser = undefined;
        });
        return instance;
      })
      .catch(error => {
        browser = undefined;
        throw error;
      });
  }

  return browser;
}

export async function closeBrowser() {
  const current = browser;
  browser = undefined;
  if (current) {
    await (await current).close().catch(() => {});
  }
}
