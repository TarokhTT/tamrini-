(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Persian digit helper */
  const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const toFa = (value) => String(value).replace(/\d/g, (digit) => faDigits[Number(digit)]).replace(/\./g, "٫");

  /* Year */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    const jalaliYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" })
      .format(new Date())
      .replace(/[^\u06F0-\u06F9\d]/g, "");
    yearEl.textContent = jalaliYear || toFa(new Date().getFullYear());
  }

  /* Sticky header */
  const header = document.getElementById("siteHeader");

  /* Theme (day/night) switch */
  const themeToggle = document.getElementById("themeToggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const themeColors = { dark: "#111C27", light: "#FEFEFE" };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeColorMeta) themeColorMeta.setAttribute("content", themeColors[theme]);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
      themeToggle.title = theme === "light" ? "تغییر به حالت تاریک" : "تغییر به حالت روشن";
    }
  };

  applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (error) {
        /* storage unavailable */
      }
    });
  }

  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  /* Reveal on scroll */
  const revealables = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => entry.target.classList.add("is-visible"), index * 70);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px" }
    );
    revealables.forEach((el) => revealObserver.observe(el));
  }

  /* Animated counters */
  const counters = document.querySelectorAll("[data-count]");

  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = toFa(target.toFixed(decimals));
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = toFa((target * eased).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* Terminal typing effect */
  const terminal = document.getElementById("terminalOut");
  const lines = [
    { text: "$ kiatech deploy --prod", className: "cmd" },
    { text: "→ detected framework: next.js 15", className: "dim" },
    { text: "→ building 24 packages ............ done", className: "dim" },
    { text: "→ uploading artifacts to 120 regions", className: "dim" },
    { text: "✓ live at https://acme.kiatech.app", className: "ok" },
    { text: "  build 41s · cache hit 92% · p95 42ms", className: "dim" }
  ];

  const typeLines = () => {
    let lineIndex = 0;
    let charIndex = 0;
    terminal.textContent = "";

    const step = () => {
      if (lineIndex >= lines.length) {
        setTimeout(typeLines, 4500);
        return;
      }

      const line = lines[lineIndex];

      if (charIndex === 0) {
        const span = document.createElement("span");
        span.className = line.className;
        terminal.appendChild(span);
      }

      const current = terminal.lastChild;
      current.textContent = line.text.slice(0, ++charIndex);

      if (charIndex >= line.text.length) {
        terminal.appendChild(document.createTextNode("\n"));
        lineIndex += 1;
        charIndex = 0;
        setTimeout(step, 320);
        return;
      }

      setTimeout(step, 18);
    };

    step();
  };

  if (terminal) {
    if (prefersReducedMotion) {
      lines.forEach((line) => {
        const span = document.createElement("span");
        span.className = line.className;
        span.textContent = line.text + "\n";
        terminal.appendChild(span);
      });
    } else {
      typeLines();
    }
  }

  /* Pricing period toggle */
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const priceValues = document.querySelectorAll(".price span[data-monthly]");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleButtons.forEach((other) => other.classList.toggle("is-active", other === button));
      const period = button.dataset.period;
      priceValues.forEach((value) => {
        value.textContent = period === "yearly" ? value.dataset.yearly : value.dataset.monthly;
      });
    });
  });

  /* Signup form */
  const form = document.getElementById("signupForm");
  const message = document.getElementById("formMsg");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim();

    if (!emailPattern.test(email)) {
      message.textContent = "لطفاً یک ایمیل سازمانی معتبر وارد کنید.";
      message.classList.add("error");
      form.email.focus();
      return;
    }

    message.classList.remove("error");
    message.textContent = `سپاسگزاریم! راهنمای راه‌اندازی به ${email} ارسال شد.`;
    form.reset();
  });

  /* Back to top */
  document.getElementById("toTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
})();
