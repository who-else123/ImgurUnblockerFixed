chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateBadge') {
        if (sender.tab) {
            chrome.action.setBadgeText({ 
                text: message.count.toString(), 
                tabId: sender.tab.id 
            });
            chrome.action.setBadgeBackgroundColor({ 
                color: '#4CAF50',
                tabId: sender.tab.id 
            });
        }
    } 
    else if (message.type === 'incrementTotal') {
        chrome.storage.local.get(['totalProxied'], (result) => {
            const newTotal = (result.totalProxied || 0) + message.amount;
            chrome.storage.local.set({ totalProxied: newTotal });
        });
    }
});