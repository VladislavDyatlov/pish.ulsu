(function () {
  // Анимация появления элементов с классом fade-in-up
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".fade-in-up")
    .forEach((el) => observer.observe(el));

  // Добавление тени навбару при скролле
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("shadow-sm", "border-b", "border-gray-200/80");
    } else {
      navbar.classList.remove("shadow-sm", "border-b", "border-gray-200/80");
    }
  });
})();
