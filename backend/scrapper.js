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
            const navElements = document.querySelectorAll('nav, header, .header, #header, .navigation, #navigation, main-nav, .main-nav, #main-nav');
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
            // First, log the page content for debugging
            console.log('Page HTML:', document.body.innerHTML);

            // Hamrobazaar specific selectors - using only valid CSS selectors
            const productSelectors = [
                '.product-card',
                '.grid-cols-2 > div', 
                '[data-testid="product-card"]',
                '.product-item',
                '.MuiGrid-item',
                '.MuiCard-root',
                '[class*="product"]',
                '[class*="card"]'
            ];

            let products = [];
            for (const selector of productSelectors) {
                console.log(`Trying selector: ${selector}`);
                const elements = document.querySelectorAll(selector);
                console.log(`Found ${elements.length} elements with selector ${selector}`);
                
                if (elements.length > 0) {
                    products = Array.from(elements).map(element => {
                        console.log('Processing element:', element.outerHTML);
                        
                        // Title selectors
                        const titleSelectors = ['h2', 'h3', 'h4', '.title', '.name', '[class*="title"]', '[class*="name"]'];
                        let title = '';
                        for (const selector of titleSelectors) {
                            const titleElement = element.querySelector(selector);
                            if (titleElement) {
                                title = titleElement.innerText.trim();
                                break;
                            }
                        }
                        
                        // Price selectors
                        const priceSelectors = [
                            '.price', 
                            '[class*="price"]', 
                            '[class*="amount"]',
                            'span[class*="rs"]',
                            'span[class*="RS"]',
                            'span[class*="price"]'
                        ];
                        let price = '';
                        for (const selector of priceSelectors) {
                            const priceElement = element.querySelector(selector);
                            if (priceElement) {
                                price = priceElement.innerText.trim();
                                break;
                            }
                        }
                        
                        // If no price found through selectors, try to find price in text content
                        if (!price) {
                            const text = element.textContent;
                            const priceMatch = text.match(/Rs\.?\s*[\d,]+|₹\s*[\d,]+/);
                            if (priceMatch) {
                                price = priceMatch[0];
                            }
                        }
                        
                        // Image selectors
                        const imageSelectors = ['img', '[class*="image"] img'];
                        let image = '';
                        for (const selector of imageSelectors) {
                            const imageElement = element.querySelector(selector);
                            if (imageElement) {
                                image = imageElement.src || imageElement.getAttribute('data-src') || '';
                                break;
                            }
                        }
                        
                        // Link - either direct or parent
                        const link = element.querySelector('a')?.href || element.closest('a')?.href || '';

                        console.log({title, price, image, link});
                        
                        return { title, price, image, link };
                    }).filter(product => product.title || product.price || product.image);
                    
                    if (products.length > 0) {
                        console.log(`Successfully found ${products.length} products with selector ${selector}`);
                        break;
                    }
                }
            }
            
            // If no products found, try a more aggressive approach
            if (products.length === 0) {
                console.log('No products found with standard selectors, trying fallback approach');
                
                // Look for any elements with price-like text
                const allElements = document.querySelectorAll('*');
                const candidates = Array.from(allElements).filter(el => {
                    const text = el.textContent;
                    return text.includes('Rs.') || text.includes('₹') || /\d+,\d+/.test(text);
                });
                
                products = candidates.map(el => {
                    const img = el.querySelector('img');
                    const link = el.querySelector('a');
                    if (img) {
                        return {
                            title: el.textContent.split('\n')[0].trim(),
                            price: (el.textContent.match(/Rs\.?\s*[\d,]+|₹\s*[\d,]+/) || [''])[0],
                            image: img.src || img.getAttribute('data-src') || '',
                            link: link?.href || ''
                        };
                    }
                    return null;
                }).filter(Boolean);
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
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-accelerated-2d-canvas',
            '--disable-blink-features=AutomationControlled',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-component-extensions-with-background-pages',
            '--disable-extensions',
            '--disable-features=TranslateUI,BlinkGenPropertyTrees',
            '--disable-ipc-flooding-protection',
            '--disable-renderer-backgrounding',
            '--enable-features=NetworkService,NetworkServiceInProcess',
            '--force-color-profile=srgb',
            '--metrics-recording-only',
            '--no-first-run',
            '--password-store=basic'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Enhanced page settings
        await page.setViewport({ width: 1920, height: 1080 });
        
        // More realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Increase default timeout
        await page.setDefaultTimeout(60000); // 60 seconds
        
        // Enhanced headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1'
        });

        // Modify WebDriver flags
        await page.evaluateOnNewDocument(() => {
            delete Object.getPrototypeOf(navigator).webdriver;
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            window.navigator.chrome = {
                runtime: {},
            };
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
        });

        // Enhanced navigation with progressive timeout
        console.log(`Navigating to ${url}...`);
        let navigationSuccess = false;
        let retryCount = 0;
        const maxRetries = 3;
        let timeout = 30000; // Start with 30 seconds

        while (!navigationSuccess && retryCount < maxRetries) {
            console.log("Retry count is: ", retryCount);
            try {
                console.log("Navigating to URL");
                await page.goto(url, { 
                    waitUntil: ['domcontentloaded', 'networkidle2'],
                    timeout: timeout
                });

                navigationSuccess = true;
            } catch (error) {
                retryCount++;
                console.log(`Navigation attempt ${retryCount} failed. ${maxRetries - retryCount} attempts remaining.`);
                
                if (retryCount === maxRetries) {
                    throw new Error(`Failed to navigate after ${maxRetries} attempts: ${error.message}`);
                }
                
                // Clear browser data
                const client = await page.target().createCDPSession();
                await client.send('Network.clearBrowserCookies');
                await client.send('Network.clearBrowserCache');
                
                // Increase timeout progressively
                timeout += 15000;
                await delay(10000); // Increased delay between retries
            }
        }

        // Check for Cloudflare
        const hasCloudflare = await hasCloudflareProtection(page);
        if (hasCloudflare) {
            console.log('Detected Cloudflare protection, attempting to bypass...');
            await waitForCloudflareToPass(page);
        }

        // Wait for the page to be fully loaded
        await page.waitForFunction(() => document.readyState === 'complete');
        await delay(3000); // Additional wait for dynamic content

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
        
        // Wait for search element with retry
        let searchElement = null;
        retryCount = 0;
        while (!searchElement && retryCount < 3) {
            try {
                searchElement = await page.waitForSelector(searchElements.searchSelector, { 
                    timeout: 5000,
                    visible: true 
                });
            } catch (error) {
                retryCount++;
                await delay(2000);
            }
        }

        if (!searchElement) {
            throw new Error('Search element not found after retries');
        }

        // Type with human-like delays
        for (const char of searchTerm) {
            await page.type(searchElements.searchSelector, char);
            await delay(Math.random() * 100 + 50);
        }

        // Submit search with fallback options
        console.log('Submitting search...');
        if (searchElements.submitSelector) {
            await Promise.any([
                page.click(searchElements.submitSelector),
                page.keyboard.press('Enter')
            ]);
        } else {
            await page.keyboard.press('Enter');
        }

        // Wait for search results with longer timeout
        // try {
        //     await page.waitForNavigation({ 
        //         waitUntil: ['domcontentloaded', 'networkidle2'],
        //         timeout: 20000 
        //     });
        // } catch (error) {
        //     console.log(error)
        //     console.log('Navigation timeout after search, continuing...');
        // }

        try {
            // Try multiple strategies to detect search completion
            await Promise.race([
                // Strategy 1: Wait for URL change
                page.waitForFunction(
                    () => window.location.href.includes('search') || 
                          window.location.href.includes('q='),
                    { timeout: 30000 }
                ),

                
                
                // Strategy 2: Wait for results container
                page.waitForFunction(
                    () => {
                        const possibleSelectors = [
                            '.search-results',
                            '.product-grid',
                            '.MuiGrid-root',
                            '[data-testid="search-results"]',
                            '.grid-cols-2'
                        ];
                        return possibleSelectors.some(selector => 
                            document.querySelector(selector) !== null
                        );
                    },
                    { timeout: 30000 }
                ),
                
                // Strategy 3: Wait for network idle
                page.waitForFunction(
                    () => !document.querySelector('.loading-indicator'),
                    { timeout: 30000 }
                )
            ]);
            
            // Additional wait for content to stabilize
            await delay(5000);
            
            // Take screenshot for debugging
            await page.screenshot({ path: 'after-search.png' });
            
            // Log current URL and page content
            const currentUrl = await page.url();
            console.log('Current URL after search:', currentUrl);
            
        } catch (error) {
            console.error('Search completion detection failed:', error);
            // Continue anyway as the content might still be accessible
        }

        

        // Wait for any dynamic content
        await delay(5000);
        
        console.log('Extracting search results...');
        const results = await extractSearchResults(page);
        console.log("Results are: ", results);
        return results;

    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
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