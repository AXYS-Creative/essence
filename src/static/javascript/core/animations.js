gsap.registerPlugin(ScrollTrigger);

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(1)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 0,
//     start: "center 35%",
//     end: "bottom 20%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(2)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 0.25,
//     start: "center 34%",
//     end: "bottom 19%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(3)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 0.5,
//     start: "center 33%",
//     end: "bottom 18%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(4)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 0.75,
//     start: "center 32%",
//     end: "bottom 17%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(5)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 1,
//     start: "center 31%",
//     end: "bottom 16%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(6)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 1.25,
//     start: "center 30%",
//     end: "bottom 15%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(7)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 1.5,
//     start: "center 29%",
//     end: "bottom 14%",
//   },
//   y: "100%",
// });

// gsap.to(".home-hero__heading-text:first-of-type span:nth-of-type(8)", {
//   scrollTrigger: {
//     trigger: ".home-hero",
//     scrub: 1.75,
//     start: "center 28%",
//     end: "bottom 13%",
//   },
//   y: "100%",
// });

// const spans1 = document.querySelectorAll(
//   ".home-hero__heading-text:first-of-type span"
// );
// const spans2 = document.querySelectorAll(
//   ".home-hero__heading-text:last-of-type span"
// );

// const allSpans = [...spans1, ...spans2];

// const startValue = 35;
// const endValue = 20;
// const scrubIncrement = 0.12;

// allSpans.forEach((span, index) => {
//   const scrubValue = scrubIncrement * index;
//   const startPercentage = startValue - index * 2;
//   const endPercentage = endValue - index * 2;

//   gsap.to(span, {
//     scrollTrigger: {
//       trigger: ".home-hero",
//       scrub: scrubValue,
//       start: `center ${startPercentage}%`,
//       end: `bottom ${endPercentage}%`,
//       // markers: true,
//     },
//     y: "250%",
//   });
// });

//
//
//

// const spans = document.querySelectorAll(".home-hero__heading-text span");

// spans.forEach((span, index) => {
//   const startPercent = 36 - index; // Adjust the start value
//   const endPercent = 80 + index * 2; // Adjust the end value

//   gsap.to(span, {
//     scrollTrigger: {
//       trigger: ".home-hero__heading",
//       scrub: true,
//       start: `top ${startPercent}%`,
//       end: `${endPercent}% ${startPercent}%`,
//       markers: true,
//     },
//     y: "100%",
//   });
// });

//
//
//

const toggleClassAnimate = (
  selector,
  trigger,
  start = "top 92%",
  end = "center 4%",
  markers
) => {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: trigger,
      start: start,
      end: end,
      markers: markers,
      onEnter: () => document.querySelector(selector).classList.add("animate"),
      onLeave: () =>
        document.querySelector(selector).classList.remove("animate"),
      onEnterBack: () =>
        document.querySelector(selector).classList.add("animate"),
      onLeaveBack: () =>
        document.querySelector(selector).classList.remove("animate"),
    },
  });
};

toggleClassAnimate(
  ".home-hero__heading",
  ".home-hero__subtext",
  undefined,
  "120% top"
);
toggleClassAnimate(
  ".home-hero__subtext",
  ".home-hero__subtext",
  undefined,
  "120% top"
);
toggleClassAnimate(
  ".essence-paragraph__our-mission .essence-paragraph__heading-svg",
  ".essence-paragraph__our-mission .essence-paragraph__heading-svg"
);
toggleClassAnimate(
  ".essence-paragraph__media-praises .essence-paragraph__heading-svg",
  ".essence-paragraph__media-praises .essence-paragraph__heading-svg"
);
