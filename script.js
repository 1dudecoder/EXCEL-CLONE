let body = document.querySelector("body");
body.spellcheck = false;

let menuBarPtags = document.querySelectorAll(".menu-bar p");
let columnTags = document.querySelector(".column-tags");
let rownumbers = document.querySelector(".row-numbers");
let grid = document.querySelector(".grid");
let mycells = document.querySelector(".mycells");

let blankcornver = document.querySelector

for (let i = 0; i < menuBarPtags.length; i++) {
  menuBarPtags[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
      e.currentTarget.classList.remove("menu-bar-option-selected");
    } else {

        for(let j = 0;j<menuBarPtags.length;j++){
            if(menuBarPtags[j].classList.contains("menu-bar-option-selected"))
            menuBarPtags[j].classList.remove("menu-bar-option-selected")
        }

      e.currentTarget.classList.add("menu-bar-option-selected");
    }
  });
}


for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.classList.add("column-tag-cell");
  div.innerText = String.fromCharCode(65 + i);
  columnTags.append(div);
}


for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.classList.add("row-tag-cell");
  div.innerText = i;
  rownumbers.append(div);
}


for (let j = 1; j <= 100; j++) {
  let row = document.createElement("div");
  row.classList.add("row");

  for (let i = 0; i < 26; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.contentEditable = true;
    row.append(cell);
  }
  mycells.append(row)
}