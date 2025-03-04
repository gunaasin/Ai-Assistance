import { homeRender } from "./sidepanel.js";
import { savedItem } from "./savedItems.js";

document.getElementById("home").addEventListener("click", () => {
    homeRender();
})

document.getElementById("savedNotes").addEventListener("click", () => {
    savedItem();
})


homeRender();
