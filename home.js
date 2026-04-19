(function () {
  "use strict";

  var THEME_KEY = "portfolio-theme";
  var themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(THEME_KEY, theme === "light" ? "light" : "dark");
    } catch (e) {}
    syncThemeToggle();
  }

  function syncThemeToggle() {
    if (!themeToggle) return;
    var isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.title = isLight ? "Dark mode" : "Light mode";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      applyTheme(next);
    });
    syncThemeToggle();
  }

  var header = document.querySelector(".site-header");
  var navLinks = document.querySelectorAll(".nav a[href^='#']");
  var sections = document.querySelectorAll("main section[id]");

  document.documentElement.style.setProperty(
    "--scroll-padding",
    (header ? header.offsetHeight : 0) + 16 + "px"
  );

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  function setActiveNav() {
    var scrollY = window.scrollY + (header ? header.offsetHeight + 40 : 100);
    var current = "";
    sections.forEach(function (section) {
      var top = section.offsetTop;
      if (scrollY >= top) current = section.getAttribute("id") || "";
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (header) {
          header.classList.toggle("is-scrolled", window.scrollY > 12);
        }
        setActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  setActiveNav();
})();
