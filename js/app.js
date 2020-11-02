window.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  class Box {
    constructor(colStart, colSpan, rowStart, rowSpan) {
      this.DOM = {
        box: this.box(colStart, colSpan, rowStart, rowSpan),
        boxInner: this.boxInner(colSpan, rowSpan),
      };

      this.DOM.box.appendChild(this.DOM.boxInner);
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
    getBox() {
      return this.DOM.box;
    }
  }
  class Img {
    constructor(colStart, colSpan, rowStart, rowSpan, imageNo) {
      this.DOM = {
        imgContainer: this.imageContainer(
          colStart,
          colSpan,
          rowStart,
          rowSpan,
          imageNo
        ),
        img: this.image(imageNo),
      };

      this.relax;

      this.imageNo = imageNo;

      this.imgSrc = `images/${imageNo}.png`;

      this.DOM.imgContainer.appendChild(this.DOM.img);

      this.init();
    }
    image(imageNo) {
      const imgEle = document.createElement("img");
      imgEle.setAttribute("src", `images/${imageNo}.png`);

      return imgEle;
    }
    imageContainer(colStart, colSpan, rowStart, rowSpan, i) {
      const imgContainerEle = document.createElement("div");
      imgContainerEle.classList.add(`img-container`, `img-container-${i}`);
      imgContainerEle.setAttribute(
        "style",
        `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`
      );

      return imgContainerEle;
    }
    getImg() {
      return this.DOM.img;
    }
    getImgContainer() {
      return this.DOM.imgContainer;
    }
    loadImg() {
      const preload = Preload();
      return preload.fetch([this.imgSrc]);
    }
    loaderAnim() {
      const timeline = new TimelineMax();
      const rect = this.DOM.imgContainer.getBoundingClientRect();
      timeline.from(this.DOM.img, 0.5, {
        left: 1440 / 2 - rect.left,
        top: 900 / 2 - rect.top,
        x: "-50%",
        y: "-50%",
      });
      timeline.pause();

      return timeline;
    }
    init() {
      const curr = this;
      const tl = new TimelineLite({
        ease: "Power4.easeOut",
        scrollTrigger: {
          trigger: this.DOM.img,
          start: "top center",
          end: "bottom center",
          // markers: true,
          toggleActions: "restart pause play pause",
          scrub: 4,
          onLeave: function ({ progress, isActive }) {
            // if ((progress == 1) & !isActive) curr.startParallax();
          },
          onStartBack: function ({ isActive }) {
            // if (isActive) curr.stopParallax();
          },
        },
      });
      tl.from(this.DOM.img, {
        opacity: 1,
      });
    }
    startParallax() {
      this.relax.refresh();
    }
    stopParallax() {
      this.relax.destroy();
    }
    initParallax() {
      this.relax = new Rellax(`.img-container-${this.imageNo}`, {
        speed: Math.floor(Math.random() * 3),
      });
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

  const container = document.getElementById("container");

  sections.forEach((section) => {
    const box = section.box;

    section.imgs.forEach((img, i) => {
      box.addImage(img.getImgContainer());
    });

    images.push(...section.imgs);

    container.appendChild(box.getBox());
  });

  images.forEach((img, index) => {
    new Rellax(`.img-container-${index + 1}`, {
      speed: Math.floor(Math.random() * 3),
    });
  });

  // images[1 - 1].loadImg().then(() => {
  //   images[1 - 1].loaderAnim().play();
  //   images[5 - 1].loaderAnim().play();
  //   images[7 - 1].loaderAnim().play();
  //   images[10 - 1].loaderAnim().play();
  // });

  // function pageScroll() {
  //   window.scrollBy(0, 1);
  //   scrolldelay = setTimeout(pageScroll, 50);
  // }

  // setTimeout(function () {
  //   pageScroll();
  // }, 5000);

  // let relax = new Rellax(".img-container-1", {
  //   speed: 5,
  //   center: false,
  //   wrapper: null,
  //   round: true,
  //   vertical: true,
  //   horizontal: false,
  // });
});

// const tl = new TimelineMax({ repeat: 999 });

// tl.from(".loading > img", 0.1, {
//   x: 10,
//   y: 10,
//   ease: Power4.easeIn,
// }).to(".loading > img", 0.1, { x: 10, y: 10, ease: Power4.easeIn });

// tl.pause();

// preload.oncomplete = (i) => {
//   // gsap.registerPlugin(ScrollTrigger);
//   // const images = document.querySelectorAll(".img-container");
//   // images.forEach((img) => {
//   //   const tl = new TimelineLite({
//   //     ease: "Power4.easeOut",
//   //     scrollTrigger: {
//   //       trigger: img,
//   //       start: "top top+=100",
//   //       markers: true,
//   //       toggleActions: "restart pause play pause",
//   //       scrub: 1,
//   //     },
//   //   });
//   //   tl.from(img, {
//   //     opacity: 0.5,
//   //   });
//   // });
//   // const rellax = new Rellax(".rellax");
// };

// // calculate the viewport size
// let winsize;
// const calcWinsize = () =>
//   (winsize = { width: window.innerWidth, height: window.innerHeight });
// calcWinsize();
// // and recalculate on resize
// window.addEventListener("resize", calcWinsize);

// // scroll position and update function
// let docScroll;
// const getPageYScroll = () =>
//   (docScroll = window.pageYOffset || document.documentElement.scrollTop);
// window.addEventListener("scroll", getPageYScroll);
