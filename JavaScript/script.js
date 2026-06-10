/* ============================================================
   PHIWE BHENGU — Portfolio JavaScript
   
   Interaction 1: Navigation injection + hamburger toggle
   Interaction 2: Dynamic project filtering (isotope-style)
   Interaction 3: Modal / lightbox
   Interaction 4: Contact form real-time validation
   ============================================================ */

/* ============================================================
   INTERACTION 1: NAVIGATION INJECTION
   Builds the <nav> once in JS and injects it on every page,
   eliminating duplicate HTML across files (brief requirement).
   ============================================================ */
function buildNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  const links = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "projects.html", label: "Projects" },
    { href: "contact.html", label: "Contact" },
  ];

  const desktopItems = links
    .map(
      (l) =>
        `<li><a href="${l.href}" class="${page === l.href ? "active" : ""}">${l.label}</a></li>`,
    )
    .join("");

  const mobileItems = links
    .map(
      (l) =>
        `<li><a href="${l.href}" onclick="closeMenu()">${l.label}</a></li>`,
    )
    .join("");

  return `
    <nav>
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">Phiwe Bhengu</a>
        <ul class="nav-links">${desktopItems}</ul>
        <div class="hamburger-icon" id="hamburger-icon" onclick="toggleMenu()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <ul>${mobileItems}</ul>
    </div>
  `;
}

function buildFooter() {
  return `
    <footer>
      <div class="footer-inner">
        <span class="footer-logo">Phiwe Bhengu</span>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
        <p class="footer-copy">&#169; 2026 Phiwe Bhengu. All Rights Reserved.</p>
      </div>
    </footer>
  `;
}

/* Hamburger toggle */
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function closeMenu() {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.remove("open");
  icon.classList.remove("open");
}

/* Close mobile menu when clicking outside */
document.addEventListener("click", function (e) {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("hamburger-icon");
  if (menu && icon && menu.classList.contains("open")) {
    if (!menu.contains(e.target) && !icon.contains(e.target)) {
      closeMenu();
    }
  }
});

/* ============================================================
   INTERACTION 2: DYNAMIC PROJECT FILTERING
   Reads data-category on each card and toggles .hidden class.
   Cards fade in with a CSS transition on match.
   ============================================================ */
function initFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const noResults = document.getElementById("no-results");

  if (!filterBtns.length) return; // Not on projects page

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      let visible = 0;

      projectCards.forEach((card) => {
        const cats = card.getAttribute("data-category") || "";
        const match = filter === "all" || cats.split(" ").includes(filter);

        if (match) {
          card.classList.remove("hidden");
          // Fade-in animation
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          requestAnimationFrame(() => {
            card.style.transition = "opacity 350ms ease, transform 350ms ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
          visible++;
        } else {
          card.classList.add("hidden");
          card.style.transition = "";
        }
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
      }
    });
  });
}

/* ============================================================
   INTERACTION 3: MODAL / LIGHTBOX
   Any image with class .lightbox-trigger (or .card-image)
   opens a full-screen overlay when clicked.
   ============================================================ */
function initModal() {
  const overlay = document.getElementById("modal-overlay");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

  if (!overlay || !modalImg || !closeBtn) return;

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Attach to trigger images
  document.querySelectorAll(".lightbox-trigger, .card-image").forEach((img) => {
    img.addEventListener("click", function () {
      openModal(this.src, this.alt);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ============================================================
   INTERACTION 4: CONTACT FORM VALIDATION
   Real-time validation on blur, regex check for email,
   replaces form with success message on valid submit.
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const successDiv = document.getElementById("form-success");
  if (!form) return;

  const fields = ["name", "email", "subject", "message"];

  // Real-time: clear error as user types
  fields.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => clearError(id));
    input.addEventListener("blur", () => validateField(id, input.value.trim()));
  });

  // Submit handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const results = fields.map((id) => {
      const input = document.getElementById(id);
      return input ? validateField(id, input.value.trim()) : true;
    });

    if (results.every(Boolean)) {
      form.style.display = "none";
      if (successDiv) successDiv.classList.add("visible");
    }
  });
}

function validateField(id, value) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(id + "-error");
  if (!input) return true;

  let valid = true;

  if (id === "email") {
    // RFC-compliant email regex
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  } else {
    valid = value.length > 0;
  }

  if (!valid) {
    input.classList.add("error");
    if (errorEl) errorEl.classList.add("visible");
  } else {
    input.classList.remove("error");
    if (errorEl) errorEl.classList.remove("visible");
  }

  return valid;
}

function clearError(id) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(id + "-error");
  if (input) input.classList.remove("error");
  if (errorEl) errorEl.classList.remove("visible");
}

/* ============================================================
   SKILL BARS ANIMATION (About page)
   Uses IntersectionObserver to animate on scroll.
   ============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-width");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  fills.forEach((f) => observer.observe(f));
}

/* ============================================================
   BOOT — inject nav, footer, then init all interactions
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  // Inject navigation and footer on every page
  const navPH = document.getElementById("nav-placeholder");
  const footerPH = document.getElementById("footer-placeholder");
  if (navPH) navPH.innerHTML = buildNav();
  if (footerPH) footerPH.innerHTML = buildFooter();

  // Init all interactions (each checks if relevant elements exist)
  initFilter();
  initModal();
  initContactForm();
  initSkillBars();
});
