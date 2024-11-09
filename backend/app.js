const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;



// Endpoint to scrape webpage title
app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL as a query parameter' });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url);

    // Scrape the title
    const pageTitle = await page.title();

    const pageBody = await page.evaluate(() => {
        return document.body.innerHTML; // Use innerHTML if you want raw HTML instead
      });
    console.log({ title: pageTitle,body:pageBody })
    // Close the browser
    await browser.close();

    res.json({ title: pageTitle,body:pageBody });
  } catch (error) {
    console.error('Error scraping the webpage:', error);
    res.status(500).json({ error: 'Failed to scrape the webpage' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
