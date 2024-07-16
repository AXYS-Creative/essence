const videoSection = document.querySelector(".video-section"),
  videoPoster = document.querySelector(".video-section__poster"),
  iframe = document.querySelector(".video-section iframe"),
  videoBtn = document.querySelector(".video-section__play-btn");

if (videoSection) {
  iframe.classList.add("podcast-iframe");

  const playVideo = () => {
    iframe.classList.add("active");
  };

  const closeVideo = (e) => {
    if (!e.target.classList.contains("podcast-iframe")) {
      iframe.classList.remove("active");
    }
  };

  videoPoster.addEventListener("click", playVideo);

  videoSection.addEventListener("click", closeVideo);

  // Play button / Mouse cursor
  if (window.matchMedia("(pointer: fine)").matches) {
    videoPoster.addEventListener("mousemove", (e) => {
      const rect = videoPoster.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const posterWidth = videoPoster.offsetWidth / 2;
      const posterHeight = videoPoster.offsetHeight / 2;
      videoBtn.style.translate = `calc(${x - posterWidth}px - 50%) calc(${
        y - posterHeight
      }px - 50%)`;
    });

    videoPoster.addEventListener("mouseleave", () => {
      videoBtn.style.translate = `-50% -50%`;
    });
  }
}
