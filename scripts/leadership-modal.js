document.addEventListener("DOMContentLoaded", function () {
  function leadershipModal() {
    const teamCards = document.querySelectorAll("[data-team-card]");
    const modals = document.querySelectorAll(".c-ld-modal");

    function openModal(index) {
      const modal = modals[index];
      if (modal) {
        lenis.stop();
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
    }

    function closeModal(modal) {
      if (modal) {
        lenis.start();
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    }

    function closeAllModals() {
      modals.forEach(modal => closeModal(modal));
    }

    teamCards.forEach((card, index) => {
      const trigger = card.querySelector(".c-ld-modal-trigger");

      if (trigger) {
        trigger.addEventListener("click", e => {
          e.preventDefault();
          openModal(index);
        });
      }
    });

    modals.forEach(modal => {
      const overlay = modal.querySelector(".c-ld-modal-overlay");
      if (overlay) {
        overlay.addEventListener("click", e => {
          if (e.target === overlay) {
            closeModal(modal);
          }
        });
      }

      const closeBtn = modal.querySelector(".c-icon.ld-modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          closeModal(modal);
        });
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeAllModals();
      }
    });

    modals.forEach(modal => {
      modal.addEventListener("click", e => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });
  }

  leadershipModal();
});
