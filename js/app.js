window.addEventListener("DOMContentLoaded", () => {
  const CLIENT_WIDTH =
    window.innerWidth || document.documentElement.clientWidth;
  const CLIENT_HEIGHT =
    window.innerHeight || document.documentElement.clientHeight;

  const container = document.querySelector(".container");

  const lightbox = document.querySelector(".lightbox");

  // Animation Variable
  let animation;

  // Reasonable defaults
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;
  const IDLE_SPEED = 1;
  const FRICTION_COEFICIENT = 0.6;
  const SCALE_FACTOR = 0.6;
  const POSITION_BUFFER = 20;

  // Mouse event variables
  let oldMouseX = 0,
    mouseX = 0;
  let oldMouseY = 0,
    mouseY = 0;
  let isMouseMoving = false;
  let isMouseOver = null;

  // Wheel event variables
  let marker = true,
    delta,
    direction,
    interval = 50,
    counter1 = 0,
    counter2,
    event;

  const images = [];

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

  class Img {
    constructor(colStart, colSpan, rowStart, rowSpan, imageNo, zIndex) {
      const curr = this;

      this.imageNo = imageNo;

      this.zIndex = zIndex;

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

      this.DOM.imgContainer.addEventListener("mouseenter", () => curr.over());

      this.DOM.imgContainer.addEventListener("mouseleave", () => curr.out());

      this.DOM.imgContainer.addEventListener("click", () => {
        lightbox.querySelector(".img-container").innerHTML = "";
        lightbox.querySelector(".img-container").appendChild(this.image());
        lightbox.classList.add("open");
        stopAnimation();
      });
    }

    // Initialising Variables
    init() {
      this.startLocation = CLIENT_HEIGHT - 40;
      this.buffer = POSITION_BUFFER;
      this.endLocation = this.startLocation;
      this.speed = 0;
      this.position = 0;
      this.scale = 1;
      this.hasSpeed = false;
    }

    // Creating the image container
    imageContainer(colStart, colSpan, rowStart, rowSpan, i) {
      const imgContainerEle = document.createElement("div");
      imgContainerEle.classList.add(`img-container`);
      imgContainerEle.setAttribute(
        "style",
        `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan}; z-index: ${this.zIndex};`
      );
      imgContainerEle.dataset.visible = 0;

      return imgContainerEle;
    }

    // Creating an img element
    image() {
      const imgEle = document.createElement("img");
      const preload = Preload();
      preload.fetch([this.imgSrc]).then(() => {
        imgEle.setAttribute("src", this.imgSrc);
      });

      return imgEle;
    }

    // Get image element
    getImage() {
      return this.DOM.imgContainer;
    }

    // Is the element visible in the viewport, check the dataset
    isVisible() {
      return this.DOM.imgContainer.dataset.visible == 1;
    }

    // Set the position from top
    setTop(t) {
      TweenMax.to(this.DOM.imgContainer, 0, {
        y: t,
        ease: Linear.easeNone,
      });
      if (this.hasSpeed) return;
      const isVisible = this.isVisible();
      const isCollision = this.doesMouseCollide();
      if (!isMouseMoving && isVisible && isCollision) {
        this.over();
      }
      if (isMouseOver == this.imageNo && !isCollision) {
        this.out();
      }
      if (isMouseMoving && isMouseOver == this.imageNo && !isCollision) {
        this.out();
      }
    }

    // Checking if image container box collides with mouse pointer
    doesMouseCollide() {
      const {
        top,
        left,
        right,
        bottom,
      } = this.DOM.imgContainer.getBoundingClientRect();
      return mouseX > left && mouseX < right && mouseY < bottom && mouseY > top;
    }

    // Mouse Over Function
    over() {
      if (!isMouseOver) {
        TweenMax.to(this.DOM.imgContainer, 0.4, {
          scale: 1 + SCALE_FACTOR,
          ease: Sine.easeOut,
        });
        mouseOver(this.imageNo);
      }
    }

    // Mouse Out Function
    out() {
      if (isMouseOver) {
        TweenMax.to(this.DOM.imgContainer, 0.3, {
          scale: 1,
          ease: Sine.easeIn,
        });
        mouseOut();
      }
    }

    // Change the speed of image
    changeSpeed(speed) {
      this.hasSpeed = false;
      if (speed != 0) {
        this.buffer = 0;
        this.hasSpeed = true;
      }
      if (speed == 0 && !this.isVisible()) this.buffer = POSITION_BUFFER;
      this.speed = speed;
    }

    // Add Friction to the speed
    addFriction() {
      this.speed = -IDLE_SPEED * FRICTION_COEFICIENT;
    }

    // Animate each frame at 60fps
    animate() {
      this.position -= IDLE_SPEED + this.speed;

      this.upperThreshold = container.clientHeight;

      if (this.imageNo > 44) {
        this.upperThreshold = container.clientHeight + CLIENT_HEIGHT;
      }

      if (Math.abs(this.position) > this.upperThreshold) {
        this.position = 0;

        if (this.imageNo > 44) {
          this.position = 0 - CLIENT_HEIGHT;
        }
      }

      if (this.speed < 0) {
        this.upperThreshold = 0;

        // if (this.imageNo > 44) {
        //   this.upperThreshold = - CLIENT_HEIGHT;
        // }

        if (this.position > this.upperThreshold) {
          this.position = 0 - container.clientHeight;

          // if (this.imageNo > 44) {
          //   this.position = 0 - container.clientHeight + CLIENT_HEIGHT;
          // }
        }
      }

      if (this.isVisible() && this.buffer > 0) {
        this.buffer -= 4 * this.easing(this.buffer / POSITION_BUFFER);
      }
      // if (!this.isVisible() && this.buffer != POSITION_BUFFER)
      //   this.buffer = POSITION_BUFFER;
      this.endLocation = this.startLocation + this.buffer + this.position;
      this.setTop(this.endLocation);
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
        new Img(1, 12, 1, 20, 1, 1), // Img Params: Col Start, Col Span, Row Start, Row Span, Img Src, Speed, Z-Index
        new Img(14, 10, 10, 14, 2, 1),
      ],
    },
    {
      box: new Box(33, 15, 4, 15),
      imgs: [
        new Img(1, 9, 1, 8, 3, 1),
        new Img(22, 8, 2, 10, 4, 1),
        new Img(9, 10, 9, 14, 5, 1),
        new Img(5, 7, 22, 9, 6, 1),
      ],
    },
    {
      box: new Box(3, 13, 21, 10),
      imgs: [
        new Img(11, 9, 1, 10, 7, 2),
        new Img(1, 11, 7, 12, 8, 1),
        new Img(15, 12, 11, 10, 9, 1),
      ],
    },
    {
      box: new Box(27, 5, 24, 9),
      imgs: [new Img(1, 10, 2, 18, 10, 1)],
    },
    {
      box: new Box(36, 9, 38, 8),
      imgs: [new Img(1, 9, 4, 13, 11, 1), new Img(11, 7, 1, 12, 12, 1)],
    },
    {
      box: new Box(8, 10, 44, 11),
      imgs: [new Img(7, 13, 1, 12, 13, 2), new Img(1, 15, 9, 14, 14, 1)],
    },
    {
      box: new Box(25, 4, 50, 5),
      imgs: [new Img(2, 7, 2, 8, 15, 1)],
    },
    {
      box: new Box(35, 13, 55, 13),
      imgs: [
        new Img(15, 11, 1, 13, 16, 1),
        new Img(1, 10, 8, 12, 17, 1),
        new Img(12, 8, 14, 12, 18, 1),
      ],
    },
    {
      box: new Box(15, 12, 65, 8),
      imgs: [new Img(1, 11, 1, 12, 19, 1), new Img(13, 11, 4, 12, 20, 1)],
    },
    {
      box: new Box(2, 13, 79, 15),
      imgs: [
        new Img(3, 13, 1, 16, 21, 2),
        new Img(13, 13, 13, 12, 22, 1),
        new Img(1, 7, 19, 12, 24, 1),
      ],
    },
    {
      box: new Box(28, 10, 82, 6),
      imgs: [new Img(2, 9, 1, 12, 23, 1)],
    },
    {
      box: new Box(38, 10, 91, 21),
      imgs: [
        new Img(11, 9, 2, 14, 25, 2),
        new Img(1, 12, 13, 18, 26, 1),
        new Img(6, 12, 32, 12, 29, 1),
      ],
    },
    {
      box: new Box(12, 13, 101, 10),
      imgs: [new Img(1, 15, 1, 16, 27, 1), new Img(18, 8, 8, 14, 28, 1)],
    },
    {
      box: new Box(4, 4, 121, 6),
      imgs: [new Img(1, 7, 2, 10, 31, 1)],
    },
    {
      box: new Box(32, 5, 117, 7),
      imgs: [new Img(1, 9, 2, 12, 30, 1)],
    },
    {
      box: new Box(10, 12, 129, 17),
      imgs: [
        new Img(7, 12, 2, 12, 32, 2),
        new Img(1, 8, 12, 14, 35, 1),
        new Img(10, 14, 22, 14, 36, 1),
      ],
    },
    {
      box: new Box(35, 12, 130, 9),
      imgs: [new Img(13, 12, 2, 10, 33, 1), new Img(1, 10, 7, 12, 34, 1)],
    },
    {
      box: new Box(30, 16, 148, 10),
      imgs: [
        new Img(10, 11, 2, 10, 37, 2),
        new Img(1, 14, 10, 10, 38, 1),
        new Img(23, 9, 6, 14, 39, 1),
      ],
    },
    {
      box: new Box(3, 11, 155, 11),
      imgs: [new Img(12, 11, 1, 16, 40, 1), new Img(1, 10, 12, 12, 41, 1)],
    },
    {
      box: new Box(21, 5, 166, 7),
      imgs: [new Img(1, 9, 2, 14, 42, 1)],
    },
    {
      box: new Box(35, 11, 169, 16),
      imgs: [
        new Img(16, 7, 1, 10, 43, 1),
        new Img(1, 7, 8, 10, 44, 1),
        new Img(13, 9, 17, 8, 45, 2),
        new Img(3, 11, 22, 12, 47, 1),
      ],
    },
    {
      box: new Box(2, 5, 179, 7),
      imgs: [new Img(1, 9, 2, 14, 46, 1)],
    },
    {
      box: new Box(13, 17, 188, 12),
      imgs: [
        new Img(6, 10, 2, 14, 48, 1),
        new Img(19, 15, 8, 14, 49, 1),
        new Img(2, 10, 12, 14, 50, 1),
      ],
    },
    {
      box: new Box(36, 12, 201, 10),
      imgs: [new Img(1, 9, 2, 14, 51, 1), new Img(12, 12, 7, 14, 52, 1)],
    },
    {
      box: new Box(3, 6, 209, 5),
      imgs: [new Img(1, 11, 2, 10, 53, 1)],
    },
    {
      box: new Box(24, 10, 213, 7),
      imgs: [new Img(1, 9, 1, 14, 54, 1)],
    },
  ];

  // Checking image container viewport starts here
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: buildThresholdList(),
  });

  function buildThresholdList() {
    let thresholds = [];
    const numSteps = 80.0;

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  }

  function handleIntersection(entries) {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        if (entry.intersectionRatio > 0.7) {
          entry.target.dataset.visible = 1;
          entry.target.classList.add("visible");
        }
      } else {
        entry.target.dataset.visible = 0;
        entry.target.classList.remove("visible");
      }
    });
  }
  // Checking image container viewport ends here

  // Elements Rendering Starts Here
  sections.forEach((section) => {
    const box = section.box;
    const imgs = section.imgs;

    imgs.forEach((img) => {
      box.addImage(img.DOM.imgContainer);

      observer.observe(img.DOM.imgContainer);

      img.init();
    });

    images.push(...imgs);
  });
  // Elements Rendering Starts Here

  // Animation Starts Here
  const updater = function () {
    if (oldMouseX != mouseX) isMouseMoving = true;
    else if (oldMouseY != mouseY) isMouseMoving = true;
    else isMouseMoving = false;
    oldMouseX = mouseX;
    oldMouseY = mouseY;

    images.forEach((img) => {
      img.animate();
    });
    animation = requestAnimationFrame(updater); // for subsequent frames
  };

  startAnimation();
  // Animation Ends Here

  // Image Containers Mouse Hover Starts Here
  function mouseOver(no) {
    isMouseOver = no;
    images.forEach((img) => {
      img.addFriction();
    });
  }
  function mouseOut() {
    isMouseOver = null;
    images.forEach((img) => {
      img.changeSpeed(0);
    });
  }
  // Image Containers Mouse Hover Ends Here

  // Mouse Tracking Starts Here
  (function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }

      mouseX = event.pageX;
      mouseY = event.pageY;
    }
  })();
  // Mouse Tracking Ends Here

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

  // Heading Toggle Starts Here
  const overlay = document.querySelector(".overlay");

  const about = document.querySelector(".about");
  const heading = document.querySelector(".heading");

  let isShowing = false;

  about.addEventListener("click", function (e) {
    if (e.target !== this) return;
    toggleAnimation();
  });

  heading.addEventListener("click", toggleAnimation);

  function toggleAnimation() {
    if (!isShowing) {
      stopAnimation();
      overlay.classList.remove("close");
      overlay.classList.add("open");
      heading.classList.add("expanded");
      isShowing = true;
    } else {
      startAnimation();
      overlay.classList.remove("open");
      overlay.classList.add("close");
      heading.classList.remove("expanded");
      isShowing = false;
    }
  }
  // Heading Toggle Ends Here

  // Preloader Animation Starts Here
  // const preloaderTl = new TimelineMax({ paused: true });

  // preloaderTl.from(".loading-text", 2, {
  //   top: "50%",
  //   y: "-50%",
  //   scale: 3,
  // });

  // document.body.classList.remove("loading");
  // window.setTimeout(function () {
  //   preloaderTl.play(0).then(function () {
  //     document.body.classList.remove("loaded");
  //     animation = requestAnimationFrame(updater);
  //   });
  // }, 3000);
  // Preloader Animation Ends Here

  lightbox.addEventListener("click", function (e) {
    if (e.target !== this) return;
    lightbox.classList.remove("open");
    startAnimation();
  });

  function stopAnimation() {
    cancelAnimationFrame(animation);
  }

  function startAnimation() {
    animation = requestAnimationFrame(updater);
  }
});
