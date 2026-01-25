const imgurRegex = /^https?:\/\/(\w+\.)?imgur\.com\/.*/;
let pageCount = 0;
const processedElements = new Set();

function checkRedirect() {
    const url = new URL(window.location.href);
    if (url.hostname === 'external-content.duckduckgo.com') {
        const originalUrl = url.searchParams.get('u');
        if (originalUrl && imgurRegex.test(originalUrl)) {
            pageCount++;
            
            chrome.runtime.sendMessage({
                type: 'updateBadge',
                count: pageCount
            });

            chrome.runtime.sendMessage({
                type: 'incrementTotal',
                amount: 1
            });
        }
    }
}

function processImages() {
    const images = document.querySelectorAll('img');
    let newCount = 0;

    images.forEach(img => {
        if (processedElements.has(img)) return;

        if (imgurRegex.test(img.src)) {
            processedElements.add(img);
            newCount++;
        }
    });

    if (newCount > 0) {
        pageCount += newCount;
        
        chrome.runtime.sendMessage({
            type: 'updateBadge',
            count: pageCount
        });

        chrome.runtime.sendMessage({
            type: 'incrementTotal',
            amount: newCount
        });
    }
}

checkRedirect();
processImages();

const observer = new MutationObserver(processImages);
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
});