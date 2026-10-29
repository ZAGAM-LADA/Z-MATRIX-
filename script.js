/* Z-MATRIX | Agency site interactions */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Theme picker: light is the default; selected themes persist on this device.
  const themeSelect = document.getElementById("themeSelect");
  const validThemes = new Set(["light", "midnight", "ocean", "violet", "forest"]);
  let initialTheme = "light";
  try {
    const storedTheme = localStorage.getItem("zmatrix-theme");
    if (storedTheme && validThemes.has(storedTheme)) initialTheme = storedTheme;
  } catch (_) { /* Keep the default when browser storage is unavailable. */ }
  document.documentElement.dataset.theme = initialTheme;
  if (themeSelect) {
    themeSelect.value = initialTheme;
    themeSelect.addEventListener("change", () => {
      const nextTheme = themeSelect.value;
      if (!validThemes.has(nextTheme)) return;
      document.documentElement.dataset.theme = nextTheme;
      try { localStorage.setItem("zmatrix-theme", nextTheme); } catch (_) { /* Theme still changes for this session. */ }
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    });
  }

  // Responsive navigation menu.
  const menuButton = document.getElementById("menuToggle");
  const navigation = document.getElementById("mainNav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    }));
    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth in-page navigation, with a native fallback.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const destination = document.querySelector(href);
      if (destination) {
        event.preventDefault();
        destination.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // Review Studio: creates an ethical request for a real customer, with no server storage.
  const reviewForm = document.getElementById("reviewForm");
  const reviewOutput = document.getElementById("reviewOutput");
  const messagePreview = document.getElementById("generatedMessage");
  const sendMessage = document.getElementById("sendMessage");
  const messageChannel = document.getElementById("messageChannel");
  const copyButton = document.getElementById("copyMessage");
  const copyStatus = document.getElementById("copyStatus");
  let generatedSubject = "A quick request for your honest feedback";

  function buildReviewMessage(businessName, customerName, reviewUrl) {
    const greeting = customerName ? `Hi ${customerName},` : "Hello,";
    return `${greeting}\n\nThank you for choosing ${businessName}. We appreciate your trust and would value your honest feedback about your experience. If you have a moment, please share your review here:\n${reviewUrl}\n\nYour feedback helps us improve and helps others make informed decisions. Thank you again for your time!`;
  }

  function updateShareAction() {
    if (!messagePreview || !sendMessage || !messageChannel) return;
    const content = messagePreview.value;
    const contactField = document.getElementById("customerContact");
    const contact = contactField ? contactField.value.trim() : "";
    if (messageChannel.value === "email") {
      sendMessage.textContent = "Draft email ↗";
      const emailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : "";
      sendMessage.href = `mailto:${emailAddress}?subject=${encodeURIComponent(generatedSubject)}&body=${encodeURIComponent(content)}`;
      sendMessage.removeAttribute("target");
    } else {
      sendMessage.innerHTML = 'Open WhatsApp <span aria-hidden="true">↗</span>';
      let phone = contact.replace(/\D/g, "");
      // If a Pakistani local mobile number is entered as 03..., convert it to country code 92.
      if (/^0[0-9]{9,10}$/.test(phone)) phone = `92${phone.slice(1)}`;
      const recipient = phone.length >= 7 ? `${phone}?` : "?";
      sendMessage.href = `https://wa.me/${recipient}text=${encodeURIComponent(content)}`;
      sendMessage.target = "_blank";
      sendMessage.rel = "noopener noreferrer";
    }
  }

  if (reviewForm && reviewOutput && messagePreview && sendMessage) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!reviewForm.reportValidity()) return;
      const businessName = document.getElementById("businessName").value.trim();
      const customerName = document.getElementById("customerName").value.trim();
      const reviewUrlField = document.getElementById("reviewUrl");
      const reviewUrl = reviewUrlField.value.trim();
      const contactField = document.getElementById("customerContact");
      const contact = contactField ? contactField.value.trim() : "";
      reviewUrlField.setCustomValidity("");
      if (contactField) contactField.setCustomValidity("");
      if (contact && messageChannel.value === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        contactField.setCustomValidity("For email, enter a valid customer email address or leave this optional field empty.");
        contactField.reportValidity();
        return;
      }
      if (contact && messageChannel.value === "whatsapp" && contact.replace(/\D/g, "").length < 7) {
        contactField.setCustomValidity("For WhatsApp, enter a valid phone number or leave this optional field empty.");
        contactField.reportValidity();
        return;
      }
      let parsedUrl;
      try { parsedUrl = new URL(reviewUrl); } catch (_) {
        reviewUrlField.setCustomValidity("Enter a valid public review URL starting with https:// or http://.");
        reviewUrlField.reportValidity();
        return;
      }
      if (!(["http:", "https:"].includes(parsedUrl.protocol))) {
        document.getElementById("reviewUrl").setCustomValidity("The review link must start with http:// or https://.");
        document.getElementById("reviewUrl").reportValidity();
        return;
      }
      generatedSubject = `A quick request for your honest feedback about ${businessName}`;
      messagePreview.value = buildReviewMessage(businessName, customerName, parsedUrl.href);
      reviewOutput.hidden = false;
      updateShareAction();
      if (copyStatus) copyStatus.textContent = "Review the wording before sending. Ask real customers and welcome honest feedback.";
      reviewOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    messageChannel?.addEventListener("change", () => {
      const contactField = document.getElementById("customerContact");
      if (contactField) contactField.setCustomValidity("");
      updateShareAction();
    });
    document.getElementById("customerContact")?.addEventListener("input", (event) => {
      event.target.setCustomValidity("");
      if (!reviewOutput.hidden) updateShareAction();
    });
    document.getElementById("reviewUrl")?.addEventListener("input", (event) => event.target.setCustomValidity(""));
  }

  if (copyButton && messagePreview && copyStatus) {
    copyButton.addEventListener("click", async () => {
      if (!messagePreview.value) return;
      try {
        await navigator.clipboard.writeText(messagePreview.value);
        copyStatus.textContent = "Message copied. You can paste it into your preferred channel.";
      } catch (_) {
        messagePreview.focus();
        messagePreview.select();
        const copied = document.execCommand("copy");
        copyStatus.textContent = copied ? "Message copied. You can paste it into your preferred channel." : "Select and copy the message from the preview above.";
      }
    });
  }

  // Contact form: prepare an email in the visitor's own mail application. No backend is implied.
  const contactForm = document.getElementById("contactForm");
  const formHint = document.getElementById("formHint");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const name = document.getElementById("visitorName").value.trim();
      const email = document.getElementById("visitorEmail").value.trim();
      const projectType = document.getElementById("projectType").value;
      const message = document.getElementById("visitorMessage").value.trim();
      const subject = encodeURIComponent(`Project enquiry: ${projectType || "Z-MATRIX"}`);
      const body = encodeURIComponent(`Hello Z-MATRIX team,\n\nName: ${name}\nEmail: ${email}\nService: ${projectType}\n\nProject details:\n${message}\n\nSent through the Z-MATRIX website.`);
      if (formHint) formHint.textContent = "Opening your email app. If it does not open, email zagforgematrix@gmail.com directly.";
      window.location.href = `mailto:zagforgematrix@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Current year.
  const yearElement = document.getElementById("currentYear");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Subtle reveal animations.
  const revealElements = document.querySelectorAll(".service-card, .process-card, .policy-note, .review-tool-card, .contact-form, .about-layout");
  revealElements.forEach((element) => element.classList.add("reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  console.log("Z-MATRIX agency site initialized.");
});
