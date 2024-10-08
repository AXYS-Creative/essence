gsap.registerPlugin(ScrollTrigger);

/**
 * NOTE: The placement of functions can alter the animation.
 * For example - Placing the 'pinnedSectionAnimation()' after/beneath
 * the 'generalClassToggle' seems to break the footer brand name animation
 */

// Responsive animations go here
const responsiveAnimations = (() => {
  let responsiveGsap = gsap.matchMedia();

  responsiveGsap.add(
    {
      maxSm: "(max-width: 580px)", // Unique Media Query
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
                end: maxSm ? "bottom 75%" : "bottom top",
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
          ".collage-column__inner-2",
          undefined,
          undefined,
          "12%"
        );
        createScrollTriggerAnimation(
          ".collage-column__inner-3",
          "-10%",
          "-14%",
          "-4.4%"
        );
        createScrollTriggerAnimation(
          ".collage-column__inner-5",
          "-24%",
          null,
          null
        );
      }

      // About Page - Pinned Section (Team Portraits). Might make it global.
      const pinnedSection = document.querySelector(".pinned-section");
      if (pinnedSection) {
        const container = document.querySelector(".pinned-img-slider");
        const slider = document.querySelector(".pinned-img-slider__inner");
        const sliderWidth = slider.scrollWidth;
        const containerWidth = container.offsetWidth;
        const distanceToTranslate = sliderWidth - containerWidth;

        // Actual Pinning
        gsap.to(pinnedSection, {
          scrollTrigger: {
            trigger: pinnedSection,
            start: "top top",
            end: maxSm ? "+=320%" : "+=400%",
            pin: true,
          },
        });

        // Slider Along X-Axis
        gsap.fromTo(
          slider,
          { x: 0 },
          {
            x: () => -distanceToTranslate,
            ease: "none",
            scrollTrigger: {
              trigger: pinnedSection,
              start: "top top",
              end: maxSm ? "+=320%" : "+=400%",
              scrub: maxSm ? 1 : 0.25,
            },
          }
        );

        // Horizontal Parallax
        const startPositions = [
          "-6%",
          "-6%",
          "-10%",
          "-16%",
          "-20%",
          "-32%",
          "-48%",
          "-80%",
        ];
        const endPositions = [
          "10%",
          "8%",
          "6%",
          "2%",
          "0%",
          "-6%",
          "-6%",
          "-8%",
        ];

        startPositions.forEach((startPos, index) => {
          gsap.fromTo(
            `.portrait:nth-of-type(${index + 1}) img`,
            {
              x: startPos,
            },
            {
              x: endPositions[index],
              scrollTrigger: {
                trigger: pinnedSection,
                start: "top top",
                end: maxSm ? "+=320%" : "+=400%",
                scrub: maxSm ? 0 : 0.2,
              },
            }
          );
        });
      }
    }
  );
})();

// SCOPED - Specify an element to toggle an '.animate' class used by the css
const generalClassToggle = (() => {
  const toggleClassAnimate = (
    selector,
    trigger,
    start = "top 96%",
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

  // Global Footer - Essence brand name
  toggleClassAnimate(".brand-name-wrapper", ".brand-name-wrapper");

  // Home Page - Hero
  toggleClassAnimate(
    ".home-hero__heading",
    ".classic-hero__subtext",
    undefined,
    "120% top"
  );

  // Classic Hero - Home & Contact Pages
  toggleClassAnimate(
    ".classic-hero__heading",
    ".classic-hero__subtext",
    undefined,
    "120% top"
  );
  toggleClassAnimate(
    ".classic-hero__subtext",
    ".classic-hero__subtext",
    undefined,
    "120% top"
  );

  // About Page - Hero Collage
  toggleClassAnimate(".collage", ".collage", "top bottom", "90% 4%");

  // About Page - Pinned Slider Heading
  toggleClassAnimate(
    ".essence-team__heading",
    ".pinned-section",
    "top 80%",
    "+=480%"
  );

  // SLIDER SVG - Blog Archive
  toggleClassAnimate(
    ".slider-header__blog-svg",
    ".slider-listing",
    "top 70%",
    "bottom 8%"
  );
  // SLIDER SVG - Podcast Archive
  toggleClassAnimate(
    ".slider-header__podcast-svg",
    ".slider-listing",
    "top 70%",
    "bottom 8%"
  );
  // SLIDER SVG - Resources Page (Services)
  toggleClassAnimate(
    ".slider-header__services-svg",
    ".slider-listing",
    "top 70%",
    "bottom 8%"
  );
})();

// GLOBAL - Easily toggle an 'animate' class on any element with 'gsap-animate' class
const globalGenerateAnimate = (() => {
  const targetElements = document.querySelectorAll(".gsap-animate");

  targetElements.forEach((targetElem) => {
    gsap.to(targetElem, {
      scrollTrigger: {
        trigger: targetElem,
        start: "top 98%",
        end: "bottom top",
        onEnter: () => targetElem.classList.add("animate"),
        onLeave: () => targetElem.classList.remove("animate"),
        onEnterBack: () => targetElem.classList.add("animate"),
        onLeaveBack: () => targetElem.classList.remove("animate"),
      },
    });
  });

  // GAME CHANGER!!!
  // Refresh ScrollTrigger instances on page load and resize
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // Greater than 520 so it doesn't refresh on  mobile(dvh)
  if (window.innerWidth > 520) {
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });
  }
})();

