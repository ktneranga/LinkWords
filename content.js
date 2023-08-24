let processParent = '';
let isLoading = false;
let addCommentButton = '';

const processPost = (event, parentForm) => {
    const parentElement = event.currentTarget.closest('.feed-shared-update-v2');
    processParent = parentForm;
    if (parentElement) {
        isLoading = true;

        if (isLoading) {
            event.currentTarget.classList.add('loading-animation');
        }

        addCommentButton = event.currentTarget;

        const elements = parentElement.getElementsByClassName('feed-shared-update-v2__description-wrapper');
        const text = elements[0].innerText.replace('…see more', '');

        chrome.runtime.sendMessage({
            postText: text,
            parentForm,
        });
    }
};

document.addEventListener('focusin', function (event) {
    if (event.target.classList.contains('ql-editor')) {
        const parentForm = event.target.closest('.comments-comment-texteditor');
        if (parentForm && !parentForm.classList.contains('buttons-appended')) {
            parentForm.classList.add('buttons-appended');
            const generateBtn = document.createElement('button');
            generateBtn.classList.add('rounded-button');
            generateBtn.innerText = 'Generate';
            parentForm.appendChild(generateBtn);

            generateBtn.addEventListener('click', (event) => {
                processPost(event, parentForm);
            });
        } else {
            console.log("No parent with the class comments-comment-texteditor' found for the focused element.");
        }
    }
});

let link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', chrome.runtime.getURL('styles.css'));

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.comment && processParent) {
        isLoading = false;
        addCommentButton.classList.remove('loading-animation');

        const commentField = processParent.querySelector('.ql-editor.ql-blank p');
        commentField.innerText = request.comment;
    }
    return Promise.resolve('Dummy response to keep the console quiet');
});
