// export const minXxxl = window.matchMedia("(min-width: 1921px)");
export const minMd = window.matchMedia("(min-width: 769px)");
export const minLg = window.matchMedia("(min-width: 1025px)");

export const maxXxl = window.matchMedia("(max-width: 1512px)");
export const maxXl = window.matchMedia("(max-width: 1200px)");
export const maxLg = window.matchMedia("(max-width: 1024px)");
export const maxMd = window.matchMedia("(max-width: 768px)");
export const maxSm = window.matchMedia("(max-width: 480px)");

// // Page specific logic, intended for nav links (active page)
// export const path = window.location.pathname;

// export const pageClasses = {
//   "/blog": "blog-page",
//   "/podcast": "podcast-page",
//   "/books": "books-page",
//   "/films": "films-page",
//   "/about": "about-page",
//   "/resources": "resources-page",
//   "/contact": "contact-page",
// };

// Get Current Year for Copyright
const getCurrentYear = (() => {
  const yearText = document.querySelector(".year-text");
  const currentYear = new Date().getFullYear();

  yearText.innerHTML = currentYear;
  yearText.setAttribute("datetime", currentYear);
})();

// Fetch local time for each office
const getLocalTime = (() => {
  const timeElements = document.querySelectorAll(
    ".locations__details-time time"
  );

  timeElements.forEach((element) => {
    const timezone = element.getAttribute("data-timezone");

    function updateTime() {
      const now = new Date();
      const options = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
        hour12: true, // Toggle for 12 hour vs 24 hour clock
      };
      const timeString = new Intl.DateTimeFormat([], options).format(now);
      const isoString = now.toISOString();

      element.textContent = `${timeString}`;
      element.setAttribute("datetime", isoString);
    }

    updateTime();

    setInterval(updateTime, 1000);
  });
})();

// Detect Safari Browser
export const isSafari = () => {
  let ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
};
