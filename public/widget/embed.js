function getURL() {
  return new URL(window.location.href).hostname;
}

function getChatBot(chatHeaderTitle) {
  const website_link = getURL();

  fetch(`https://app.suportal.co/api/chat/${website_link}`)
    .then((res) => res.json())
    .then((res) => {
      chatHeaderTitle.textContent = res.chatbot.title;
    })
    .catch((err) => {
      chatHeaderTitle.textContent = "Chat";
    });
}

function sendMessage(
  chatInput,
  chatList,
  message,
  actionButton,
  chatContainer
) {
  const chatSender = document.createElement("div");
  chatSender.classList.add("chat-message");
  chatSender.style.cssText = `background-color: #007AFF; color: #fff; font-family: "SuportalMedium", sans-serif; font-weight: medium; align-self: flex-end; margin: 4px 0px 8px 0px;`;
  chatSender.textContent = message;
  chatList.appendChild(chatSender);

  const website_link = getURL();

  actionButton.disabled = true;

  const chatReply = document.createElement("div");
  chatReply.classList.add("chat-message");
  chatReply.style.cssText = `background: #E8E8EB; color: #000; font-family: "SuportalMedium", sans-serif; font-weight: medium; align-self: flex-start; margin: 4px 0px 8px 0px;`;
  chatReply.textContent = "Typing...";
  chatList.appendChild(chatReply);

  fetch("https://app.suportal.co/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      website_link,
    }),
  })
    .then((response) => {
      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      const processStream = ({ done, value }) => {
        if (done) {
          return;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (chunk === ".\n") console.log({ chunk });

        if (chatReply.textContent === "Typing...") {
          chatReply.textContent = chunk;
        } else {
          const chunkArray = chunk.split("\n");
          for (let i = 0; i < chunkArray.length; i++) {
            const message = chunkArray[i];
            if (message === "") {
              continue;
            }
            const messageNode = document.createTextNode(message);
            chatReply.appendChild(messageNode);
            if (i < chunkArray.length - 1) {
              const br = document.createElement("br");
              chatReply.appendChild(br);
            }
          }
        }

        chatList.scrollTop = chatList.scrollHeight;
        chatContainer.scrollTop = chatContainer.scrollHeight;

        return reader.read().then(processStream);
      };

      return reader.read().then(processStream);
    })
    .catch(() => {
      actionButton.disabled = false;
      chatReply.textContent =
        "Sorry, there was an error while processing your request. Please try again later or contact support if the problem persists.";
    });

  actionButton.disabled = false;

  clearInput(chatInput);
}

async function clearInput(chatInput) {
  chatInput.value = "";
  chatInput.focus();
}

