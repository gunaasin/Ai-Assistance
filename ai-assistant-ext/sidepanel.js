import {saveSummary} from "./savedItems.js";
;

function homeHtmlRender(){
    document.querySelector(".content").innerHTML =  `
    <div class="summarize-container">
        <h2 class="gradient-text_anim ">AI Research Assistant</h2>
        <div class="outer-cont flex" id="summarizeBtn">
            <svg
                viewBox="0 0 24 24"
                height="14"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g fill="none">
                <path
                    d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                ></path>
                <path
                    d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                    fill="currentColor"
                ></path>
                </g>
            </svg>
            Summarize
            </div>
         
    </div>
    <div id="results" class="results"></div>
    `
}

export function homeRender(){
    homeHtmlRender();
    document.getElementById("summarizeBtn").addEventListener("click", summarizeText);
}

function loderRender(){
    const container = document.getElementById("results");
    container.innerHTML = "";
    container.innerHTML =  `
    <div class="loderContiner">
    <div class="loader">
        <div class="box">
          <div class="logo">
            <img src="./g-logo.png" alt="logo" class="logo-img" />
          </div>
        </div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </div>
    </div>
    `
}


 async function summarizeText() {
    const container = document.getElementById("results");
        try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString(),
        });

        if (!result) {
            document.getElementById("results").innerText = "Please select some text first . . . .";
            return;
        }
        loderRender();
        const response = await fetch("http://localhost:8080/api/v1/getContent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: result, operation: "summarize" }),
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const content = await response.text();
        container.innerHTML = "";
        showResult(content);
       

    } catch (error) {
        document.getElementById("results").innerText = "Error: " + error.message;
    }
}


// function showResult(content) {
//     const resultContainer = document.getElementById("results");

//     // Format content into a bullet list
//     const formattedContent = formatResponse(content);

//     // Create the result item container
//     resultContainer.innerHTML = `
//         <div class="result-item">
//             <ul class="result-list">${formattedContent}</ul>
//             <button id="saveBtn" class="save-btn">Save</button>
//         </div>
//     `;

//     // Attach event listener to the save button
//     document.getElementById("saveBtn").addEventListener("click", () => {
//         saveSummary(content);
//     });
// }

// // Function to format response into a structured bullet list
// function formatResponse(responseText) {
//     return responseText
//         .split('*')  // Split at '*'
//         .filter(point => point.trim() !== "") // Remove empty entries
//         .map(point => {
//             // Check if the point contains **bold text** and a colon
//             const match = point.match(/\*\*(.*?)\*\*: (.+)/);
//             if (match) {
//                 return `<li><strong>${match[1]}</strong>: ${match[2]}</li>`; // Format bold text properly
//             }
//             return `<li>${point.trim()}</li>`; // Otherwise, return normal point
//         })
//         .join('');
// }

function showResult(content) {
    const resultContainer = document.getElementById("results");
    const formattedContent = formatResponse(content);
    resultContainer.innerHTML = `
        <div class="result-item">
            ${formattedContent}    
            <button id="saveBtn" class="save-btn">
            <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="25"
                    height="20"
                    class="icon"
                >
                    <path
                    d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
                    ></path>
                </svg>
                </div>
            </div>
            <span>Save</span>
            </button>

        </div>
    `;

    document.getElementById("saveBtn").addEventListener("click", () => {
        saveSummary(content);
    });
}

export function formatResponse(responseText) {
   
    const lines = responseText.split("\n").filter(line => line.trim() !== "");

    if (lines.some(line => line.trim().match(/^(\*|-|\d+\.|`?\*?)/))) {
        // Convert into a bullet list
        return `<ul class="result-list">` +
            lines.map(line => {
                // Remove leading bullet markers (`*`, `-`, `1.`, or `*` inside backticks)
                const cleanLine = line.replace(/^(`?\*?-?\d*\.?\s?`?)/, "").trim();
                return `<li>${cleanLine}</li>`;
            }).join('') +
            `</ul>`;
    } else {
       
        return `<p class="result-text">${responseText}</p>`;
    }
}
