// @ts-check
import { multiselect, Command } from '../dist/esm/index'

let context = {
  index: [],
  selected: [],
  adjacentPivot: undefined
}

let shiftPressed = false;
let controlPressed = false;
let altPressed = false;

/**
 * 
 * @param {Command} command
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

window.addEventListener("keydown", e => {
  if (e.key === "Meta" || e.key === "Control") {
    controlPressed = true
  }
  if (e.key === "Shift") {
    shiftPressed = true
  }
  if (e.key === "Alt") {
    altPressed = true
  }
  if (shiftPressed && e.key === "ArrowDown") {
    update({
      type: "SELECT NEXT ADJACENT"
    });
  } else if (shiftPressed && e.key === "ArrowUp") {
    update({
      type: "SELECT PREVIOUS ADJACENT"
    });
  } else if (e.key === "ArrowUp") {
    update({
      type: "SELECT PREVIOUS"
    });
  } else if (e.key === "ArrowDown") {
    update({
      type: "SELECT NEXT"
    });
  } else if (e.key === "a" && controlPressed && altPressed) {
    e.preventDefault();
    e.stopPropagation();
    update({
      type: "DESELECT ALL"
    });
  } else if (e.key === "a" && controlPressed) {
    e.preventDefault();
    e.stopPropagation();
    update({
      type: "SELECT ALL"
    });
  }
}, true);


window.onkeyup = (e => {
  if (e.key === "Meta" || e.key === "Control") {
    controlPressed = false;
  }
  if (e.key === "Shift") {
    shiftPressed = false;
  }

  if (e.key === "Alt") {
    altPressed = false;
  }
})

for (let index = 0; index < 10; index++) {
  var item = document.createElement("li");
  item.id = index.toString();
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

const buttons = document.getElementById("buttons");
const deselectAllButton = document.createElement("button");
deselectAllButton.innerText = "Deselect All (command + alt + a)";
deselectAllButton.onclick = () => {
  update({
    type: "DESELECT ALL"
  });
};
buttons.appendChild(deselectAllButton);

const selectAllButton = document.createElement("button");
selectAllButton.innerText = "Select All (command + a)";
selectAllButton.onclick = () => {
  update({
    type: "SELECT ALL"
  });
};
buttons.appendChild(selectAllButton);

const nextButton = document.createElement("button");
nextButton.innerText = "Next (arrow down)";
nextButton.onclick = () => {
  update({
    type: "SELECT NEXT"
  });
};
buttons.appendChild(nextButton);

const previousButton = document.createElement("button");
previousButton.innerText = "Previous (arrow up)";
previousButton.onclick = () => {
  update({
    type: "SELECT PREVIOUS"
  });
};
buttons.appendChild(previousButton);

const nextAdjacentButton = document.createElement("button");
nextAdjacentButton.innerText = "Next Adjacent (shift + arrow down)";
nextAdjacentButton.onclick = () => {
  update({
    type: "SELECT NEXT ADJACENT"
  });
};
buttons.appendChild(nextAdjacentButton);

const previousAdjacentButton = document.createElement("button");
previousAdjacentButton.innerText = "Previous Adjacent (shift + arrow up)";
previousAdjacentButton.onclick = () => {
  update({
    type: "SELECT PREVIOUS ADJACENT"
  });
};
buttons.appendChild(previousAdjacentButton);
