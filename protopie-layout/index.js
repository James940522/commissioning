const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8080;

app.use(express.json());

// CORS 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.post('/render', async (req, res) => {
  const { url, userAgent, size } = req.body;

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  //   await page.setUserAgent(
  //     'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  //   );

  await page.setUserAgent(userAgent);
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.evaluate(size => {
    document.body.style.width = `${size.width}px`;
    document.body.style.height = `${size.height}px`;
  }, size);

  const content = await page.content();
  await browser.close();
  res.send(content);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
