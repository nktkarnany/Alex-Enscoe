window.onload = function (event) {
  let boxes = [
    {
      boxStyle: box(10, 12, 2, 12), // Box Params: Col Start, Col Span, Row Start, Row Span
      innerBoxStyle: innerBox(12, 12),
      imgs: [
        img(1, 5, 6, 5, "https://place-hold.it/500x300", 15, 0), // Img Params: Col Start, Col Span, Row Start, Row Span, Img Src, Speed, Z-Index
        img(4, 5, 2, 5, "https://place-hold.it/600x200", 1, 5),
      ],
    },
  ];

  const container = document.getElementById("container");

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

  let rellax = new Rellax(".rellax");

  function box(colStart, colSpan, rowStart, rowSpan) {
    return `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`;
  }

  function innerBox(colSpan, rowSpan) {
    return `grid-template-columns: repeat(${colSpan * 2}, 1fr);
            grid-template-rows: repeat(${rowSpan * 2}, 10px);`;
  }

  function img(colStart, colSpan, rowStart, rowSpan, imgSrc, speed, zIndex) {
    return {
      style: `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan};`,
      src: imgSrc,
      speed: speed,
      zIndex: zIndex,
    };
  }
};
