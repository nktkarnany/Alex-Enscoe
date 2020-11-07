window.addEventListener("DOMContentLoaded", (event) => {
  const CONTAINER_WIDTH =
    window.innerWidth || document.documentElement.clientWidth;
  const CONTAINER_HEIGHT =
    window.innerHeight || document.documentElement.clientHeight;

  const container = document.querySelector(".container");

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
      this.duration = 50000;
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
      var orientation,
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

    animate() {
      this.timeLapsed += 16 + this.speed;
      console.log(this.timeLapsed);
      this.percentage = this.timeLapsed / this.duration;
      if (this.percentage > 1) {
        this.percentage = 1;
        this.setTop(this.endLocation);
        this.timeLapsed = 0;
      } else {
        this.setTop(this.startLocation + this.distance * this.percentage);
      }
    }
  }

  for (let i = 0; i < 1; i++) {
    const image = new Img(Math.floor(Math.random() * 1100), 1);

    container.appendChild(image.DOM.img);

    const updater = function () {
      image.animate();
      requestAnimationFrame(updater); // for subsequent frames
    };

    requestAnimationFrame(updater);

    window.addEventListener("wheel", function (e) {
      image.changeSpeed(wheelDistance(e) * 100);
      console.log(wheelDistance(e));
    });
  }

  let wheelDistance = function (evt) {
    if (!evt) evt = event;
    let w = evt.wheelDelta,
      d = evt.detail;
    if (d) {
      if (w) return (w / d / 40) * d > 0 ? 1 : -1;
      // Opera
      else return -d / 3; // Firefox;         TODO: do not /3 for OS X
    } else return w / 100; // IE/Safari/Chrome TODO: /3 for Chrome OS X
  };

  // let wheelDirection = function (evt) {
  //   if (!evt) evt = event;
  //   return evt.detail < 0 ? 1 : evt.wheelDelta > 0 ? 1 : -1;
  // };

  // function lerp(start, end, amt) {
  //   return (1 - amt) * start + amt * end;
  // }
});
