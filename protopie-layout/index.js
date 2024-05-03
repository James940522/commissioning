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

// 페이지 렌더링 처리
app.post('/render', async (req, res) => {
  const { url, userAgent, size } = req.body;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 뷰포트 설정
    await page.setViewport({
      width: size.width,
      height: size.height,
      deviceScaleFactor: 1,
    });

    await page.setUserAgent(userAgent);
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 페이지 내에서 CSS를 조정하여 원하는 크기로 강제 설정
    await page.evaluate(size => {
      document.body.style.width = `${size.width}px`;
      document.body.style.height = `${size.height}px`;
    }, size);

    const content = await page.content();
    await browser.close();
    res.send({ html: content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to render the page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
