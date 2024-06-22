// export const minXxxl = window.matchMedia("(min-width: 1921px)");
export const minMd = window.matchMedia("(min-width: 769px)");

export const maxXxl = window.matchMedia("(max-width: 1512px)");
export const maxXl = window.matchMedia("(max-width: 1200px)");
export const maxLg = window.matchMedia("(max-width: 1024px)");
export const maxMd = window.matchMedia("(max-width: 768px)");
export const maxSm = window.matchMedia("(max-width: 480px)");

// Clear focus from any element (except inputs) on mousemove
(function clearFocusOnMouseMove() {
  function removeFocus() {
    if (
      document.activeElement &&
      !document.activeElement.classList.contains("input")
    ) {
      document.activeElement.blur();
    }
  }
  // Set up event listeners
  document.addEventListener("mousemove", removeFocus);
})();

// Get Current Year for Copyright
(function getCurrentYear() {
  const yearText = document.querySelector(".year-text");
  const currentYear = new Date().getFullYear();

  yearText.innerHTML = currentYear;
  yearText.setAttribute("datetime", currentYear);
})();

//
// Detect Safari Browser
//
export const isSafari = () => {
  let ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
};
