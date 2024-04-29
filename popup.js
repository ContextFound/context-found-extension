document.getElementById('save').addEventListener('click', function() {
    const apiKey = document.getElementById('apikey').value;
    chrome.storage.local.set({openAIKey: apiKey}, function() {
        console.log('API Key saved');
    });
});

document.getElementById('send').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        console.log('Send pushed');
        chrome.scripting.executeScript({target: {tabId: tab.id}, function: function() {
            return window.getSelection().toString();
        }}, function(selection) {
            const context = (selection && selection.length > 0) ? selection[0].result : window.location.href; // Get selected text or URL
            chrome.storage.local.get(['openAIKey'], function(result) {
                if (result.openAIKey) {
                    const message = document.getElementById('input').value;
                    // Display user's input in chat
                    const userInput = document.createElement('p');
                    userInput.textContent = 'You: ' + message;
                    document.getElementById('chat').appendChild(userInput);
                    console.log('User prompt: ' + message);
                    const systemPrompt = 'You are an agent in a Chrome browser extension sidebar whose role is helping the user with their request, using the contents of the web page they are looking at as context. The users input follows: ';
                    console.log('Calling API');
                    fetch('https://api.openai.com/v1/engines/gpt-4-turbo/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + result.openAIKey
                    },
                    body: JSON.stringify({
                        model: 'gpt-4-turbo',
                        prompt: systemPrompt + ' ' + message + ' ' + context,
                        max_tokens: 150,
                        temperature: 0.6
                    })
                    }).then(response => response.json())
                    .then(data => {
                        console.log('API Response');
                        if (!data.choices || data.choices.length === 0) {
                            console.error('No choices available in the API response.');
                            return;
                        }
                        const chat = document.getElementById('chat');
                        const responseText = document.createElement('p');
                        responseText.textContent = 'AI: ' + data.choices[0].text;
                        chat.appendChild(responseText);
                        document.getElementById('input').value = ''; // Clear input field
                    });
                } else {
                    alert('API Key is not set. Please enter your API key.');
                }
            });
        });
    });
});

document.getElementById('helloButton').addEventListener('click', function() {
    console.log('Hello pushed');
    const chat = document.getElementById('chat');
    const helloText = document.createElement('p');
    helloText.textContent = 'Hello world';
    chat.appendChild(helloText);
});


