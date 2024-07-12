const videoSection = document.querySelector(".video-section");
const iframe = document.querySelector(".video-section iframe");
const videoBtn = document.querySelector(".video-section__controls-play-btn");

if (videoSection) {
  const playVideo = () => {
    iframe.classList.add("active");
  };

  const closeVideo = (e) => {
    if (e.target === e.currentTarget) {
      iframe.classList.remove("active");
    }
  };

  videoBtn.addEventListener("click", playVideo);

  videoSection.addEventListener("click", closeVideo);
}
