window.onload = function (event) {
  gsap.registerPlugin(ScrollTrigger);

  let boxes = [
    {
      boxStyle: box(10, 12, 3, 12), // Box Params: Col Start, Col Span, Row Start, Row Span
      innerBoxStyle: innerBox(12, 12),
      imgs: [
        img(1, 12, 1, 20, "./images/1.png", randSpeed(), 0), // Img Params: Col Start, Col Span, Row Start, Row Span, Img Src, Speed, Z-Index
        img(14, 10, 10, 14, "./images/2.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(33, 15, 4, 15),
      innerBoxStyle: innerBox(15, 15),
      imgs: [
        img(1, 9, 1, 8, "./images/3.png", randSpeed(), 0),
        img(22, 8, 2, 10, "./images/4.png", randSpeed(), 0),
        img(9, 10, 9, 14, "./images/5.png", randSpeed(), 0),
        img(5, 7, 22, 9, "./images/6.png", randSpeed(), 5),
      ],
    },
    {
      boxStyle: box(3, 13, 21, 10),
      innerBoxStyle: innerBox(13, 10),
      imgs: [
        img(11, 9, 1, 10, "./images/7.png", randSpeed(), 0),
        img(1, 11, 7, 12, "./images/8.png", randSpeed(), 5),
        img(15, 12, 11, 10, "./images/9.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(27, 5, 24, 9),
      innerBoxStyle: innerBox(5, 9),
      imgs: [img(1, 10, 2, 18, "./images/10.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(36, 9, 38, 8),
      innerBoxStyle: innerBox(9, 8),
      imgs: [
        img(1, 9, 4, 13, "./images/11.png", randSpeed(), 0),
        img(11, 7, 1, 12, "./images/12.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(8, 10, 44, 11),
      innerBoxStyle: innerBox(10, 11),
      imgs: [
        img(7, 13, 1, 12, "./images/13.png", randSpeed(), 0),
        img(1, 15, 9, 14, "./images/14.png", randSpeed(), 5),
      ],
    },
    {
      boxStyle: box(25, 4, 50, 5),
      innerBoxStyle: innerBox(4, 5),
      imgs: [img(2, 7, 2, 8, "./images/15.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(35, 13, 55, 13),
      innerBoxStyle: innerBox(13, 13),
      imgs: [
        img(15, 11, 1, 13, "./images/16.png", randSpeed(), 0),
        img(1, 10, 8, 12, "./images/17.png", randSpeed(), 0),
        img(12, 8, 14, 12, "./images/18.png", randSpeed(), 5),
      ],
    },
    {
      boxStyle: box(15, 12, 65, 8),
      innerBoxStyle: innerBox(12, 8),
      imgs: [
        img(1, 11, 1, 12, "./images/19.png", randSpeed(), 0),
        img(13, 11, 4, 12, "./images/20.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(2, 13, 79, 15),
      innerBoxStyle: innerBox(13, 15),
      imgs: [
        img(3, 13, 1, 16, "./images/21.png", randSpeed(), 0),
        img(13, 13, 13, 12, "./images/22.png", randSpeed(), 5),
        img(1, 7, 19, 12, "./images/24.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(28, 10, 82, 6),
      innerBoxStyle: innerBox(10, 6),
      imgs: [img(2, 9, 1, 12, "./images/23.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(38, 10, 91, 21),
      innerBoxStyle: innerBox(10, 21),
      imgs: [
        img(11, 9, 2, 14, "./images/25.png", randSpeed(), 0),
        img(1, 12, 13, 18, "./images/26.png", randSpeed(), 5),
        img(6, 12, 32, 12, "./images/29.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(12, 13, 101, 10),
      innerBoxStyle: innerBox(13, 10),
      imgs: [
        img(1, 15, 1, 16, "./images/27.png", randSpeed(), 0),
        img(18, 8, 8, 14, "./images/28.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(4, 4, 121, 6),
      innerBoxStyle: innerBox(4, 6),
      imgs: [img(1, 7, 2, 10, "./images/31.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(32, 5, 117, 7),
      innerBoxStyle: innerBox(5, 7),
      imgs: [img(1, 9, 2, 12, "./images/30.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(10, 12, 129, 17),
      innerBoxStyle: innerBox(12, 17),
      imgs: [
        img(7, 12, 2, 12, "./images/32.png", randSpeed(), 0),
        img(1, 8, 12, 14, "./images/35.png", randSpeed(), 5),
        img(10, 14, 22, 14, "./images/36.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(35, 12, 130, 9),
      innerBoxStyle: innerBox(12, 9),
      imgs: [
        img(13, 12, 2, 10, "./images/33.png", randSpeed(), 0),
        img(1, 10, 7, 12, "./images/34.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(30, 16, 148, 10),
      innerBoxStyle: innerBox(16, 10),
      imgs: [
        img(10, 11, 2, 10, "./images/37.png", randSpeed(), 0),
        img(1, 14, 10, 10, "./images/38.png", randSpeed(), 5),
        img(23, 9, 6, 14, "./images/39.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(3, 11, 155, 11),
      innerBoxStyle: innerBox(11, 11),
      imgs: [
        img(12, 11, 1, 16, "./images/40.png", randSpeed(), 0),
        img(1, 10, 12, 12, "./images/41.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(21, 5, 166, 7),
      innerBoxStyle: innerBox(5, 7),
      imgs: [img(1, 9, 2, 14, "./images/42.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(35, 11, 169, 16),
      innerBoxStyle: innerBox(11, 16),
      imgs: [
        img(16, 7, 1, 10, "./images/43.png", randSpeed(), 0),
        img(1, 7, 8, 10, "./images/44.png", randSpeed(), 0),
        img(13, 9, 17, 8, "./images/45.png", randSpeed(), 0),
        img(3, 11, 22, 12, "./images/47.png", randSpeed(), 5),
      ],
    },
    {
      boxStyle: box(2, 5, 179, 7),
      innerBoxStyle: innerBox(5, 7),
      imgs: [img(1, 9, 2, 14, "./images/46.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(13, 17, 188, 12),
      innerBoxStyle: innerBox(17, 12),
      imgs: [
        img(6, 10, 2, 14, "./images/44.png", randSpeed(), 0),
        img(19, 15, 8, 14, "./images/49.png", randSpeed(), 0),
        img(2, 10, 12, 14, "./images/50.png", randSpeed(), 5),
      ],
    },
    {
      boxStyle: box(36, 12, 201, 10),
      innerBoxStyle: innerBox(12, 10),
      imgs: [
        img(1, 9, 2, 14, "./images/51.png", randSpeed(), 0),
        img(12, 12, 7, 14, "./images/52.png", randSpeed(), 0),
      ],
    },
    {
      boxStyle: box(3, 6, 209, 5),
      innerBoxStyle: innerBox(6, 5),
      imgs: [img(1, 11, 2, 10, "./images/53.png", randSpeed(), 0)],
    },
    {
      boxStyle: box(24, 10, 213, 7),
      innerBoxStyle: innerBox(10, 7),
      imgs: [img(1, 9, 1, 14, "./images/54.png", randSpeed(), 0)],
    },
  ];

  const container = document.getElementById("container");

  // const controller = new ScrollMagic.Controller();

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];

    // Creating the box elements
    const boxEle = document.createElement("div");
    boxEle.classList.add("box");
    boxEle.setAttribute("style", box.boxStyle);

    // Creating the box inner elements
    const boxInnerEle = document.createElement("div");
    boxInnerEle.classList.add("box-inner");
    boxInnerEle.setAttribute("style", box.innerBoxStyle);

    for (let j = 0; j < box.imgs.length; j++) {
      const img = box.imgs[j];

      // Creating the image container elements
      const imgContainerEle = document.createElement("div");
      imgContainerEle.classList.add("img-container");
      imgContainerEle.setAttribute("style", img.style);
      imgContainerEle.classList.add("rellax");
      imgContainerEle.setAttribute("data-rellax-speed", img.speed);
      imgContainerEle.setAttribute("data-rellax-zindex", img.zIndex);

      // Creating the img elements
      const imgEle = document.createElement("img");
      imgEle.setAttribute("src", img.src);

      // Appending the img element to the img container
      imgContainerEle.appendChild(imgEle);

      // Appending the image container to the box inner element
      boxInnerEle.appendChild(imgContainerEle);
    }

    // Appending the box inner element to the box element
    boxEle.appendChild(boxInnerEle);

    container.appendChild(boxEle);
  }

  // const images = document.querySelectorAll(".img-container");
  // images.forEach((img) => {
  //   const tl = new TimelineLite({
  //     ease: "Power4.easeOut",
  //     scrollTrigger: {
  //       trigger: img,
  //       start: "top top+=100",
  //       markers: true,
  //       toggleActions: "restart pause play pause",
  //       // scrub: 1,
  //     },
  //   });
  //   tl.from(img, {
  //     opacity: 0.5,
  //   });
  // });

  // const rellax = new Rellax(".rellax");

  function box(colStart, colSpan, rowStart, rowSpan) {
    return `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`;
  }

  function innerBox(colSpan, rowSpan) {
    return `grid-template-columns: repeat(${colSpan * 2}, 1fr);
            grid-template-rows: repeat(${rowSpan * 2}, 1fr);`;
  }

  function img(colStart, colSpan, rowStart, rowSpan, imgSrc, speed, zIndex) {
    return {
      style: `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`,
      src: imgSrc,
      speed: speed,
      zIndex: zIndex,
    };
  }

  function randSpeed() {
    return Math.floor(Math.random() * (2 - -5) - 5);
  }
};
