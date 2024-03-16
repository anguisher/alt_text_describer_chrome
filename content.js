function showModalMessage(message) {
  let modal = document.getElementById('extensionModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'extensionModal';
    modal.style.position = 'fixed';
    modal.style.zIndex = '10000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.cursor = 'pointer';

    const modalContent = document.createElement('div');
    modalContent.style.padding = '20px';
    modalContent.style.position = 'relative';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '5px';
    modalContent.style.margin = 'auto';
    modalContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    modalContent.style.display = 'inline-block';
    modalContent.style.maxWidth = '600px';
    modalContent.style.minWidth = '200px';
    modalContent.style.cursor = 'auto';
    modalContent.onclick = function(e) {
      e.stopPropagation();
    };
    modalContent.setAttribute('style', 'color: #000 !important;');

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-40px';
    closeButton.style.right = '-20px';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '32px';
    closeButton.style.fontWeight = '700';

    closeButton.onclick = function () {
      modal.style.display = 'none';
    };

    const messageDiv = document.createElement('div');
    messageDiv.id = 'modal-message';
    messageDiv.innerText = message;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(messageDiv);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.onclick = function () {
      modal.style.display = 'none';
    };
  } else {
    document.getElementById('modal-message').innerText = message;
    modal.style.display = 'flex';
  }
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'showModal') {
    showModalMessage(message.message);
  }
  if (message.type === "copyText") {
    if(message.message.status == "success")
        navigator.clipboard.writeText(message.message.content).then(() => {
            showModalMessage("Description has been copied to clipboard. \n \n"+message.message.content);
        }, err => {
            showModalMessage("Could not copy text. <br/>"+err);
        });
    else
        showModalMessage(message.message.content);
  }
});
