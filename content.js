
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'getContext') {
        let context = window.location.href; // Default to the current URL
        if (window.getSelection().toString()) {
            context = window.getSelection().toString(); // Get selected text if any
        }
        sendResponse({context: context});
    }
});
