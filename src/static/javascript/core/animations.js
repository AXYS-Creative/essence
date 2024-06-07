gsap.registerPlugin(ScrollTrigger);

//
// Home Hero Text
//

gsap.fromTo(
  ".home-hero__heading-text",
  {
    // y: "100%",
    opacity: 0,
  },
  {
    // y: "0%",
    opacity: 1,
    duration: 0.6,
    delay: 0.6,
    scrollTrigger: {
      trigger: ".home-hero__heading",
      start: "center 60%",
      end: "center top",
      toggleActions: "play reverse play reverse",
      // markers: true,
    },
  }
);

// gsap.fromTo(
//   ".home-hero__heading",
//   {
//     y: "100%",
//   },
//   {
//     y: "0%",
//     duration: 0.4,
//     delay: 0.5,
//     scrollTrigger: {
//       trigger: ".home-hero__heading",
//       start: "center 60%",
//       end: "center top",
//       toggleActions: "play none restart reverse",
//       // markers: {
//       //   startColor: "navy",
//       //   endColor: "navy",
//       //   indent: 48,
//       // },
//     },
//   }
// );

//
// Home Hero Subtext
//

// gsap.fromTo(
//   ".home-hero__subtext",
//   {
//     opacity: 0,
//   },
//   {
//     opacity: 1,
//     duration: 1,
//     delay: 3,
//     scrollTrigger: {
//       trigger: ".home-hero__heading",
//       start: "center 50%",
//       end: "center top",
//       // scrub: true,
//       toggleActions: "play reverse play reverse",
//       // markers: true,
//     },
//   }
// );
