import { formatResponse } from "./sidepanel.js";


export function saveSummary(content) {
    chrome.storage.local.get({ savedSummaries: [] }, (result) => {
        const updatedSummaries = [...result.savedSummaries, content];
        console.log(updatedSummaries);
        chrome.storage.local.set({ savedSummaries: updatedSummaries }, () => {
            console.log("Summary saved successfully!");
        });
    });
}

export function savedItem() {
    chrome.storage.local.get({ savedSummaries: [] }, (result) => {
        const container = document.querySelector(".content");
        container.innerHTML = ""; // Clear previous content

        if (result.savedSummaries.length === 0) {
            container.innerHTML = `<p class="noItem">No saved summaries found.</p>`;
            return;
        }

        result.savedSummaries.forEach((summary, index) => {
            const summaryElement = document.createElement("div");
            summaryElement.classList.add("result-item");

            summaryElement.innerHTML = `
                        <div class="result-title"><p>${index + 1}. Summary </p> <button class="deleteBtn">Delete</button></div>
                        <div class="result-content hide">${formatResponse(summary)}</div>
                    `;

            container.appendChild(summaryElement);

            summaryElement.querySelector(".result-title").addEventListener("click", () => {
                const content = summaryElement.querySelector(".result-content");
                content.classList.toggle("show");
            });

            summaryElement.querySelector(".deleteBtn").addEventListener("click", () => {
                deleteSavedItem(index);
            });
        });
    });
}

// Function to delete a saved summary
function deleteSavedItem(index) {
    chrome.storage.local.get({ savedSummaries: [] }, (result) => {
        const updatedSummaries = result.savedSummaries.filter((_, i) => i !== index);
        chrome.storage.local.set({ savedSummaries: updatedSummaries }, () => {
            savedItem(); // Refresh the list after deletion
        });
    });
}
