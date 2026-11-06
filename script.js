

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------
  // 1. DARK MODE / LIGHT MODE
  // -----------------------------------------

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const themeLabel = document.querySelector(".theme-label");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const savedTheme = localStorage.getItem("miksha-theme");

  function applyTheme(theme) {
    const isLight = theme === "light";

    root.dataset.theme = theme;

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-pressed",
        String(isLight)
      );

      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
    }

    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☼";
    }

    if (themeLabel) {
      themeLabel.textContent = isLight ? "DARK MODE" : "LIGHT MODE";
    }

    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        isLight ? "#f5f4ef" : "#111111"
      );
    }

    localStorage.setItem("miksha-theme", theme);
  }

  // Restore the visitor's last selected theme.
  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);
    });
  }

  // -----------------------------------------
  // 2. PROJECT SEARCH AND CATEGORY FILTERS
  // -----------------------------------------

  const projectCards = [
    ...document.querySelectorAll(".project-card")
  ];

  const filterButtons = [
    ...document.querySelectorAll(".filter-btn")
  ];

  const searchInput = document.querySelector("#project-search");
  const noProjectsMessage = document.querySelector("#no-projects");

  let activeFilter = "all";

  function filterProjects() {
    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const searchableContent = card.textContent.toLowerCase();

      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch =
        searchableContent.includes(searchTerm);

      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    if (noProjectsMessage) {
      noProjectsMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  filterProjects();

  // -----------------------------------------
  // 3. ACTIVE NAVIGATION
  // -----------------------------------------

  const navLinks = [
    ...document.querySelectorAll(".nav-link")
  ];

  const observedSections = [
    ...document.querySelectorAll(
      "#home, #projects, #about, #contact"
    )
  ];

  function setActiveNavigation(sectionId) {
    navLinks.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveNavigation(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // -----------------------------------------
  // 4. SMOOTH NAVIGATION
  // -----------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });

  // -----------------------------------------
  // 5. FOOTER YEAR
  // -----------------------------------------

  const footerYear = document.querySelector(".footer-year");

  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()}`;
  }
});


document.querySelectorAll(".copy-email-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.dataset.email;
    const originalText = button.innerHTML;

    try {
      await navigator.clipboard.writeText(email);
      button.innerHTML = "COPIED ✓";

      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1800);
    } catch (error) {
      window.prompt("Copy this email address:", email);
    }
  });
});


const typedGreeting = document.getElementById("typed-greeting");

if (typedGreeting) {
  const roles = [
    "DESIGNER.",
    "DEVELOPER.",
    "CODER.",
    "PROGRAMMER.",
    "WRITER. ♡"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedGreeting.textContent = currentRole.slice(0, charIndex);

    let delay = deleting ? 45 : 95;

    if (!deleting && charIndex === currentRole.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(typeRole, delay);
  }

  typeRole();
}

// LIVE JOHANNESBURG CLOCK — 12-HOUR FORMAT
function updateClock() {
  const clock = document.getElementById("live-clock");
  if (!clock) return;

  clock.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);