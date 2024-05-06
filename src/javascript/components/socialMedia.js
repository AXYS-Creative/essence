const socialMediaWrapper = document.querySelector(".social-media-wrapper"),
  socialMediaToggle = document.querySelector(".social-media-toggle"),
  socialMediaLinks = document.querySelector(".social-media-links");

socialMediaToggle.addEventListener("click", () => {
  console.log("clicking the toggle");
  socialMediaWrapper.classList.toggle("social-media-active");

  const isSocialOpen = socialMediaWrapper.classList.contains(
    "social-media-active"
  );

  socialMediaToggle.setAttribute("aria-expanded", isSocialOpen);
  socialMediaLinks.setAttribute("aria-hidden", !isSocialOpen);
});
