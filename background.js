const processGenerateCommentRequest = async (request) => {
    const config = {
        text: request.postText,
    };

    let response = {};

    try {
        const res = await fetch(`http://localhost:3000/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        });

        const data = await res.json();
        const { content } = await data.message;
        console.log(content);

        response = {
            comment: content,
            parentForm: request.parentForm,
        };

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        if (tabs && tabs.length > 0) {
            await chrome.tabs.sendMessage(tabs[0].id, response);
        } else {
            console.log('No active tab found');
        }
    } catch (error) {
        console.log(error);
    }
    return Promise.resolve('Dummy response to keep the console quiet');
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request) {
        await processGenerateCommentRequest(request);
    }
});
