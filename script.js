// Assuming phrases.js contains an array named "phrases"

const container = document.getElementById("container");

// Function to create a line of text with offset
function createLine(line, num) {
  const offset = num * 40;
  const phrase_count = phrases.length;
  let index= offset % phrase_count;

  // Repeat phrases to fill the line
  let last_color = null;
  let new_color = null;
  while (line.offsetWidth < (container.offsetWidth - 200)) {
    const span = document.createElement("span");
    span.textContent = phrases[index];
    span.classList.add("phrase")
    new_color = getColor(last_color);
    span.style.color = new_color;
    last_color = new_color;
    line.appendChild(span);
    index = index===phrase_count-1?0:index+1;
  }
  return line;
}

// Create multiple lines with offset
for (let i = 0; i < 40; i++) {
  let line = container.appendChild(document.createElement("div"));
  line.classList.add("line")
  container.appendChild(createLine(line, i));
}

// Variables for dragging
let isDragging = false;
let currentX;
let initialX;

// Event listeners for dragging
container.addEventListener('mousedown', dragStart);
container.addEventListener('mouseup', dragEnd);
container.addEventListener('mouseleave', dragEnd);
container.addEventListener('mousemove', drag);

// Auto-scrolling function
function autoScroll() {
  console.log("scrolling")
  if(isDragging) { return; }
  container.style.left = container.style.left || 0;
  container.style.left = `${parseFloat(container.style.left) + .2}px`;
  requestAnimationFrame(autoScroll);
}

autoScroll();

// Drag functions
function dragStart(e) {
  initialX = e.clientX - container.offsetLeft;
  isDragging = true;
  container.style.cursor = 'grabbing';
}

function dragEnd() {
  initialX = currentX;
  isDragging = false;
  container.style.cursor = 'grab';
  autoScroll();
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    container.style.left = `${currentX}px`;
  }
}


function getColor(last) {
  // get random element of colors
  const colors = ["#004E5F", "#5A99B7", "#CCB479", "#5D956F", "#802F3E", "#594176", "#AB4E66", "#7F85A9", "#00827F", "#97B386", "#7C416F", "#CB6158", "#C6A7B4", "#B8D4D3", "#B2B272", "#D4896C"];
  let candidate = null;
  while (!candidate || candidate === last) {
    let i = colors.length * Math.random() | 0
    candidate = colors[i];
  }
  return candidate;
}
