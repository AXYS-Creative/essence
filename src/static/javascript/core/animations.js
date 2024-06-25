gsap.registerPlugin(ScrollTrigger);

// Responsive animations go here
const responsiveAnimations = (() => {
  let responsiveGsap = gsap.matchMedia();

  responsiveGsap.add(
    {
      maxSm: "(max-width: 480px)",
      maxMd: "(max-width: 768px)",
      maxXl: "(max-width: 1200px)",
      minMd: "(min-width: 769px)",
    },
    (context) => {
      let { maxSm, maxMd, maxXl, minMd } = context.conditions;

      // About Page
      if (window.location.pathname.includes("about")) {
        // Collage Hero
        const createScrollTriggerAnimation = (
          selector,
          endY,
          endYxl,
          endYsm
        ) => {
          gsap.fromTo(
            selector,
            { y: 0 },
            {
              y: maxSm ? endYsm : maxXl ? endYxl : endY,
              scrollTrigger: {
                trigger: ".collage",
                start: "top top",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        };

        createScrollTriggerAnimation(
          ".collage-column__inner-1",
          "-24%",
          "-14%",
          null
        );
        createScrollTriggerAnimation(
          ".collage-column__inner-3",
          "-10%",
          "-14%",
          "-29.5%"
        );
        createScrollTriggerAnimation(
          ".collage-column__inner-5",
          "-24%",
          null,
          null
        );

        // Team Portraits
        const pinnedSection = document.querySelector(".essence-team");
        const slider = document.querySelector(".pinned-slider__inner");
        const container = document.querySelector(".pinned-slider");
        const sliderWidth = slider.scrollWidth;
        const containerWidth = container.offsetWidth;
        const distanceToTranslate = sliderWidth - containerWidth;

        gsap.to(pinnedSection, {
          scrollTrigger: {
            trigger: pinnedSection,
            start: "top top",
            // end: "bottom top",
            end: "+=200%",
            pin: true,
            // markers: true,
          },
        });

        gsap.fromTo(
          slider,
          { x: 0 },
          {
            x: () => -distanceToTranslate,
            ease: "none",
            scrollTrigger: {
              trigger: ".essence-team",
              start: "top top",
              // end: "bottom top",
              end: "+=200%",
              scrub: 0.2,
              // markers: {
              //   startColor: "navy",
              //   endColor: "navy",
              //   indent: 124,
              // },
            },
          }
        );
      }
    }
  );
})();

// Toggle an '.animate' class to be used by the css
const generalClassToggle = (() => {
  const toggleClassAnimate = (
    selector,
    trigger,
    start = "top 92%",
    end = "center 4%",
    markers
  ) => {
    const targetElement = document.querySelector(selector);
    const triggerElement = document.querySelector(trigger);

    if (!targetElement || !triggerElement) {
      // console.warn(`Element(s) not found: ${selector} or ${trigger}`);
      return;
    }

    gsap.to(selector, {
      scrollTrigger: {
        trigger: trigger,
        start: start,
        end: end,
        markers: markers,
        onEnter: () => targetElement.classList.add("animate"),
        onLeave: () => targetElement.classList.remove("animate"),
        onEnterBack: () => targetElement.classList.add("animate"),
        onLeaveBack: () => targetElement.classList.remove("animate"),
      },
    });
  };

  // Hero (Home)
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

  // Essence Paragraph - Our Mission (Home)
  toggleClassAnimate(
    ".essence-paragraph__our-mission .essence-paragraph__heading-svg",
    ".essence-paragraph__our-mission .essence-paragraph__heading-svg"
  );
  toggleClassAnimate(
    ".essence-paragraph__our-mission .essence-paragraph__body-text",
    ".essence-paragraph__our-mission .essence-paragraph__body-text",
    "top bottom",
    "bottom top"
  );

  // Essence Paragraph - Media Praises (Home)
  toggleClassAnimate(
    ".essence-paragraph__media-praises .essence-paragraph__heading-svg",
    ".essence-paragraph__media-praises .essence-paragraph__heading-svg"
  );
  toggleClassAnimate(
    ".essence-paragraph__media-praises .essence-paragraph__body-text",
    ".essence-paragraph__media-praises .essence-paragraph__body-text",
    "top bottom",
    "bottom top",
    false
  );

  // Archive Page __ Hero Paragraph
  toggleClassAnimate(
    ".hero-paragraph .essence-paragraph__heading-svg",
    ".hero-paragraph .essence-paragraph__heading-svg"
  );
  toggleClassAnimate(
    ".hero-paragraph .essence-paragraph__body-text",
    ".hero-paragraph .essence-paragraph__body-text",
    "top bottom",
    "bottom top"
  );

  // About Page __ Paragraph
  toggleClassAnimate(".collage", ".collage", "top bottom", "90% 4%", false);
  toggleClassAnimate(
    ".essence-paragraph__about-us .essence-paragraph__heading-svg",
    ".essence-paragraph__about-us .essence-paragraph__heading-svg"
  );
  toggleClassAnimate(
    ".essence-paragraph__about-us .essence-paragraph__body-text",
    ".essence-paragraph__about-us .essence-paragraph__body-text",
    "top bottom",
    "bottom top"
  );
})();

// Animating the body text of 'Paragraph Partial'. Splitting each word.
const paragraphPartialAnimation = (() => {
  const spanWordsInParagraph = (paragraphClass) => {
    const paragraph = document.querySelector(paragraphClass);
    if (paragraph) {
      const text = paragraph.textContent || paragraph.innerText;
      const words = text.trim().split(/\s+/);

      const wrappedWords = words
        .map(
          (word) =>
            `<span class="outter-span"><span class="inner-span">${word}</span></span>`
        )
        .join(" ");

      paragraph.innerHTML = wrappedWords;
    }
    // else {
    //   console.log(`Element with class ${paragraphClass} not found.`);
    // }
  };

  spanWordsInParagraph(
    ".essence-paragraph__our-mission .essence-paragraph__body-text"
  );
  spanWordsInParagraph(
    ".essence-paragraph__media-praises .essence-paragraph__body-text"
  );
  spanWordsInParagraph(".hero-paragraph .essence-paragraph__body-text");
  spanWordsInParagraph(
    ".essence-paragraph__about-us .essence-paragraph__body-text"
  );
})();

// About Page - Recorded Growth
const numberTickerAnimation = (() => {
  const numberCounters = document.querySelectorAll(".number-counter");

  numberCounters.forEach((numberCounter) => {
    wrapNumbers(numberCounter);

    ScrollTrigger.create({
      trigger: numberCounter,
      start: "top 98%",
      end: "bottom 2%",
      onEnter: () => counterCountUp(numberCounter),
      onLeave: () => counterReset(numberCounter),
      onEnterBack: () => counterCountUp(numberCounter),
      onLeaveBack: () => counterReset(numberCounter),
    });
  });

  function wrapNumbers(element) {
    let characters = element.textContent.trim().split("");

    characters = characters.map((el) => {
      if (!isNaN(el)) {
        return `<span class='digit' data-counter-value='${el}'><span class='sequence'>0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9</span></span>`;
      }
      return el;
    });

    element.innerHTML = characters.join("");
  }

  const counterCountUp = (counter) => {
    const digits = counter.querySelectorAll(".digit");

    digits.forEach((digit) => {
      const sequence = digit.querySelector(".sequence");
      const value = digit.getAttribute("data-counter-value");

      gsap.to(sequence, {
        y: `-${value * 10}%`,
        duration: 1,
        ease: "power2.out",
        onUpdate: function () {
          sequence.style.transform = `translate3d(0, ${-(value * 10)}%, 0)`;
        },
      });
    });
  };

  const counterReset = (counter) => {
    const digits = counter.querySelectorAll(".digit");

    digits.forEach((digit) => {
      const sequence = digit.querySelector(".sequence");

      gsap.to(sequence, {
        y: "0%",
        duration: 1,
        ease: "power2.out",
        onUpdate: function () {
          sequence.style.transform = `translate3d(0, 0, 0)`;
        },
      });
    });
  };
})();
