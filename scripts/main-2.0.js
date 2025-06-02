document.addEventListener("DOMContentLoaded", function () {
  // --- GSAP
  gsap.registerPlugin(ScrollTrigger, Flip);

  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  let mm = gsap.matchMedia();

  // --- GLOBAL - RELOAD AT THE TOP
  window.addEventListener("beforeunload", function () {
    history.scrollRestoration = "manual";
  });

  // --- LENIS
  window.lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // --- PAPER TIGET SIGNATURE
  const pprtgr = [
    "color: #F2F3F3",
    "background: #080808",
    "font-size: 12px",
    "padding-left: 10px",
    "line-height: 2",
    "border-left: 5px solid #ff3c31",
  ].join(";");
  console.info(
    `

%cWebsite by Paper Tiger${" "}
www.papertiger.com${"     "}

`,
    pprtgr
  );

  // --- CURRENT YEAR
  const currentYear = document.querySelectorAll("[current-year]");
  if (currentYear.length > 0) {
    currentYear.forEach(year => {
      year.innerHTML = new Date().getFullYear();
    });
  }

  // --- GLOBAL - FADE
  function fade() {
    const fadeElements = document.querySelectorAll("[fade]");

    gsap.set(fadeElements, { opacity: 0, y: "5em" });

    ScrollTrigger.batch("[fade]", {
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
        }),
    });
  }

  // --- GLOBAL - LINE ANIMATION
  function drawLine() {
    // Draw line
    gsap.set("[draw-line]", {
      opacity: 1,
      scaleX: 0,
      transformOrigin: "top left",
    });

    ScrollTrigger.batch("[draw-line]", {
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          scaleX: 1,
          delay: 0.1,
          duration: 2,
          ease: "power3.out",
          stagger: 0.2,
          markers: true,
        }),
    });
  }

  // --- HEADER SCROLLED
  function headerScrolled() {
    const header = document.querySelector(".c-header");

    ScrollTrigger.create({
      trigger: "body",
      start: "150 top",
      onToggle: self => {
        if (self.isActive) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      },
    });
  }

  // --- CAPABILITIES SLIDER
  function CapabilitiesSlider() {
    const slider = new Swiper(".swiper.capab", {
      spaceBetween: 16,
      speed: 700,
      navigation: {
        nextEl: ".swiper-next.capab",
        prevEl: ".swiper-prev.capab",
      },
      autoplay: {
        delay: 6000,
        disableOnInteraction: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1.1,
          centeredSlides: false,
          loop: false,
        },
        480: {
          slidesPerView: 1,
        },
        992: {
          slidesPerView: "auto",
          centeredSlides: true,
          loop: true,
        },
      },
    });
  }

  // --- INNOVATIONS SLIDER
  function InnovationSlider() {
    const slider = new Swiper(".swiper.inno", {
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 700,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: ".swiper-next.inno",
        prevEl: ".swiper-prev.inno",
      },
      pagination: {
        el: "[swiper-pagination]",
        type: "fraction",
      },
    });
  }

  // --- ACCORDIONS
  function accordions() {
    const accordions = document.querySelectorAll(".c-ac-item");
    let active = null;

    if (accordions.length === 0) return;

    accordions.forEach((accordion, index) => {
      const question = accordion.querySelector(".c-ac-question");
      const response = accordion.querySelector(".c-ac-response");
      const arrow = accordion.querySelector(".c-ac-arrow");

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.inOut",
          duration: 0.8,
        },
      });

      tl.to(response, { height: "auto", opacity: 1 });
      tl.to(arrow, { rotation: 135, background: "white", color: "#000913" }, 0);

      accordion.tl = tl;

      if (index === 0) {
        tl.play();
        active = accordion;
      }

      accordion.addEventListener("click", function () {
        if (active === accordion) {
          tl.reverse();
          active = null;
        } else {
          if (active) active.tl.reverse();
          tl.play();
          active = accordion;
        }
      });
    });
  }

  // --- MEGAMENU
  function megamenu() {
    const links = document.querySelectorAll(".c-nav-link");
    const header = document.querySelector(".c-header");

    // Set initial opacity for all nav texts
    links.forEach(link => {
      if (link.hasAttribute("static-link")) return;

      const navText = link.querySelector(".c-nav-link-txt");
      navText.style.opacity = "1";
    });

    links.forEach(link => {
      if (link.hasAttribute("static-link")) return;

      const megamenu = link.querySelector(".c-dd-item");
      const navText = link.querySelector(".c-nav-link-txt");
      navText.dataset.initialText = navText.textContent;

      // Calculate and set min-width based on both possible text contents
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.fontSize = window.getComputedStyle(navText).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(navText).fontFamily;
      document.body.appendChild(tempSpan);

      // Measure both texts
      tempSpan.textContent = navText.dataset.initialText;
      const initialWidth = tempSpan.offsetWidth;
      tempSpan.textContent = "Close";
      const closeWidth = tempSpan.offsetWidth;

      // Set min-width to the larger of the two
      navText.style.minWidth = `${Math.max(initialWidth, closeWidth)}px`;

      document.body.removeChild(tempSpan);

      navText.addEventListener("click", function () {
        const isCurrentlyOpen = megamenu.classList.contains("is-open");

        // Close all megamenus, restore text and set opacity
        links.forEach(otherLink => {
          if (otherLink.hasAttribute("static-link")) return;

          const otherMegamenu = otherLink.querySelector(".c-dd-item");
          const otherNavText = otherLink.querySelector(".c-nav-link-txt");

          otherMegamenu.classList.remove("is-open");
          otherNavText.textContent = otherNavText.dataset.initialText;
          otherNavText.style.opacity = "1"; // Reset opacity for all
        });

        if (!isCurrentlyOpen) {
          header.classList.add("megamenu-open");
          megamenu.classList.add("is-open");
          navText.textContent = "Close";
          lenis.stop();

          // Set opacity for non-active nav texts
          links.forEach(otherLink => {
            if (otherLink.hasAttribute("static-link")) return;

            const otherNavText = otherLink.querySelector(".c-nav-link-txt");
            if (otherNavText !== navText) {
              otherNavText.style.opacity = "0.6";
            }
          });
        } else {
          header.classList.remove("megamenu-open");
          navText.textContent = navText.dataset.initialText;
          lenis.start();
        }
      });
    });

    // Add click outside listener
    document.addEventListener("click", e => {
      if (!header.contains(e.target)) {
        // Close any open megamenu
        links.forEach(link => {
          if (link.hasAttribute("static-link")) return;

          const megamenu = link.querySelector(".c-dd-item");
          const navText = link.querySelector(".c-nav-link-txt");

          if (megamenu.classList.contains("is-open")) {
            megamenu.classList.remove("is-open");
            navText.textContent = navText.dataset.initialText;
            header.classList.remove("megamenu-open");
            lenis.start();

            // Reset all nav text opacities
            links.forEach(otherLink => {
              if (otherLink.hasAttribute("static-link")) return;

              const otherNavText = otherLink.querySelector(".c-nav-link-txt");
              otherNavText.style.opacity = "1";
            });
          }
        });
      }
    });

    // Add event listener for ESC key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        // Find and close any open megamenu
        links.forEach(link => {
          if (link.hasAttribute("static-link")) return;

          const megamenu = link.querySelector(".c-dd-item");
          const navText = link.querySelector(".c-nav-link-txt");

          if (megamenu.classList.contains("is-open")) {
            megamenu.classList.remove("is-open");
            navText.textContent = navText.dataset.initialText;
            header.classList.remove("megamenu-open");
            lenis.start();

            // Reset all nav text opacities
            links.forEach(otherLink => {
              if (otherLink.hasAttribute("static-link")) return;

              const otherNavText = otherLink.querySelector(".c-nav-link-txt");
              otherNavText.style.opacity = "1";
            });
          }
        });
      }
    });
  }

  // --- HEADER MOBILE
  function headerMobile() {
    const navBtn = document.querySelector(".c-nav-btn");
    const navMenu = document.querySelector(".c-header_lt");
    const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
    const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
    const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
    let navStatus = "closed";

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.inOut", duration: 1 },
    });

    gsap.set(menuLine1, { transformOrigin: "center center" });
    gsap.set(menuLine2, { transformOrigin: "center center" });
    gsap.set(menuLine3, { transformOrigin: "center center" });

    tl.to(navMenu, { clipPath: "inset(0% 0% 0% 0%)" });
    tl.to(menuLine1, { rotation: 45, y: 6 }, 0);
    tl.to(menuLine2, { width: 0 }, 0);
    tl.to(menuLine3, { rotation: -45, y: -6 }, 0);

    navBtn.addEventListener("click", function () {
      if (navStatus === "closed") {
        tl.restart();
        navStatus = "open";
        lenis.stop();
      } else {
        tl.reverse();
        navStatus = "closed";
        lenis.start();
      }
    });

    // Dropdowns
    const accordions = document.querySelectorAll(".c-nav-link");
    let active = null;

    if (accordions.length === 0) return;

    accordions.forEach((accordion, index) => {
      const question = accordion.querySelector(".c-nav-link-txt");
      const response = accordion.querySelector(".c-dd-item");

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.inOut",
          duration: 0.5,
        },
      });

      tl.to(response, { height: "auto", opacity: 1 });

      accordion.tl = tl;

      question.addEventListener("click", function () {
        if (active === accordion) {
          tl.reverse();
          active = null;
        } else {
          if (active) active.tl.reverse();
          tl.play();
          active = accordion;
        }
      });
    });
  }

  // --- CARDS PARALLAX
  function cardsParallax() {
    const cards = document.querySelectorAll(".c-card:nth-child(odd)");
    if (cards.length === 0) return;

    console.log(cards);

    gsap.to(cards, {
      marginTop: 0,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".o-row.cards",
        start: "top 80%",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }

  // --- CARDS PARALLAX 3
  function cardsParallax3() {
    const card = document.querySelectorAll(".c-card.is-3");
    if (card.length === 0) return;

    gsap.to(card, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".o-row.cards.is-3",
        start: "top 80%",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }

  // --- CARDS CLICK EVENT
  function cardsClickEvent() {
    const cards = document.querySelectorAll(".c-card");

    cards.forEach(card => {
      const cardInner = card.querySelector(".c-card-inner");
      const cardIntro = card.querySelector(".c-card-intro");
      const cardExpanded = card.querySelector(".c-card-expanded");

      card.addEventListener("click", function () {
        const state = Flip.getState([cardInner, cardIntro, cardExpanded], {
          props: "backgroundColor,color,opacity",
        });

        this.classList.toggle("is-open");

        Flip.from(state, {
          duration: 0.8,
          ease: "power4.inOut",
          absoluteOnLeave: true,
        });
      });
    });
  }

  // --- TABBER COMP
  function tabberComp() {
    const accordions = document.querySelectorAll(".c-tabber-comp-ac");
    let active = null;

    if (accordions.length === 0) return;

    accordions.forEach((accordion, index) => {
      const question = accordion.querySelector(".c-tabber-comp-question");
      const response = accordion.querySelector(".c-tabber-comp-answer");
      const arrow = accordion.querySelector(".c-icon.tabber-comp-arrow");
      const arrowWrap = accordion.querySelector(".c-tabber-comp-arrow");

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.inOut",
          duration: 0.5,
        },
      });

      tl.to(response, { height: "auto", opacity: 1 });
      tl.to(arrow, { rotation: 135 }, 0);
      tl.to(arrowWrap, { background: "white", color: "#000913" }, 0);

      accordion.tl = tl;

      if (index === 0) {
        tl.play();
        active = accordion;
      }

      accordion.addEventListener("click", function () {
        if (active === accordion) {
          tl.reverse();
          active = null;
        } else {
          if (active) active.tl.reverse();
          tl.play();
          active = accordion;
        }
      });
    });
  }

  // --- NEWS PAGE
  function newsFilters() {
    const contentSection = document.querySelector("#content-position");
    const buttons = [
      ...document.querySelectorAll(".c-pagination-btn"),
      ...document.querySelectorAll(".c-page-count-item"),
    ];

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        setTimeout(() => {
          lenis.scrollTo(contentSection, { offset: -128 });
          ScrollTrigger.refresh();
        }, 200);
      });
    });

    // // All button
    // const allButton = document.querySelector(".c-radio-field.is-all");
    // const list = document.querySelector(".c-radio-list");

    // if (allButton && list) {
    //   list.prepend(allButton);
    // }

    // // Hide pagination when needed
    // const filterButtons = document.querySelectorAll(".c-radio-field");
    // const paginationBar = document.querySelector(".c-pagination");

    // function updatePaginationVisibility() {
    //   setTimeout(() => {
    //     let paginationItems = document.querySelectorAll(".c-page-count .c-page-count-item");
    //     console.log(paginationItems.length);

    //     if (paginationItems.length <= 1) {
    //       paginationBar.classList.add("not-visible");
    //     } else {
    //       paginationBar.classList.remove("not-visible");
    //     }
    //   }, 300);
    // }

    // // Run on page load
    // updatePaginationVisibility();

    // // Run on filter button click
    // filterButtons.forEach(button => {
    //   button.addEventListener("click", updatePaginationVisibility);
    // });
  }

  // --- TOPICS SLIDER
  function topicsSlider() {
    const slider = new Swiper(".swiper.topics", {
      slidesPerView: 3,
      spaceBetween: 32,
      speed: 600,
      grabCursor: true,
      navigation: {
        nextEl: ".swiper-next.topics",
        prevEl: ".swiper-prev.topics",
      },
    });
  }

  // --- FOOTER MOBILE
  function footerMobile() {
    const footerListCapab = document.querySelector(".c-footer-list.capab");
    const footerListSolutions = document.querySelector(
      ".c-footer-list.solutions"
    );
    const footerListExpertise = document.querySelector(
      ".c-footer-list.expertise"
    );
    const footerListCompany = document.querySelector(".c-footer-list.company");

    if (footerListCapab && footerListExpertise) {
      footerListCapab.appendChild(footerListExpertise);
    }

    if (footerListSolutions && footerListCompany) {
      footerListSolutions.appendChild(footerListCompany);
    }
  }

  function footerDesktop() {
    const footerListCapab = document.querySelector(".c-footer-list.capab");
    const footerListSolutions = document.querySelector(
      ".c-footer-list.solutions"
    );
    const footerListExpertise = document.querySelector(
      ".c-footer-list.expertise"
    );
    const footerListCompany = document.querySelector(".c-footer-list.company");
    const originalLocation = document.querySelector(
      ".c-footer-list-wrap.company-expertise-location"
    );

    originalLocation.appendChild(footerListExpertise);
    originalLocation.appendChild(footerListCompany);
  }

  // --- SPEAKERS SLIDER
  function speakersSlider() {
    const slider = new Swiper(".swiper.speaker", {
      spaceBetween: 16,
      speed: 600,
      navigation: {
        nextEl: ".swiper-next.speaker",
        prevEl: ".swiper-prev.speaker",
      },
      breakpoints: {
        320: {
          slidesPerView: 1.05,
        },
        992: {
          slidesPerView: 1.5,
        },
      },
    });
  }

  // --- GLOSSARY ACCORDIONS
  let activeAccordion = null;

  function glossaryAccordions() {
    const accordions = document.querySelectorAll(".c-ac-item-glossary");
    if (accordions.length === 0) return;

    // First remove all existing click listeners and animations
    accordions.forEach(accordion => {
      const clone = accordion.cloneNode(true);
      accordion.parentNode.replaceChild(clone, accordion);
    });

    // Get fresh references after cloning
    const newAccordions = document.querySelectorAll(".c-ac-item-glossary");

    newAccordions.forEach(accordion => {
      const response = accordion.querySelector(".c-ac-response");
      const arrow = accordion.querySelector(".c-ac-arrow");

      // Reset initial states
      gsap.set(response, { height: 0, opacity: 0 });
      gsap.set(arrow, {
        rotation: 0,
        background: "transparent",
        color: "white",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.inOut",
          duration: 0.8,
        },
      });

      tl.to(response, { height: "auto", opacity: 1 });
      tl.to(arrow, { rotation: 135, background: "white", color: "#000913" }, 0);

      accordion.tl = tl;

      accordion.addEventListener("click", function () {
        if (activeAccordion === accordion) {
          tl.reverse();
          activeAccordion = null;
        } else {
          if (activeAccordion && activeAccordion.tl) {
            activeAccordion.tl.reverse();
          }
          tl.play();
          activeAccordion = accordion;
        }
      });
    });
  }

  // --- GLOSSARY
  function glossary() {
    const allRadios = document.querySelectorAll(".c-glossary-radio");
    const firstRadio = document.querySelector(".c-glossary-radio");
    const backToTopBtn = document.querySelector(".c-glossary-back");
    const searchInput = document.querySelector(".c-glossary-search");
    const glossaryFilters = document.querySelectorAll(".c-ac-item-glossary");

    // All button
    const allBtn = document.querySelector(".c-glossary-filter.is-all");
    const filtersList = document.querySelector(".c-glossary-alphabet");
    filtersList.prepend(allBtn);

    // Finswet filters API
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      filterInstances => {
        const [filterInstance] = filterInstances;

        filterInstance.listInstance.on("renderitems", renderedItems => {
          glossaryAccordions();

          // Ensure that the elements are rendered before adding the click event
          const glossaryItem = document.querySelectorAll(
            ".c-ac-item-glossary"
          )[0];

          if (glossaryItem) {
            setTimeout(() => {
              glossaryItem.click();
            }, 200);
          }
        });

        // Filters event
        allRadios.forEach(radio => {
          radio.addEventListener("click", function () {
            setTimeout(() => {
              filterInstance.resetFilters(["name"]);
              if (glossaryFilters[0]) {
                glossaryFilters[0].click();
              }
            }, 50);
          });
        });
      },
    ]);

    // Back to top
    backToTopBtn.addEventListener("click", function () {
      ScrollTrigger.refresh();
      lenis.scrollTo(".c-glossary-top", {
        top: 0,
        duration: 0.8,
        lock: true,
      });
    });
  }

  // --- SEARCH BAR
  function searchBar() {
    const searchModal = document.querySelector(".c-search");
    const headerTriggerBtn = document.querySelectorAll(".c-search-btn");
    const searchForm = document.querySelector(".c-search-form");
    const searchInput = document.querySelector(".c-search-input");
    const searchArrowBtn = document.querySelector(".c-search-now-btn");
    const searchCloseBtn = document.querySelector(".c-search-close-btn");
    const searchPageInput = document.querySelector(
      ".c-glossary-search.global-search"
    );

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "/cirtec-search";
    });

    function openModal() {
      lenis.stop();
      searchModal.classList.add("is-open");
      searchInput.focus();
    }

    function closeModal() {
      lenis.start();
      searchModal.classList.remove("is-open");
    }

    headerTriggerBtn.forEach(item => {
      item.addEventListener("click", openModal);
    });

    searchCloseBtn.addEventListener("click", closeModal);

    // Click outside
    searchModal.addEventListener("click", function (event) {
      if (event.target === searchModal) {
        closeModal();
      }
    });

    // Close with ESC
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && searchModal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // Save to sessionStorage in real time
    searchInput.addEventListener("input", () => {
      sessionStorage.setItem("searchInputValue", searchInput.value);
    });

    // Search page autofill
    const savedValue = sessionStorage.getItem("searchInputValue");
    if (savedValue && searchPageInput) {
      searchPageInput.value = savedValue;

      // Dispatch input event to simulate typing
      const event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      searchPageInput.dispatchEvent(event);
    }
  }

  // --- HOME LOADER
  function homeLoader() {
    const hero = document.querySelector(".o-row.hm-hero");
    const heroTopText = document.querySelector(".c-hm-hero_top");
    const shape = document.querySelector(".c-shape-wrap.hm-hero");
    const heroBottomText = document.querySelector(".c-hm-hero-modal");

    lenis.stop();

    function loadComplete() {
      lenis.start();
      document.querySelector(".c-body").classList.remove("no-scroll");
    }

    gsap.set([heroTopText, shape, heroBottomText], { opacity: 0 });
    gsap.set(shape, { rotation: -90 });

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.6 },
    });

    tl.fromTo(
      hero,
      {
        clipPath: "inset(50% 50% 50% 50% round 5em)",
        yPercent: 100,
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 0.375em)",
        opacity: 1,
        yPercent: 0,
      }
    );
    gsap.to(
      [heroTopText, heroBottomText],
      { yPercent: 0, opacity: 1, stagger: 0.2 },
      "<1"
    );
    gsap.to(shape, { opacity: 1, rotation: 0, duration: 2 }, "<0.4");

    // Call loadComplete
    const triggerTime = tl.totalDuration() - 0.8;
    tl.call(loadComplete, [], triggerTime);
  }

  // --- PARALLAX
  function parallax() {
    const images = document.querySelectorAll("[parallax]");

    if (images) {
      new Ukiyo(images, {
        scale: 1.2,
        speed: 1.2,
        // willChange: true,
      });
    }
  }

  // --- SOLUTION LOADER
  function solutionLoader() {
    const image = document.querySelector(".c-img-contain.solution-bg");
    const cols = document.querySelectorAll(".c-section.solution-hero .o-col");

    const tl = gsap.timeline({
      defaults: { ease: "expo.out", duration: 1.6 },
      delay: 0.3,
    });

    gsap.set(image, { opacity: 1 });
    gsap.set(cols, { opacity: 0, y: "5em" });

    tl.fromTo(
      image,
      { clipPath: "inset(50% 50% 50% 50%)" },
      { clipPath: "inset(0% 0% 0% 0%)" }
    );

    tl.to(
      cols,
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.4,
      },
      "<0.2"
    );
  }

  // --- SOLUTION STICKY TABS
  function solutionStickyCards() {
    const tabs = document.querySelectorAll(".o-row.solution");
    const section = document.querySelector(".c-section.solution");

    if (!tabs) return;

    tabs.forEach(tab => {
      gsap.to(tab, {
        ease: "none",
        scrollTrigger: {
          trigger: tab,
          start: "-48 top",
          end: "bottom top",
          pin: tab,
          pinSpacing: false,
          scrub: true,
        },
      });
    });
  }

  // --- CAREERS SLIDER
  function careersSlider() {
    const slider = new Swiper(".swiper.careers", {
      speed: 1000,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 24,
        },
        480: {
          slidesPerView: 1.2,
          spaceBetween: 32,
        },
        992: {
          spaceBetween: 64,
          slidesPerView: "auto",
        },
      },
    });
  }

  // --- MARQUEE
  function marquee() {
    const wraps = document.querySelectorAll(".c-marquee-wrap");
    if (wraps.length === 0) return;

    wraps.forEach(wrap => {
      const list = wrap.querySelector(".c-marquee-list");
      if (!list) return;

      const duplicatedList = list.cloneNode(true);
      wrap.appendChild(duplicatedList);
    });
  }

  // --- CAREERS WIDGET DETECTION
  function careersWidgetDetection() {
    let checkingInterval = null;
    let refreshed = false;

    const section = document.querySelector(".c-section.careers-opp");
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      onEnter: () => {
        if (checkingInterval || refreshed) return;

        checkingInterval = setInterval(() => {
          const jobsContainer = document.querySelector(".cc-jobs-container");
          if (jobsContainer) {
            setTimeout(() => {
              if (!refreshed) {
                ScrollTrigger.refresh();
                refreshed = true;
                clearInterval(checkingInterval);
              }
            }, 1000);
          }
        }, 1000);
      },
      once: true,
    });
  }

  // --- PAGES
  let homepage = document.querySelector("[data-page='homepage']");
  let newspage = document.querySelector("[data-page='newspage']");
  let glossaryPage = document.querySelector("[data-page='glossary']");
  let searchPage = document.querySelector("[data-page='search']");
  let solutionPage = document.querySelector("[data-page='solution']");

  // --- INIT
  function init() {
    CapabilitiesSlider();
    InnovationSlider();
    accordions();
    tabberComp();
    cardsClickEvent();
    careersSlider();
    if (newspage) {
      newsFilters();
    }
    topicsSlider();
    speakersSlider();
    if (glossaryPage) {
      glossary();
      glossaryAccordions();
      if (document.querySelectorAll(".c-ac-item-glossary").length > 0) {
        document.querySelectorAll(".c-ac-item-glossary")[0].click();
      }
    }
    searchBar();
    if (homepage) {
      homeLoader();
    }
    parallax();
    if (solutionPage) {
      solutionLoader();
    }
    marquee();
    careersWidgetDetection();
  }

  init();

  // --- MATCHMEDIA - DESKTOP
  mm.add("(min-width: 992px)", () => {
    headerScrolled();
    cardsParallax();
    cardsParallax3();
    megamenu();
    fade();
    drawLine();
    if (homepage) {
      solutionStickyCards();
    }
    return () => {
      //
    };
  });

  // --- MATCHMEDIA - TABLET AND MOBILE
  mm.add("(max-width: 991px)", () => {
    footerMobile();
    headerMobile();
    document
      .querySelector(".c-header_lt")
      .setAttribute("data-lenis-prevent", "");
    return () => {
      footerDesktop();
      ScrollTrigger.refresh();
      document
        .querySelector(".c-header_lt")
        .removeAttribute("data-lenis-prevent", "");
    };
  });
});
