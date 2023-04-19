async function clearInput(chatInput) {
  chatInput.value = "";
  chatInput.focus();
}

window.addEventListener("load", function () {
  let toggleButton = document.createElement("button");
  let chatContainer = document.createElement("section");
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

  chatContainer.style.cssText = `z-index: 99999; overflow: hidden; width: 300px; height: 434px; border-radius: 20px; position: fixed; bottom: 109px; right: 32px; display: none; flex-direction: column; background: #fff; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.1);`;

  toggleButton.addEventListener("click", () => {
    if (chatContainer.style.display === "none") {
      chatContainer.style.display = "flex";
    } else {
      chatContainer.style.display = "none";
    }
  });

  const iframe = document.createElement("iframe");
  iframe.setAttribute("id", "sitegpt-bot-ui");
  iframe.src =
    "https://widget.sitegpt.ai/c/360485494599975514?tid=93ba86d1-3827-4664-9310-ddb3806c7b12&color=%232563eb";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.zIndex = "1000";
  iframe.style.border = "none";
  iframe.style.width = "100%";
  iframe.style.bottom = window.innerWidth < 640 ? "0" : "80px";
  iframe.style.right = window.innerWidth < 640 ? "0" : "16px";
  iframe.style.width = window.innerWidth < 640 ? "100%" : "448px";
  iframe.style.height = window.innerWidth < 640 ? "100%" : "90dvh";
  iframe.style.borderRadius = window.innerWidth < 640 ? "0" : "0.75rem";
  iframe.style.boxShadow =
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
  iframe.style.zIndex = "9999999";
  iframe.style.display = "none";
  chatContainer.appendChild(iframe);

  document.body.appendChild(toggleButton);
  document.body.appendChild(chatContainer);
});
