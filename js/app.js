window.addEventListener("DOMContentLoaded", (event) => {
  const CONTAINER_WIDTH =
    window.innerWidth || document.documentElement.clientWidth;
  const CONTAINER_HEIGHT =
    window.innerHeight || document.documentElement.clientHeight;

  const container = document.querySelector(".container");

  // Reasonable defaults
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;

  class Img {
    constructor(xPos, imageNo) {
      this.xPos = xPos;
      this.imgSrc = `images/${imageNo}.png`;

      console.log(this.imageOrientation());

      this.DOM = {
        img: this.image(300, 300),
      };

      this.setLeft(this.xPos);

      this.startLocation = CONTAINER_HEIGHT;
      this.endLocation = 0 - 300;

      this.distance = this.endLocation - this.startLocation;

      this.timeLapsed = 0;
      this.speed = 0;
      this.duration = 30000;
      this.percentage;
    }

    // Image Preloader
    loadImg() {
      const preload = Preload();
      return preload.fetch([this.imgSrc]);
    }

    // Creating an img element
    image(width, height) {
      const imgEle = document.createElement("img");
      imgEle.classList.add("track");
      imgEle.setAttribute("src", this.imgSrc);
      imgEle.setAttribute("style", `width: ${width}px;height: ${height}px;`);

      return imgEle;
    }

    setTop(t) {
      this.DOM.img.style.top = t + "px";
    }

    setLeft(l) {
      this.DOM.img.style.left = l + "px";
    }

    // Getting the image orientation
    imageOrientation() {
      let orientation,
        img = new Image();
      img.src = this.imgSrc;

      if (img.naturalWidth > img.naturalHeight) {
        orientation = "landscape";
      } else if (img.naturalWidth < img.naturalHeight) {
        orientation = "portrait";
      } else {
        orientation = "even";
      }

      return orientation;
    }

    // Checking if the image is in the view port
    isInViewport() {
      const bounding = this.DOM.img.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= CONTAINER_HEIGHT &&
        bounding.right <= CONTAINER_WIDTH
      );
    }

    // easing function for acceleration until halfway, then deceleration
    easing(progress) {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
    }

    changeSpeed(speed) {
      this.speed = speed;
    }

    easingDecc(t) {
      return t * (2 - t);
    }

    animate() {
      this.timeLapsed += 16 + this.speed;
      this.percentage = this.timeLapsed / this.duration;
      // if (this.percentage > 1) {
      //   this.percentage = 1;
      //   this.setTop(this.endLocation);
      //   this.timeLapsed = 0;
      // } else {
      this.setTop(this.startLocation + this.distance * this.percentage);
      // }
    }
  }

  for (let i = 0; i < 2; i++) {
    const image = new Img(Math.floor(Math.random() * 1100), i + 1);

    container.appendChild(image.DOM.img);

    const updater = function () {
      image.animate();
      requestAnimationFrame(updater); // for subsequent frames
    };

    requestAnimationFrame(updater);

    window.addEventListener("DOMMouseScroll", wheel, false);
    window.addEventListener("mousewheel", wheel, false);

    let marker = true,
      delta,
      direction,
      interval = 50,
      counter1 = 0,
      counter2,
      event;

    function wheel(e) {
      event = e;
      counter1 += 1;
      delta = e.deltaY;
      if (delta > 0) {
        direction = "up";
      } else {
        direction = "down";
      }
      if (marker) {
        wheelStart();
      }
      return false;
    }
    function wheelStart() {
      marker = false;
      wheelAct();
    }
    function wheelAct() {
      counter2 = counter1;
      setTimeout(function () {
        if (counter2 == counter1) {
          wheelEnd();
        } else {
          let { pixelY } = scrollnormalizeWheel(event);
          image.changeSpeed(pixelY * 10);
          wheelAct();
        }
      }, interval);
    }
    function wheelEnd() {
      image.changeSpeed(0);
      marker = true;
      counter1 = 0;
      counter2 = false;
    }
  }

  function scrollnormalizeWheel(/*object*/ event) /*object*/ {
    let sX = 0,
      sY = 0, // spinX, spinY
      pX = 0,
      pY = 0; // pixelX, pixelY

    // Legacy
    if ("detail" in event) {
      sY = event.detail;
    }
    if ("wheelDelta" in event) {
      sY = -event.wheelDelta / 120;
    }
    if ("wheelDeltaY" in event) {
      sY = -event.wheelDeltaY / 120;
    }
    if ("wheelDeltaX" in event) {
      sX = -event.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ("axis" in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ("deltaY" in event) {
      pY = event.deltaY;
    }
    if ("deltaX" in event) {
      pX = event.deltaX;
    }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode == 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return { spinX: sX, spinY: sY, pixelX: pX, pixelY: pY };
  }
});
