async function findAndFilterElements(page) {
    return await page.evaluate(() => {
      // List of target classes to match
      const targetClasses = ['product-list', 'item-list', 'product', 'item'];
  
      // Find all matching elements
      const elements = Array.from(document.querySelectorAll('*'))
        .filter(element =>
          targetClasses.some(targetClass => element.classList.contains(targetClass))
        );
  
      // Process each element
      return elements.map(element => {
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true);
  
        // Remove <img> tags
        const imgTags = clonedElement.querySelectorAll('img');
        imgTags.forEach(img => img.remove());
  
        // Keep only the 'class' attribute
        Array.from(clonedElement.attributes).forEach(attr => {
          if (attr.name !== 'class') {
            clonedElement.removeAttribute(attr.name);
          }
        });
  
        // Return the cleaned inner HTML
        return clonedElement.outerHTML;
      });
    });
  }
  