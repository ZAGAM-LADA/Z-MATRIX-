// ==========================================
// Z-MATRIX | Premium Landing Page
// Interactive JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // ---------- THEME SWITCHER ----------
    const themeButton = document.getElementById("themeToggle");
    const themes = ["midnight", "light", "ocean"];
    const validThemes = themes;
    const savedTheme = localStorage.getItem("zmatrix-theme");
    const initialTheme = validThemes.includes(savedTheme) ? savedTheme : "midnight";

    document.documentElement.setAttribute("data-theme", initialTheme);

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") || "midnight";
            const currentIndex = themes.indexOf(currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];

            document.documentElement.setAttribute("data-theme", nextTheme);
            localStorage.setItem("zmatrix-theme", nextTheme);
            themeButton.setAttribute(
                "aria-label",
                `Current theme: ${nextTheme}. Click to change theme.`
            );
            themeButton.title = `Theme: ${nextTheme}`;
        });
    }

    // ---------- MOBILE NAVIGATION ----------
    const menuButton = document.getElementById("menuToggle");
    const navigation = document.querySelector(".nav-links");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("active");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ---------- SMOOTH SCROLLING ----------
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const message =
                document.getElementById("message")?.value.trim() || "";

            if (!name || !email || !message) {
                alert("Please complete all fields before continuing.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const recipient = "zagam0003@gmail.com";
            const subject = encodeURIComponent(
                `Z-MATRIX Website Inquiry from ${name}`
            );
            const body = encodeURIComponent(
                `Hello Zaigham Shahzad,\n\n` +
                `Name: ${name}\nEmail: ${email}\n\n` +
                `Message:\n${message}\n\n` +
                `Sent through the Z-MATRIX website.`
            );

            window.location.href =
                `mailto:${recipient}?subject=${subject}&body=${body}`;
        });
    }

    // ---------- CURRENT YEAR ----------
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ---------- REVEAL ANIMATIONS ----------
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }

    // ---------- LINKEDIN PROFILE ----------
    document.querySelectorAll(".linkedin-link").forEach((link) => {
        link.href =
            "https://www.linkedin.com/in/zaigham-shahzad-1091423aa/";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    // ---------- EMAIL LINKS ----------
    document.querySelectorAll(".email-link").forEach((link) => {
        link.href = "mailto:zagam0003@gmail.com";
    });

    // ---------- PHONE LINKS ----------
    document.querySelectorAll(".phone-link").forEach((link) => {
        link.href = "tel:+923466377959";
    });

    console.log("Z-MATRIX landing page initialized successfully.");
});
