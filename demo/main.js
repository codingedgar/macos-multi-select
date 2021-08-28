import { multiselect, Context } from '../dist/index'

let context = {
  index: [],
  selected: [],
  adjacentPivot: undefined
}

let shiftPressed = false;
let controlPressed = false;

/**
 * 
 * @param {Context} command 
 */
function update(command) {
  context = multiselect(context, command);

  context.index.forEach(key => {
    const row = document.getElementById(key);
    if (context.selected.indexOf(key) !== -1) {
      row.classList.add("selected");
    } else {
      row.classList.remove("selected");
    }
  })
}

var list = document.getElementById("list");

window.onkeydown = (e => {
  if (e.key === "Meta" || e.key === "Control") {
    controlPressed = true
  }
  if (e.key === "Shift") {
    shiftPressed = true
  }
  if (shiftPressed && e.key === "ArrowDown") {
    update({
      type: "SELECT NEXT ADJACENT"
    });
  } else if (shiftPressed && e.key === "ArrowUp") {
    update({
      type: "SELECT PREVIOUS ADJACENT"
    });
  } else if (e.key === "ArrowDown") {
    update({
      type: "SELECT NEXT"
    });
  } else if (e.key === "ArrowUp") {
    update({
      type: "SELECT PREVIOUS"
    });
  }
})


window.onkeyup = (e => {
  if (e.key === "Meta" || e.key === "Control") {
    controlPressed = false
  }
  if (e.key === "Shift") {
    shiftPressed = false
  }
})

for (let index = 0; index < 10; index++) {
  var item = document.createElement("li");
  item.id = index;
  item.onclick = (e) => {
    if (controlPressed) {
      update({
        type: "TOGGLE SELECTION",
        id: index.toString()
      })
    } else if (shiftPressed) {
      update({
        type: "SELECT ADJACENT",
        id: index.toString()
      })
    } else {
      update({
        type: "SELECT ONE",
        id: index.toString()
      })
    }
  }
  const span = document.createElement("span");
  span.innerHTML = `Row ${index}`;
  item.appendChild(span);
  list.appendChild(item);
  context.index.push(index.toString());
}