window.addEventListener("load", function () {
  let font = document.createElement("style");
  const fontFace = `
         @font-face {
            font-family: "SuportalBold";
            src: url("https://app.suportal.co/fonts/GTWalsheimPro-Bold.ttf") format("truetype");
            font-weight: bold;
            font-style: normal;
         }
         
         @font-face {
            font-family: "SuportalMedium";
            src: "https://app.suportal.co/fonts/GTWalsheimPro-Medium.ttf";
            font-weight: bold;
            font-style: normal;
         }

         .chat-message {
            margin: 5px;
            box-sizing: border-box;
            padding: 12px;
            border-radius: 17px;
            max-width: 90%;
            animation: slide-up 0.3s ease-in-out;
            word-wrap: break-word;
            font-size: 14px;
        }

         @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
  font.appendChild(document.createTextNode(fontFace));

  document.head.appendChild(font);

  let toggleButton = document.createElement("button");
  let chatContainer = document.createElement("section");
  let chatHeader = document.createElement("div");
  let chatBody = document.createElement("div");
  let chatList = document.createElement("div");
  let chatInputContainer = document.createElement("div");
  let chatInput = document.createElement("textarea");
  let chatActionButton = document.createElement("button");
  let chatFooterContainer = document.createElement("div");
  let chatFooterText = document.createElement("p");
  let chat = document.createElement("div");
  let chatFooterLogoContainer = document.createElement("a");
  let chatFooterLogo = `<svg width="52" height="15" viewBox="0 0 844 247" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M319.967 173.015C310.496 173.015 302.8 170.592 296.88 165.746C290.96 160.9 288 154.977 288 147.977H305.598C305.598 151.208 306.997 153.846 309.796 155.892C312.702 157.938 316.415 158.962 320.936 158.962C324.273 158.962 326.91 158.154 328.847 156.538C330.785 154.923 331.753 152.769 331.753 150.077C331.753 145.769 329.87 143.131 326.102 142.162L306.728 136.831C295.857 133.815 290.422 126.869 290.422 115.992C290.422 109.746 293.113 104.523 298.494 100.323C303.876 96.0154 310.818 93.8615 319.322 93.8615C328.901 93.8615 336.22 96.0154 341.279 100.323C346.445 104.631 349.029 110.285 349.029 117.285H331.753C331.753 114.162 330.569 111.738 328.201 110.015C325.941 108.185 322.766 107.269 318.676 107.269C315.554 107.269 312.971 108.023 310.926 109.531C308.881 110.931 307.858 112.762 307.858 115.023C307.858 119.115 310.011 121.808 314.317 123.1L332.238 128.269C337.404 129.777 341.602 132.362 344.831 136.023C348.06 139.577 349.674 143.723 349.674 148.462C349.674 155.785 347.037 161.708 341.763 166.231C336.597 170.754 329.332 173.015 319.967 173.015Z" fill="black"/>
      <path d="M389.719 173.015C381.216 173.015 374.435 170.485 369.376 165.423C364.318 160.362 361.788 152.931 361.788 143.131V95.8H379.386V138.769C379.386 145.123 380.57 149.915 382.938 153.146C385.306 156.377 389.235 157.992 394.724 157.992C401.075 157.992 405.703 156.215 408.609 152.662C411.515 149 412.968 144.208 412.968 138.285V95.8H430.566V171.077H412.968V160.577C408.34 168.869 400.59 173.015 389.719 173.015Z" fill="black"/>
      <path d="M491.037 93.8615C501.801 93.8615 510.465 97.5231 517.031 104.846C523.597 112.062 526.88 121.592 526.88 133.438C526.88 145.069 523.435 154.6 516.547 162.031C509.658 169.354 500.778 173.015 489.907 173.015C484.956 173.015 480.274 171.938 475.861 169.785C471.448 167.523 468.111 164.562 465.851 160.9V205H448.253V95.8H465.851V105.977C468.111 102.315 471.556 99.4077 476.184 97.2538C480.812 94.9923 485.763 93.8615 491.037 93.8615ZM487.324 157.346C493.782 157.346 499.056 155.138 503.146 150.723C507.236 146.2 509.281 140.438 509.281 133.438C509.281 126.438 507.236 120.731 503.146 116.315C499.056 111.792 493.782 109.531 487.324 109.531C480.651 109.531 475.269 111.738 471.179 116.154C467.089 120.569 465.044 126.331 465.044 133.438C465.044 140.546 467.089 146.308 471.179 150.723C475.269 155.138 480.651 157.346 487.324 157.346Z" fill="black"/>
      <path d="M601.922 161.869C594.818 169.3 585.185 173.015 573.022 173.015C560.859 173.015 551.172 169.3 543.961 161.869C536.857 154.331 533.305 144.854 533.305 133.438C533.305 122.023 536.857 112.6 543.961 105.169C551.172 97.6308 560.859 93.8615 573.022 93.8615C585.185 93.8615 594.818 97.6308 601.922 105.169C609.133 112.6 612.739 122.023 612.739 133.438C612.739 144.854 609.133 154.331 601.922 161.869ZM556.715 150.723C560.698 155.138 566.133 157.346 573.022 157.346C579.91 157.346 585.292 155.138 589.167 150.723C593.149 146.308 595.141 140.546 595.141 133.438C595.141 126.331 593.149 120.569 589.167 116.154C585.292 111.738 579.91 109.531 573.022 109.531C566.133 109.531 560.698 111.738 556.715 116.154C552.841 120.569 550.903 126.331 550.903 133.438C550.903 140.546 552.841 146.308 556.715 150.723Z" fill="black"/>
      <path d="M624.771 171.077V95.8H642.369V110.338C643.661 105.277 646.19 101.454 649.957 98.8692C653.724 96.1769 657.868 94.8308 662.389 94.8308C665.295 94.8308 667.609 95.0462 669.331 95.4769V111.631C667.502 111.415 665.187 111.308 662.389 111.308C656.146 111.308 651.249 113.623 647.697 118.254C644.145 122.777 642.369 129.292 642.369 137.8V171.077H624.771Z" fill="black"/>
      <path d="M716.272 156.215C719.824 156.215 722.784 156 725.152 155.569V171.077C721.492 171.723 717.133 172.046 712.074 172.046C709.168 172.046 706.639 171.831 704.486 171.4C702.333 170.969 699.804 170 696.898 168.492C693.992 166.877 691.731 164.131 690.117 160.254C688.502 156.377 687.695 151.477 687.695 145.554V110.5H674.94V95.8H687.695V73.0231H705.293V95.8H722.569V110.5H705.293V141.515C705.293 147.546 706.154 151.531 707.877 153.469C709.599 155.3 712.397 156.215 716.272 156.215Z" fill="black"/>
      <path d="M767.021 173.015C755.289 173.015 746.193 169.3 739.735 161.869C733.277 154.438 730.048 144.962 730.048 133.438C730.048 122.023 733.439 112.6 740.22 105.169C747.001 97.6308 756.096 93.8615 767.505 93.8615C772.564 93.8615 777.192 94.9385 781.39 97.0923C785.588 99.2462 788.817 102.208 791.077 105.977V95.8H808.675V171.077H791.077V160.9C788.924 164.562 785.534 167.523 780.905 169.785C776.385 171.938 771.757 173.015 767.021 173.015ZM769.604 157.346C776.815 157.346 782.305 155.085 786.072 150.562C789.947 146.038 791.884 140.331 791.884 133.438C791.884 126.546 789.947 120.838 786.072 116.315C782.305 111.792 776.815 109.531 769.604 109.531C762.823 109.531 757.441 111.792 753.459 116.315C749.584 120.731 747.646 126.438 747.646 133.438C747.646 140.438 749.584 146.2 753.459 150.723C757.441 155.138 762.823 157.346 769.604 157.346Z" fill="black"/>
      <path d="M826.402 171.077V58H844V171.077H826.402Z" fill="black"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M32.2044 22.4035L110.085 1.50872C137.696 -5.89908 164.817 14.9049 164.817 43.4923V140.33C164.817 159.999 151.61 177.217 132.613 182.313L54.7321 203.208C27.1212 210.616 0 189.812 0 161.225V64.3871C0 44.7183 13.2074 27.5003 32.2044 22.4035Z" fill="url(#paint0_linear_11_69)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M92.8484 63.8192L170.729 42.9244C198.34 35.5166 225.461 56.3206 225.461 84.9079V181.746C225.461 201.414 212.254 218.632 193.257 223.729L115.376 244.624C87.7653 252.032 60.644 231.228 60.644 202.64V105.803C60.644 86.1339 73.8515 68.9159 92.8484 63.8192Z" fill="url(#paint1_linear_11_69)"/>
      <defs>
      <linearGradient id="paint0_linear_11_69" x1="82.4086" y1="0" x2="82.4086" y2="204.717" gradientUnits="userSpaceOnUse">
      <stop/>
      <stop offset="1" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear_11_69" x1="143.053" y1="41.4156" x2="143.053" y2="246.133" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8748FF" stop-opacity="0"/>
      <stop offset="1" stop-color="#8748FF"/>
      </linearGradient>
      </defs>
      </svg>    
    `;
  let chatActionIcon = `<svg width="12" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.14924 0.251051C9.49637 -0.0836838 10.0592 -0.0836838 10.4063 0.251051L15.7397 5.39391C16.0868 5.72864 16.0868 6.27136 15.7397 6.60609L10.4063 11.7489C10.0592 12.0837 9.49637 12.0837 9.14924 11.7489C8.80211 11.4142 8.80211 10.8715 9.14924 10.5368L12.9651 6.85714H0.888889C0.397969 6.85714 0 6.47339 0 6C0 5.52661 0.397969 5.14286 0.888889 5.14286H12.9651L9.14924 1.46323C8.80211 1.1285 8.80211 0.585786 9.14924 0.251051Z" fill="white"/>
    </svg>
    `;
  let closePopupButton = document.createElement("button");
  let closeIcon = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9.03662" width="2.36655" height="12.3061" rx="1.18328" transform="rotate(45 9.03662 0)" fill="#0E123B"/>
    <rect y="1.6736" width="2.36655" height="12.3061" rx="1.18328" transform="rotate(-45 0 1.6736)" fill="#0E123B"/>
    </svg>
    `;

  let chatHeaderTitle = document.createElement("h6");
  chatHeaderTitle.textContent = `Zaap`;
  getChatBot(chatHeaderTitle);
  toggleButton.innerHTML = `<svg width="34" height="34" viewBox="0 0 226 247" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M32.2044 22.4035L110.085 1.50872C137.696 -5.89908 164.817 14.9049 164.817 43.4923V140.33C164.817 159.999 151.61 177.217 132.613 182.313L54.7321 203.208C27.1212 210.616 0 189.812 0 161.225V64.3871C0 44.7183 13.2074 27.5003 32.2044 22.4035Z" fill="url(#paint0_linear_11_40)"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M92.8484 63.8192L170.729 42.9244C198.34 35.5166 225.461 56.3206 225.461 84.9079V181.746C225.461 201.414 212.254 218.632 193.257 223.729L115.376 244.624C87.7653 252.032 60.644 231.228 60.644 202.64V105.803C60.644 86.1339 73.8515 68.9159 92.8484 63.8192Z" fill="url(#paint1_linear_11_40)"/>
    <defs>
    <linearGradient id="paint0_linear_11_40" x1="82.4086" y1="0" x2="82.4086" y2="204.717" gradientUnits="userSpaceOnUse">
    <stop/>
    <stop offset="1" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="paint1_linear_11_40" x1="143.053" y1="41.4156" x2="143.053" y2="246.133" gradientUnits="userSpaceOnUse">
    <stop stop-color="white" stop-opacity="0"/>
    <stop offset="1" stop-color="white"/>
    </linearGradient>
    </defs>
    </svg>
    `;
  toggleButton.style.cssText = `outline: none; border-radius: 16px; border: none; background: #8748FF; height: 60px; width: 60px; transition: 0.3s all; position: fixed; right: 32px; bottom: 32px; cursor: pointer; display: flex; justify-content: center; place-items: center;`;

  chatContainer.style.cssText = `z-index: 999; overflow: hidden; width: 300px; height: 434px; border-radius: 20px; position: fixed; bottom: 109px; right: 32px; display: none; flex-direction: column; background: #fff; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.1);`;

  toggleButton.addEventListener("click", () => {
    if (chatContainer.style.display === "none") {
      chatContainer.style.display = "flex";
    } else {
      chatContainer.style.display = "none";
    }
  });

  chatHeader.style.cssText = `width: 100%; padding: 12px 20px; display: flex; justify-content: space-between; place-items-: center; box-sizing: border-box; border-bottom: 1px solid rgba(0, 0, 0, 0.1); background: #fff;  z-index: 99;`;

  chatHeaderTitle.style.cssText = `font-family: "SuportalBold", sans-serif !important; font-size: 16px; margin: 0px;`;

  closePopupButton.innerHTML = closeIcon;

  closePopupButton.style.cssText = `background: transparent; outline: none; border: none;`;

  closePopupButton.addEventListener("click", () => {
    if (chatContainer.style.display === "flex") {
      chatContainer.style.display = "none";
    }
  });

  chatInputContainer.style.cssText = `padding: 0px 16px 4px 16px; max-height: 58px; position: relative;`;

  chatFooterContainer.style.cssText = `width: 100%; display: flex; justify-content: center; gap: 6px 0px; place-items: center; border-top: 1px solid rgba(0, 0, 0, 0.1); padding: 5px; box-sizing: border-box;`;

  chatFooterLogoContainer.innerHTML = chatFooterLogo;

  chatFooterLogoContainer.setAttribute("href", "https://www.suportal.co");
  chatFooterLogoContainer.setAttribute("target", "_blank");

  chatFooterLogoContainer.style.cssText = `cursor: pointer;`;

  chatFooterText.textContent = "Powered by";

  chatFooterText.style.cssText = `font-family: "SuportalBold", sans-serif; font-weight: bold; margin: 0px 8px 0px 0px; font-size: 11px;`;

  chatFooterContainer.appendChild(chatFooterText);
  chatFooterContainer.appendChild(chatFooterLogoContainer);

  chatBody.style.cssText = `height: 318px; position: relative; transition: 0.5s all; margin-top: 16px; padding: 0px 8px; box-sizing: border-box;`;

  chatList.style.cssText = `display: flex; flex-direction: column; align-items: flex-end; width: auto; max-height: 100%; overflow-y: scroll; margin-bottom: 13px; transition: 0.5s all; position: absolute; bottom: 0px; width: 95%; box-sizing: border-box;`;

  chatList.style.scrollbarWidth = "none !important";
  chatList.style.webkitScrollbar = "none !important";

  chatInput.setAttribute("autofocus", "");
  chatInput.rows = 1;
  chatInput.placeholder = "How can I help?";

  chatInput.style.cssText = `resize: none; width: 1fr; box-sizing: border-box; font-family: "SuportalMedium", sans-serif; font-weight: medium; padding: 10px 16px; outline: none;`;

  chatActionButton.innerHTML = chatActionIcon;

  chatActionButton.style.cssText = `background: #007AFF; border-radius: 50%; display: flex; justify-content: center; place-items: center; outline: none; border: none; height: 28px; width: 28px; cursor: pointer;`;

  chat.style.cssText = `width: 100%; height: 100%; overflow: hidden; border: 2px solid #E8E8EB; border-radius: 25.5px; border-box: box-sizing; display: flex; place-items: center; padding: 5px 7px;`;

  chat.appendChild(chatInput);
  chat.appendChild(chatActionButton);

  chatHeader.appendChild(chatHeaderTitle);
  chatHeader.appendChild(closePopupButton);
  chatInputContainer.appendChild(chat);

  chatActionButton.addEventListener("click", () => {
    sendMessage(
      chatInput,
      chatList,
      chatInput.value,
      chatActionButton,
      chatContainer
    );
  });

  chatBody.appendChild(chatList);
  chatContainer.appendChild(chatHeader);
  chatContainer.appendChild(chatBody);
  chatContainer.appendChild(chatInputContainer);
  chatContainer.appendChild(chatFooterContainer);

  document.body.appendChild(toggleButton);
  document.body.appendChild(chatContainer);
});
