// I'm too lazy to set this for every disabled page.

let disabledElements = document.getElementsByClassName("disabled");
for (let i = 0; i < disabledElements.length; i++) {
    disabledElements[i].setAttribute("title", "This page is not currently enabled. :(");
}