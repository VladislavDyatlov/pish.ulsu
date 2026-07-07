(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Функция переключения меню
  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("translate-y-0");
    if (isOpen) {
      // Закрыть меню
      mobileMenu.classList.remove(
        "translate-y-0",
        "opacity-100",
        "pointer-events-auto",
      );
      mobileMenu.classList.add(
        "-translate-y-full",
        "opacity-0",
        "pointer-events-none",
      );
      menuToggle.setAttribute("aria-expanded", "false");
      // Иконка возвращается в гамбургер
      menuIcon.innerHTML = `
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        `;
    } else {
      // Открыть меню
      mobileMenu.classList.remove(
        "-translate-y-full",
        "opacity-0",
        "pointer-events-none",
      );
      mobileMenu.classList.add(
        "translate-y-0",
        "opacity-100",
        "pointer-events-auto",
      );
      menuToggle.setAttribute("aria-expanded", "true");
      // Иконка меняется на крестик
      menuIcon.innerHTML = `
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        `;
    }
  }

  // Обработчик клика на гамбургер
  menuToggle.addEventListener("click", toggleMenu);

  // Закрытие меню при клике на любую ссылку внутри мобильного меню
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Если меню открыто – закрываем
      if (mobileMenu.classList.contains("translate-y-0")) {
        toggleMenu();
      }
    });
  });

  // Закрытие меню при клике вне его (опционально)
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      if (mobileMenu.classList.contains("translate-y-0")) {
        toggleMenu();
      }
    }
  });
})();
