class TextScroller {
  constructor({containerId="container", includeHebrew=false, randomize=true, lineAnimate=false, catColor=false}={}) {
    this.container = document.getElementById(containerId);
    this.isDragging = false;
    this.currentX = 0;
    this.initialX = 0;
    this.animationEngine = lineAnimate ? this.autoScrollLines.bind(this) : this.autoScroll.bind(this); // default
    this.lineScroll = 0;
    this.includeHebrew = includeHebrew;
    this.catColor = catColor;
    this.data = phrase_objects;
    if(randomize) {
      shuffle(this.data);
    }

    this.addLines();
    this.addEventListeners();
    this.animationEngine();
  }

  createLine(line, num) {
    const offset = num * 40;
    const phraseCount = this.data.length;
    let index = offset % phraseCount;

    let lastColor = null;
    let newColor = null;
    while (line.offsetWidth < (this.container.offsetWidth - 400)) {
      let targets = this.includeHebrew?["en","he"]:["en"]
          targets.forEach(lang => {
            const span = document.createElement("span");
            span.classList.add("phrase");

            const a = document.createElement("a")
            a.setAttribute('href', 'https://www.sefaria.org/topics/' + this.data[index].slug);
            a.textContent = this.data[index][lang];
            span.appendChild(a);

            if(this.catColor) {
              a.style.color = this.getCatColor(this.data[index].cat);
            } else {
              newColor = this.getRandomColor(lastColor);
              a.style.color = newColor;
              lastColor = newColor;
            }


            line.appendChild(span);
        }
      )
      index = index === phraseCount - 1 ? 0 : index + 1;
    }
    return line;
  }

  addLines() {
    let odd = true;
    for (let i = 0; i < 40; i++) {
      let line = this.container.appendChild(document.createElement("div"));
      line.classList.add("line");
      line.classList.add(odd ? "odd" : "even");
      odd = !odd;
      this.container.appendChild(this.createLine(line, i));
    }
  }

  autoScroll() {
    if (this.isDragging) {
      return;
    }
    this.container.style.left = this.container.style.left || 0;
    this.container.style.left = `${parseFloat(this.container.style.left) + 0.1}px`;
    requestAnimationFrame(this.animationEngine);
  }


  autoScrollLines() {
    this.lineScroll = this.lineScroll + 0.05;
    if (this.isDragging) {
      return;
    }
    document.querySelectorAll('.even').forEach(e => e.style.transform = "translateX(" + this.lineScroll + "px)");
    document.querySelectorAll('.odd').forEach(e => e.style.transform = "translateX(-" + this.lineScroll + "px)");
    requestAnimationFrame(this.animationEngine);
  }

  dragStart(e) {
    this.initialX = e.clientX - this.container.offsetLeft;
    this.isDragging = true;
    this.container.style.cursor = 'grabbing';
  }

  dragEnd() {
    this.initialX = this.currentX;
    this.isDragging = false;
    this.container.style.cursor = 'grab';
    this.animationEngine();
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      this.currentX = e.clientX - this.initialX;
      this.container.style.left = `${this.currentX}px`;
    }
  }

  getRandomColor(last) {
    const colors = ["#004E5F", "#5A99B7", "#CCB479", "#5D956F", "#802F3E", "#594176", "#AB4E66", "#7F85A9", "#00827F", "#97B386", "#7C416F", "#CB6158", "#C6A7B4", "#B8D4D3", "#B2B272", "#D4896C"];
    let candidate = null;
    while (!candidate || candidate === last) {
      let i = colors.length * Math.random() | 0;
      candidate = colors[i];
    }
    return candidate;
  }

  catMap = {
    'stories': '#004E5F',
    'biblical-figures': '#5A99B7',
    'health': '#CCB479',
    'values': '#5D956F',
    'nature': '#802F3E',
    'beliefs': '#594176',
    'social-issues': '#AB4E66',
    'places': '#7F85A9',
    'talmudic-figures': '#00827F',
    'ritual-objects': '#97B386',
    'jewish-calendar2': '#7C416F',
    'prayer': '#CB6158',
    'food': '#C6A7B4',
    'lifecycle': '#B8D4D3',
    'philosophy': '#B2B272',
    'supernatural': '#D4896C'
  }
  getCatColor(cat) {
    let result = this.catMap[cat];
    return result ? result : '#D4896C';
  }

  addEventListeners() {
    this.container.addEventListener('mousedown', this.dragStart.bind(this));
    this.container.addEventListener('mouseup', this.dragEnd.bind(this));
    this.container.addEventListener('mouseleave', this.dragEnd.bind(this));
    this.container.addEventListener('mousemove', this.drag.bind(this));
  }
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
