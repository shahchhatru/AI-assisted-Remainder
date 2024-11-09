import 'dotenv/config';
import puppeteer from 'puppeteer';
import Groq from 'groq-sdk';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hasCloudflareProtection(page) {
    return await page.evaluate(() => {
        return document.querySelector('#cf-wrapper') !== null ||
               document.querySelector('.cf-browser-verification') !== null ||
               document.querySelector('#challenge-running') !== null;
    });
}

async function waitForCloudflareToPass(page) {
    try {
        console.log('Detected Cloudflare protection, waiting for challenge to complete...');
        
        await page.waitForFunction(
            () => !document.querySelector('#cf-wrapper') &&
                  !document.querySelector('.cf-browser-verification') &&
                  !document.querySelector('#challenge-running'),
            { timeout: 30000 }
        );
        
        await delay(2000);
        console.log('Cloudflare challenge passed');
    } catch (error) {
        console.error('Failed to bypass Cloudflare:', error);
        throw new Error('Could not bypass Cloudflare protection');
    }
}

async function extractNavigationHtml(page) {
    try {
        return await page.evaluate(() => {
            const navElements = document.querySelectorAll('nav, header, .header, #header, .navigation, #navigation');
            let navigationHtml = '';
            
            navElements.forEach(element => {
                navigationHtml += element.outerHTML + '\n';
            });
            
            if (!navigationHtml) {
                const searchContainers = document.querySelectorAll('.search-container, .search-wrapper, .search-box-wrapper');
                searchContainers.forEach(element => {
                    navigationHtml += element.outerHTML + '\n';
                });
            }
            
            return navigationHtml || '';
        });
    } catch (error) {
        console.error('Error extracting navigation HTML:', error);
        return '';
    }
}

async function analyzeHtmlWithGroq(page) {
    try {
        const navigationHtml = await extractNavigationHtml(page);
        
        if (!navigationHtml) {
            console.log('No navigation elements found, skipping Groq analysis');
            return null;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert at analyzing HTML. Your task is to find search-related elements in HTML code. 
                    Look for input elements, forms, or buttons that are likely part of a search functionality. 
                    Common search-related class names include: search, searchbox, search-input, search-field, search-bar, etc.
                    Common search-related IDs include: search, searchInput, searchBox, searchField, etc.`
                },
                {
                    role: "user",
                    content: `Analyze this navigation HTML and find the search bar elements. Return a JSON object with these fields:
                    - searchSelector: CSS selector for the search input
                    - submitSelector: CSS selector for the search submit button (if exists)
                    - alternativeSelectors: Array of other possible search-related selectors
                    
                    Here's the HTML: ${navigationHtml}`
                }
            ],
            model: "llama-3.1-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        return analysis;
    } catch (error) {
        console.error("Error analyzing HTML:", error);
        return null;
    }
}

async function findSearchElementsInBrowser(page) {
    const getUniqueSelectorFn = () => {
        window.getUniqueSelector = (element) => {
            if (element.id) return `#${element.id}`;
            if (element.className) {
                const classes = element.className.split(' ')
                    .filter(c => c.length > 0)
                    .join('.');
                if (classes.length > 0) return `.${classes}`;
            }
            
            let path = [];
            while (element.nodeType === Node.ELEMENT_NODE) {
                let selector = element.nodeName.toLowerCase();
                if (element.id) {
                    selector = `#${element.id}`;
                    path.unshift(selector);
                    break;
                } else {
                    let sibling = element;
                    let nth = 1;
                    while (sibling = sibling.previousElementSibling) {
                        if (sibling.nodeName.toLowerCase() === selector) nth++;
                    }
                    if (nth !== 1) selector += `:nth-of-type(${nth})`;
                }
                path.unshift(selector);
                element = element.parentNode;
            }
            return path.join(' > ');
        };
    };

    await page.evaluate(getUniqueSelectorFn);

    return await page.evaluate(() => {
        const searchSelectors = [
            'input[type="search"]',
            'input[name*="search" i]',
            'input[id*="search" i]',
            'input[class*="search" i]',
            'input[placeholder*="search" i]',
            '.search-input',
            '#search',
            '.searchbox',
            'input[aria-label*="search" i]',
            '#q',
            '.searchbox__input',
            '.search-bar__input'
        ];

        for (const selector of searchSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const form = element.closest('form');
                let submitSelector = null;
                if (form) {
                    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitButton) {
                        submitSelector = window.getUniqueSelector(submitButton);
                    }
                }
                
                return {
                    searchSelector: window.getUniqueSelector(element),
                    submitSelector
                };
            }
        }
        
        return null;
    });
}

async function extractSearchResults(page) {
    try {
        await delay(3000);

        return await page.evaluate(() => {
            const productSelectors = [
                '.product-card',
                '.product-item',
                '.search-result-item',
                '[data-test="product-card"]',
                '.item-card',
                '.c2prKC',
                '.inner--SODwy',
                '.gridItem--Yd0sa'
            ];

            let products = [];
            for (const selector of productSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    products = Array.from(elements).map(element => {
                        const title = element.querySelector('h2, .title, .name, .title--wFj93')?.innerText?.trim() || '';
                        const price = element.querySelector('.price, .amount, .currency--GVKjl')?.innerText?.trim() || '';
                        const image = element.querySelector('img')?.src || '';
                        const link = element.querySelector('a')?.href || '';
                        
                        return { title, price, image, link };
                    });
                    break;
                }
            }
            return products;
        });
    } catch (error) {
        console.error('Error extracting search results:', error);
        return [];
    }
}

async function scrapeWebsite(url, searchTerm) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Enable request interception
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 100000 
        });

        if (await hasCloudflareProtection(page)) {
            await waitForCloudflareToPass(page);
        }

        console.log('Analyzing homepage...');
        let searchElements = await analyzeHtmlWithGroq(page);
        
        if (!searchElements?.searchSelector) {
            console.log('Falling back to browser-based search element detection...');
            searchElements = await findSearchElementsInBrowser(page);
        }
        
        if (!searchElements?.searchSelector) {
            throw new Error('Could not identify search elements');
        }

        console.log(`Found search selector: ${searchElements.searchSelector}`);
        await page.waitForSelector(searchElements.searchSelector, { timeout: 5000 });
        await page.type(searchElements.searchSelector, searchTerm);

        // Submit search
        if (searchElements.submitSelector) {
            await page.click(searchElements.submitSelector);
        } else {
            await page.keyboard.press('Enter');
        }

        // Wait for navigation
        try {
            await page.waitForNavigation({ 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
        } catch (error) {
            console.log('Navigation timeout, continuing with extraction...');
        }

        // Additional wait for dynamic content
        await delay(5000);
        
        console.log('Extracting search results...');
        console.log("The content sent to the Groq API is: ", await page.content());
        const results = await extractSearchResults(page);

        return results;

    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function main(url, searchTerm) {
    try {
        console.log(`Starting search for "${searchTerm}" on ${url}`);
        const results = await scrapeWebsite(url, searchTerm);
        
        if (results.length > 0) {
            console.log('Search Results:');
            console.log(JSON.stringify(results, null, 2));
            
            const fs = await import('fs');
            fs.writeFileSync(
                'search_results.json', 
                JSON.stringify(results, null, 2)
            );
            console.log('Results saved to search_results.json');
        } else {
            console.log('No results found');
        }
        
    } catch (error) {
        console.error('Script failed:', error);
    }
}

const url = process.argv[2] || 'https://example.com';
const searchTerm = process.argv[3] || 'test';

main(url, searchTerm);