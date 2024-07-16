const videoSection = document.querySelector(".video-section"),
  videoPoster = document.querySelector(".video-section__poster"),
  videoWrapper = document.querySelector(".video-section__iframe-wrapper"),
  videoBtn = document.querySelector(".video-section__play-btn");

if (videoSection) {
  const playVideo = (e) => {
    videoWrapper.classList.add("active");
    document.body.style.overflow = "hidden";
    e.stopPropagation(); // Prevent the click event from bubbling up to the document
  };

  const closeVideo = (e) => {
    if (e.target.classList.contains("video-section__iframe-wrapper")) {
      videoWrapper.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  };

  videoPoster.addEventListener("click", playVideo);

  videoSection.addEventListener("click", closeVideo);

  // Play button, track mouse with velocity rotation
  if (window.matchMedia("(pointer: fine)").matches) {
    let previousX = 0;
    let previousTime = Date.now();

    videoPoster.addEventListener("mousemove", (e) => {
      const rect = videoPoster.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const posterWidth = videoPoster.offsetWidth / 2;
      const posterHeight = videoPoster.offsetHeight / 2;

      const currentTime = Date.now();
      const timeDelta = currentTime - previousTime;
      const deltaX = x - previousX;
      const velocity = deltaX / timeDelta;

      previousX = x;
      previousTime = currentTime;

      const maxRotation = 24; // Maximum rotation angle
      const rotationAngle =
        Math.min(maxRotation, Math.abs(velocity) * maxRotation) *
        Math.sign(velocity);

      videoBtn.style.translate = `calc(${x - posterWidth}px - 50%) calc(${
        y - posterHeight
      }px - 50%)`;
      videoBtn.style.rotate = `${-rotationAngle}deg`;
    });

    videoPoster.addEventListener("mouseleave", () => {
      videoBtn.style.translate = `-50% -50%`;
      videoBtn.style.rotate = `0deg`;
      previousX = 0; // Reset previous position
      previousTime = Date.now(); // Reset previous time
    });
  }

  // Play button, track mouse simple
  // if (window.matchMedia("(pointer: fine)").matches) {
  //   videoPoster.addEventListener("mousemove", (e) => {
  //     const rect = videoPoster.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;
  //     const posterWidth = videoPoster.offsetWidth / 2;
  //     const posterHeight = videoPoster.offsetHeight / 2;
  //     videoBtn.style.translate = `calc(${x - posterWidth}px - 50%) calc(${
  //       y - posterHeight
  //     }px - 50%)`;
  //   });

  //   videoPoster.addEventListener("mouseleave", () => {
  //     videoBtn.style.translate = `-50% -50%`;
  //   });
  // }
}
