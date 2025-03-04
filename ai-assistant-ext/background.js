chrome.action.onClicked.addListener(async (tab) => {
    if (chrome.sidePanel) {
        await chrome.sidePanel.open({ tabId: tab.id });
    } else {
        console.error("Side Panel API is not available.");
    }
});
