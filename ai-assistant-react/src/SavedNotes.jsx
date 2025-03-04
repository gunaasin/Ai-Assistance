import { useEffect, useState } from "react";

function SavedNotes() {
    const [savedNotes, setSavedNotes] = useState([]);

    useEffect(() => {
        chrome.storage.local.get(["researchNotes"], (result) => {
            if (result.researchNotes) {
                setSavedNotes(result.researchNotes);
            }
        });
    }, []);

    return (
        <div>
            <h2>Saved Notes</h2>
            {savedNotes.length === 0 ? (
                <p>No saved notes yet.</p>
            ) : (
                savedNotes.map((note, index) => (
                    <div key={index} style={{ marginTop: "10px", padding: "5px", border: "1px solid #ccc" }}>
                        <div dangerouslySetInnerHTML={{ __html: note }} />
                    </div>
                ))
            )}
        </div>
    );
}

export default SavedNotes;
