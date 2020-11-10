window.addEventListener("DOMContentLoaded", () => {
  const _WIDTH = window.innerWidth || document.documentElement.clientWidth;
  const _HEIGHT = window.innerHeight || document.documentElement.clientHeight;

  const container = document.querySelector(".container");

  // Reasonable defaults
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;

  let images = [];

  class Img {
    constructor(xPos, yPos, imageNo) {
      this.left = xPos;
      this.top = yPos;
      this.imgSrc = `images/${imageNo}.png`;

      this.DOM = {
        img: this.image(),
      };

      this.setImageDimensions();

      this.setLeft(this.left);
      this.setTop(this.top);

      this.addToParent();

      this.isInViewport();

      this.startLocation = this.top;
      this.endLocation = this.startLocation;
      this.timeLapsed = 0;
      this.speed = 0;
    }

    // Add to container
    addToParent() {
      if (!this.checkParent()) container.appendChild(this.DOM.img);
    }

    // Remove from container
    removeFromParent() {
      if (this.checkParent()) container.removeChild(this.DOM.img);
    }

    // Check if parent
    checkParent() {
      if (container.contains(this.DOM.img)) return true;
      return false;
    }

    // Image Preloader
    loadImg() {
      const preload = Preload();
      return preload.fetch([this.imgSrc]);
    }

    // Creating an img element
    image() {
      const imgEle = document.createElement("img");
      imgEle.classList.add("track");
      imgEle.setAttribute("src", this.imgSrc);

      return imgEle;
    }

    // Get image element
    getImage() {
      return this.DOM.img;
    }

    // Get image dimensions
    setImageDimensions() {
      let width;

      const naturalWidth = this.DOM.img.naturalWidth;
      const naturalHeight = this.DOM.img.naturalHeight;

      const ratio = (_WIDTH - naturalWidth) / _WIDTH;

      if (naturalWidth > naturalHeight) {
        width = naturalWidth * ratio;
      } else if (naturalWidth < naturalHeight) {
        width = naturalWidth * ratio;
      } else {
        width = naturalWidth * ratio;
      }

      this.DOM.img.setAttribute("style", `width: ${width}px;height: auto;`);
    }

    // Get image dimensions
    getImageDimensions() {
      return {
        width: this.DOM.img.width,
        height: this.DOM.img.height,
      };
    }

    // Set the position from top
    setTop(t) {
      this.top = t;
      this.DOM.img.style.top = t + "px";
    }

    // Set the position from left
    setLeft(l) {
      this.left = l;
      this.DOM.img.style.left = l + "px";
    }

    // Change the speed of image
    changeSpeed(speed) {
      this.speed = speed;
    }

    // Animate each frame at 60fps
    animate() {
      this.timeLapsed -= 1 + this.speed;
      this.endLocation = this.startLocation + this.timeLapsed;
      this.setTop(this.endLocation);
      console.log(this.isInViewport());
      if (this.isInViewport()) this.addToParent();
      else this.removeFromParent();
    }

    // Check if image is in view port
    isInViewport() {
      const { width, height } = this.getImageDimensions();
      return (
        this.top >= 0 - height &&
        this.left >= 0 - width &&
        this.top <= _HEIGHT &&
        this.left <= _WIDTH
      );
    }

    // Easing function for acceleration until halfway, then deceleration
    easing(progress) {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
    }
  }

  for (let i = 0; i < 1; i++) {
    const image = new Img(
      Math.floor(Math.random() * 1400),
      Math.floor(Math.random() * 900),
      i + 1
    );

    images.push(image);

    const updater = function () {
      image.animate();
      requestAnimationFrame(updater); // for subsequent frames
    };

    requestAnimationFrame(updater);
  }

  // Wheel Tracking Code Starts Here
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
      // wheelStart
      marker = false;
      wheelAct();
      // wheelStart
    }
    return false;
  }
  function wheelAct() {
    counter2 = counter1;
    setTimeout(function () {
      if (counter2 == counter1) {
        // wheelEnd
        images.forEach((image) => image.changeSpeed(0));
        marker = true;
        counter1 = 0;
        counter2 = false;
        // wheelEnd
      } else {
        let { pixelY } = scrollnormalizeWheel(event);
        images.forEach((image) => image.changeSpeed(pixelY));
        wheelAct();
      }
    }, interval);
  }
  function scrollnormalizeWheel(event) {
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
  // Wheel Tracking Code Ends Here
});
