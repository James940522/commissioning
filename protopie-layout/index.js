const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render mobile page
app.get('/mobile-page', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set user agent for mobile device
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    );

    // Set viewport for mobile dimensions
    await page.setViewport({ width: 375, height: 667 });

    await page.goto(`https://cloud.protopie.io/p/aac5c7bd3f`, {
      waitUntil: 'networkidle2',
    });
    const content = await page.content(); // Get page content as HTML

    await browser.close();
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
