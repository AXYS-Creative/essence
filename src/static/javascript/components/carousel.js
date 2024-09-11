const carousel = document.querySelector(".carousel");
const carouselList = carousel?.querySelectorAll(".slide");
const paginationContainer = document.querySelector(".carousel-controls");

if (carousel && carouselList?.length > 0) {
  let currentSlide = 0;
  const totalSlides = carouselList.length;
  const intervalTime = 5000;
  let slideInterval;

  carouselList[currentSlide].classList.add("active");

  const createPagination = () => {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.classList.add("pagination-dot");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

      dot.addEventListener("click", () => {
        resetInterval();
        switchSlide(i);
      });

      paginationContainer.appendChild(dot);
    }

    paginationContainer.children[currentSlide].classList.add("active");
  };

  const switchSlide = (index) => {
    carouselList[currentSlide].classList.remove("active");
    paginationContainer.children[currentSlide].classList.remove("active");

    currentSlide = index;

    carouselList[currentSlide].classList.add("active");
    paginationContainer.children[currentSlide].classList.add("active");
  };

  const showNextSlide = () => {
    switchSlide((currentSlide + 1) % totalSlides);
  };

  const startInterval = () => {
    slideInterval = setInterval(showNextSlide, intervalTime);
  };

  const resetInterval = () => {
    clearInterval(slideInterval);
    startInterval();
  };

  startInterval();
  createPagination();
}
