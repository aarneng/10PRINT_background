let x, y
let w = screen.width, h = screen.height
let cw = 1920, ch = 1080
let backgroundRGB = 0
let backgroundFade = 0, backgroundFadeRGB = 0
let backgroundFadeAxis = "x"
let linelen = 30
let lineOverlap = true
let fr = 30

function setup() {
  createCanvas(w, h)
  colorMode(RGB, 255)
  frameRate(fr)
  if (!backgroundFade) background(backgroundRGB)
  else {
    strokeWeight(2)
    setGradient(0, 0, w, h)
    strokeWeight(1)
  }
  fill(backgroundRGB)
  colorMode(HSB, 255)
  x = 0
  y = 0
}

let c1, c2, c3
let resetBackGround = false
// let myCustomWord = "default"

function draw() {
  // textSize(32);
  // text(myCustomWord, 10, 30);
  let normH = ceil(height / linelen)
  let normW = ceil(width  / linelen)
  if (!x && !y) {
    c1 = color(random(255), random(128, 256), random(128, 256))
    c2 = color(random(255), random(128, 256), random(128, 256))
    c3 = color(random(255), random(128, 256), random(128, 256))
    resetBackGround = !resetBackGround || !lineOverlap
  }
  if (resetBackGround) {
    colorMode(RGB, 255)
    stroke(backgroundRGB)
    if (!backgroundFade) square(x * linelen, y * linelen, linelen)
    else {
      let xp = x * linelen
      let yp = y * linelen
      strokeWeight(2)
      setGradient(xp, yp, linelen, linelen)
      strokeWeight(1)
    }
    colorMode(HSB, 255)
  }

  let xlerp = lerpColor(c1, c2, x / normW)
  let ylerp = lerpColor(c1, c3, y / normH)
  let lerped = lerpColor(xlerp, ylerp, width / height)  // lerp according to w/H?

  stroke(lerped)
  let dx = random([0, 1])
  line((x + dx) * linelen, y * linelen, (x+1 - dx) * linelen, (y+1) * linelen)

  x = ++x % normW
  y = ((x % normW == 0) + y) % normH
}

function setGradient(x, y, ww, hh) {
  let c1 = backgroundRGB
  let c2 = backgroundFadeRGB
  let axis = backgroundFadeAxis
  if (axis === "x") {
    // Top to bottom gradient
    for (let i = y; i <= y + hh; i++) {
      let inter = map(i, 0, h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + ww, i);
    }
  }
  else if (axis === "y") {
    // Left to right gradient
    for (let i = x; i <= x + ww; i++) {
      let inter = map(i, 0, w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + hh);
    }
  }
}


function setParseColor(which, col) {
  var c = col.split(' ').map(function(c) {
    return ceil(c * 255)
  })
  colorMode(RGB, 255)
  if (which === 1) backgroundRGB = color(c[0], c[1], c[2])
  else backgroundFadeRGB = color(c[0], c[1], c[2])
  colorMode(HSB, 255)
}


window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (properties.schemecolor) {
      setParseColor(1, properties.schemecolor.value)
    }
    if (properties.schemecolorFadeOption) {
      backgroundFade = properties.schemecolorFadeOption.value
    }
    if (properties.schemecolorFadeColor) {
      setParseColor(2, properties.schemecolorFadeColor.value)
    }
    if (properties.schemecolorFadeAxis) {
      backgroundFadeAxis = properties.schemecolorFadeAxis.value ? "y" : "x"
    }
    // if (properties.changetext) {
    //   myCustomWord = properties.changetext.value + getFrameRate()
    // }
    if (properties.slider) {
      linelen = properties.slider.value
    }
    if (properties.selectResolution) {
      switch (properties.selectResolution.value) {
        case 1: {
          w = screen.width
          h = screen.height
          break
        }
        case 2: {
          w = cw
          h = ch
          break
        }
        default: {
          // pass
        }
      }
    }
    if (properties.selectResolutionCustomHeight) {
      let parsed = parseInt(properties.selectResolutionCustomHeight.value)
      if (!isNaN(parsed)) {
        h = parsed
        ch = parsed
      }
      else h = 1080
    }
    if (properties.selectResolutionCustomWidth) {
      let parsed = parseInt(properties.selectResolutionCustomWidth.value)
      if (!isNaN(parsed)) {
        w = parsed
        cw = parsed
      }
      else w = 1920
    }
    if (properties.overlapLines) {
      lineOverlap = properties.overlapLines.value
      resetBackGround = false
    }
    if (properties.framerateSlider) {
      fr = properties.framerateSlider.value
    }
    setup()
  },
};


