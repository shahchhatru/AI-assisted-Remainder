// Function to find input[type="search"] and return its attributes
async function findSearchInput(page) {
    const searchInputHandle = await page.$('input[type="search"]');
    if (searchInputHandle) {
      // Extract attributes using page.evaluate
      const attributes = await page.evaluate(input => {
        const attrs = {};
        for (const attr of input.attributes) {
          attrs[attr.name] = attr.value;
        }
        return attrs;
      }, searchInputHandle);
  
      return { exists: true, attributes };
    }
    return { exists: false };
  }