// Simple reveal that uses the parent class '.show-element__parent' and '.show-element__child'
const slideUpReveal = (() => {
  document
    .querySelectorAll(".show-element__parent")
    .forEach((parentElement) => {
      const targetChildren = parentElement.querySelectorAll(
        ".show-element__child"
      );

      targetChildren.forEach((childElement) => {
        gsap.fromTo(
          childElement,
          {
            y: 100,
          },
          {
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: parentElement,
              start: "top 98%",
              end: "center 2%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    });
})();

// Animating each word via 'word-split' utility class. Also add 'gsap-animate' to the element.
const wordSplit = (() => {
  const spanWordsInParagraph = (paragraph) => {
    const text = paragraph.textContent || paragraph.innerText;
    const words = text.trim().split(/\s+/);

    const wrappedWords = words
      .map(
        (word) =>
          `<span class="outer-span"><span class="inner-span">${word}</span></span>`
      )
      .join(" ");

    paragraph.innerHTML = wrappedWords;
  };

  const applyWordWrappingToAll = (globalClass) => {
    const paragraphs = document.querySelectorAll(globalClass);
    paragraphs.forEach((paragraph) => spanWordsInParagraph(paragraph));
  };

  applyWordWrappingToAll(".word-split");
})();

// Animating each letter per word via 'character-split' utility class. Also add 'gsap-animate' to the element
const characterSplit = (() => {
  const spanCharactersInSentence = (words) => {
    const text = words.textContent || words.innerText;
    words.setAttribute("aria-label", text); // Provide the full text for screen readers
    const wordsArray = text.split(" "); // Split the text into words

    const wrappedWords = wordsArray
      .map((word) => {
        const wrappedLetters = word
          .split("")
          .map(
            (letter) => `<span class="character-split__letter">${letter}</span>`
          )
          .join("");

        return `<span class="character-split__word">${wrappedLetters}</span>`;
      })
      .join('<span class="character-split__space" aria-hidden="true"> </span>'); // Join words with space span

    words.innerHTML = wrappedWords;
  };

  const splitCharactersGlobally = (globalClass) => {
    const sentences = document.querySelectorAll(globalClass);
    sentences.forEach((sentence) => spanCharactersInSentence(sentence));
  };

  splitCharactersGlobally(".character-split");
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

// Image Banner Sections (Podcast, Books, etc.) - Parallax Effect
const parallaxEffect = (() => {
  let parallaxElems = document.querySelectorAll(".parallax");

  if (parallaxElems) {
    parallaxElems.forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -16 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".podcast-quote",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }
})();

// Three line paragraph found on most pages
const textBlockAnimation = (() => {
  const elements = document.querySelectorAll(
    ".text-block__line-inner, .text-block__line-inner-2, .text-block__line-inner-3, .text-block__line-inner-4"
  );

  elements.forEach((element) => {
    gsap.to(element, {
      yPercent: 100,
      scrollTrigger: {
        trigger: element,
        scrub: 0.2,
        start: "top 80%",
        end: "bottom 50%",
      },
    });
  });
})();
