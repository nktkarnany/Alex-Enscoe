window.addEventListener("DOMContentLoaded", () => {
  const CLIENT_WIDTH =
    window.innerWidth || document.documentElement.clientWidth;
  const CLIENT_HEIGHT =
    window.innerHeight || document.documentElement.clientHeight;

  const container = document.querySelector(".container");

  class Box {
    constructor(colStart, colSpan, rowStart, rowSpan) {
      this.DOM = {
        box: this.box(colStart, colSpan, rowStart, rowSpan),
        boxInner: this.boxInner(colSpan, rowSpan),
      };

      this.DOM.box.appendChild(this.DOM.boxInner);

      container.appendChild(this.DOM.box);
    }
    box(colStart, colSpan, rowStart, rowSpan) {
      const boxEle = document.createElement("div");
      boxEle.classList.add("box");
      boxEle.setAttribute(
        "style",
        `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`
      );

      return boxEle;
    }
    boxInner(colSpan, rowSpan) {
      const boxInnerEle = document.createElement("div");
      boxInnerEle.classList.add("box-inner");
      boxInnerEle.setAttribute(
        "style",
        `grid-template-columns: repeat(${colSpan * 2}, 1fr);
      grid-template-rows: repeat(${rowSpan * 2}, 1fr);`
      );

      return boxInnerEle;
    }
    addImage(img) {
      this.DOM.boxInner.appendChild(img);
    }
    removeImage(img) {
      if (this.checkParent(img)) this.DOM.boxInner.removeChild(img);
    }
    checkParent(img) {
      if (this.DOM.boxInner.contains(img)) return true;
      return false;
    }
    getBox() {
      return this.DOM.box;
    }
  }

  // Reasonable defaults
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;

  // Wheel event variables
  let marker = true,
    delta,
    direction,
    interval = 50,
    counter1 = 0,
    counter2,
    event;

  class Img {
    constructor(colStart, colSpan, rowStart, rowSpan, imageNo) {
      const curr = this;

      this.imgSrc = `images/${imageNo}.png`;

      this.DOM = {
        imgContainer: this.imageContainer(
          colStart,
          colSpan,
          rowStart,
          rowSpan,
          imageNo
        ),
        img: this.image(),
      };

      this.DOM.imgContainer.appendChild(this.DOM.img);
    }

    init() {
      const bounding = this.DOM.imgContainer.getBoundingClientRect();
      this.setTop(bounding.top);

      this.startLocation = bounding.top;
      this.endLocation = this.startLocation;
      this.timeLapsed = 0;
      this.speed = 0;
    }

    // Image Preloader
    loadImg() {
      const preload = Preload();
      return preload.fetch([this.imgSrc]);
    }

    imageContainer(colStart, colSpan, rowStart, rowSpan, i) {
      const imgContainerEle = document.createElement("div");
      imgContainerEle.classList.add(`img-container`);
      imgContainerEle.setAttribute(
        "style",
        `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`
      );

      return imgContainerEle;
    }

    // Creating an img element
    image() {
      const imgEle = document.createElement("img");
      imgEle.setAttribute("src", this.imgSrc);

      return imgEle;
    }

    // Get image element
    getImage() {
      return this.DOM.imgContainer;
    }

    // Set the position from top
    setTop(t) {
      this.top = t;
      this.DOM.imgContainer.style.transform = `translateY(${t}px)`;
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
    }

    // Get image dimensions
    setImageDimensions() {
      let width;

      const naturalWidth = this.DOM.imgContainer.naturalWidth;
      const naturalHeight = this.DOM.imgContainer.naturalHeight;

      const ratio = (CLIENT_WIDTH - naturalWidth) / CLIENT_WIDTH;

      if (naturalWidth > naturalHeight) {
        width = naturalWidth * (ratio + 0.2);
      } else if (naturalWidth < naturalHeight) {
        width = naturalWidth * (ratio - 0.2);
      } else {
        width = naturalWidth * ratio;
      }

      this.DOM.imgContainer.setAttribute(
        "style",
        `width: ${width}px;height: auto;`
      );
    }

    // Get image dimensions
    getImageDimensions() {
      return {
        width: this.DOM.imgContainer.width,
        height: this.DOM.imgContainer.height,
      };
    }

    // Check if image is in view port
    isInViewport() {
      const { width, height } = this.getImageDimensions();
      return (
        this.top >= 0 - height &&
        this.left >= 0 - width &&
        this.top <= CLIENT_HEIGHT &&
        this.left <= CLIENT_WIDTH
      );
    }

    // Easing function for acceleration until halfway, then deceleration
    easing(progress) {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
    }
  }

  let sections = [
    {
      box: new Box(10, 12, 3, 12), // Box Params: Col Start, Col Span, Row Start, Row Span
      imgs: [
        new Img(1, 12, 1, 20, 1), // Img Params: Col Start, Col Span, Row Start, Row Span, Img Src, Speed, Z-Index
        new Img(14, 10, 10, 14, 2),
      ],
    },
    {
      box: new Box(33, 15, 4, 15),
      imgs: [
        new Img(1, 9, 1, 8, 3),
        new Img(22, 8, 2, 10, 4),
        new Img(9, 10, 9, 14, 5),
        new Img(5, 7, 22, 9, 6),
      ],
    },
    {
      box: new Box(3, 13, 21, 10),
      imgs: [
        new Img(11, 9, 1, 10, 7),
        new Img(1, 11, 7, 12, 8),
        new Img(15, 12, 11, 10, 9),
      ],
    },
    {
      box: new Box(27, 5, 24, 9),
      imgs: [new Img(1, 10, 2, 18, 10)],
    },
    {
      box: new Box(36, 9, 38, 8),
      imgs: [new Img(1, 9, 4, 13, 11), new Img(11, 7, 1, 12, 12)],
    },
    {
      box: new Box(8, 10, 44, 11),
      imgs: [new Img(7, 13, 1, 12, 13), new Img(1, 15, 9, 14, 14)],
    },
    {
      box: new Box(25, 4, 50, 5),
      imgs: [new Img(2, 7, 2, 8, 15)],
    },
    {
      box: new Box(35, 13, 55, 13),
      imgs: [
        new Img(15, 11, 1, 13, 16),
        new Img(1, 10, 8, 12, 17),
        new Img(12, 8, 14, 12, 18),
      ],
    },
    {
      box: new Box(15, 12, 65, 8),
      imgs: [new Img(1, 11, 1, 12, 19), new Img(13, 11, 4, 12, 20)],
    },
    {
      box: new Box(2, 13, 79, 15),
      imgs: [
        new Img(3, 13, 1, 16, 21),
        new Img(13, 13, 13, 12, 22),
        new Img(1, 7, 19, 12, 24),
      ],
    },
    {
      box: new Box(28, 10, 82, 6),
      imgs: [new Img(2, 9, 1, 12, 23)],
    },
    {
      box: new Box(38, 10, 91, 21),
      imgs: [
        new Img(11, 9, 2, 14, 25),
        new Img(1, 12, 13, 18, 26),
        new Img(6, 12, 32, 12, 29),
      ],
    },
    {
      box: new Box(12, 13, 101, 10),
      imgs: [new Img(1, 15, 1, 16, 27), new Img(18, 8, 8, 14, 28)],
    },
    {
      box: new Box(4, 4, 121, 6),
      imgs: [new Img(1, 7, 2, 10, 31)],
    },
    {
      box: new Box(32, 5, 117, 7),
      imgs: [new Img(1, 9, 2, 12, 30)],
    },
    {
      box: new Box(10, 12, 129, 17),
      imgs: [
        new Img(7, 12, 2, 12, 32),
        new Img(1, 8, 12, 14, 35),
        new Img(10, 14, 22, 14, 36),
      ],
    },
    {
      box: new Box(35, 12, 130, 9),
      imgs: [new Img(13, 12, 2, 10, 33), new Img(1, 10, 7, 12, 34)],
    },
    {
      box: new Box(30, 16, 148, 10),
      imgs: [
        new Img(10, 11, 2, 10, 37),
        new Img(1, 14, 10, 10, 38),
        new Img(23, 9, 6, 14, 39),
      ],
    },
    {
      box: new Box(3, 11, 155, 11),
      imgs: [new Img(12, 11, 1, 16, 40), new Img(1, 10, 12, 12, 41)],
    },
    {
      box: new Box(21, 5, 166, 7),
      imgs: [new Img(1, 9, 2, 14, 42)],
    },
    {
      box: new Box(35, 11, 169, 16),
      imgs: [
        new Img(16, 7, 1, 10, 43),
        new Img(1, 7, 8, 10, 44),
        new Img(13, 9, 17, 8, 45),
        new Img(3, 11, 22, 12, 47),
      ],
    },
    {
      box: new Box(2, 5, 179, 7),
      imgs: [new Img(1, 9, 2, 14, 46)],
    },
    {
      box: new Box(13, 17, 188, 12),
      imgs: [
        new Img(6, 10, 2, 14, 44),
        new Img(19, 15, 8, 14, 49),
        new Img(2, 10, 12, 14, 50),
      ],
    },
    {
      box: new Box(36, 12, 201, 10),
      imgs: [new Img(1, 9, 2, 14, 51), new Img(12, 12, 7, 14, 52)],
    },
    {
      box: new Box(3, 6, 209, 5),
      imgs: [new Img(1, 11, 2, 10, 53)],
    },
    {
      box: new Box(24, 10, 213, 7),
      imgs: [new Img(1, 9, 1, 14, 54)],
    },
  ];

  const images = [];

  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.85,
  });

  const observer1 = new IntersectionObserver(handleIntersection1, {
    root: document.getElementById("threshold"),
    threshold: 1.0,
  });

  // Checking intersection in viewport
  function handleIntersection(entries) {
    entries.map((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }

  function handleIntersection1(entries) {
    entries.map((entry) => {
      console.log(entry);
    });
  }

  sections.forEach((section) => {
    const box = section.box;
    const imgs = section.imgs;

    imgs.forEach((img) => {
      box.addImage(img.DOM.imgContainer);

      observer.observe(img.DOM.imgContainer);

      // observer1.observe(img.DOM.imgContainer);

      const updater = function () {
        img.animate();
        requestAnimationFrame(updater); // for subsequent frames
      };

      img.init();

      requestAnimationFrame(updater);
    });

    images.push(...imgs);
  });

  // Wheel Tracking Code Starts Here
  window.addEventListener("DOMMouseScroll", wheel, false);
  window.addEventListener("mousewheel", wheel, false);

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
