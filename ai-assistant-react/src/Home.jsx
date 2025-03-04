import { useState } from "react";

function Home() {
    const [responses, setResponses] = useState([]);

    const summarizeText = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const [{ result }] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => window.getSelection().toString()
            });

            if (!result) {
                alert("Please select some text first");
                return;
            }

            const response = await fetch("http://localhost:8080/api/research/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: result, operation: "summarize" })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const text = await response.text();
            const formattedText = text.replace(/\n/g, "<br>");

            setResponses((prev) => [...prev, formattedText]);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const saveResponse = (text) => {
        chrome.storage.local.get(["researchNotes"], (result) => {
            const updatedNotes = result.researchNotes ? [...result.researchNotes, text] : [text];
            chrome.storage.local.set({ researchNotes: updatedNotes }, () => {
                alert("Response saved successfully");
            });
        });
    };

    return (
        <div>
            <h2>AI Research Assistant</h2>
            <button onClick={summarizeText}>Summarize</button>

            <div>
                {responses.map((response, index) => (
                    <div key={index} style={{ marginTop: "10px", padding: "5px", border: "1px solid #ccc" }}>
                        <div dangerouslySetInnerHTML={{ __html: response }} />
                        <button onClick={() => saveResponse(response)}>Save</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
