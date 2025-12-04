(() => {
  // packages/fucodo-steps/style.scss
  var style_default = `@charset "UTF-8";
:host {
  display: block;
}

/* ===== Bubble size variable (default) ===== */
:host {
  --bubble-size: 32px; /* <-- bubble size variable */
  --line-width: 80px; /* L\xE4nge der Verbindungslinie */
  --line-height: 2px; /* Dicke der Linie */
}

.steps-wrapper {
  display: flex;
  align-items: center;
}

.step {
  --bs-alert-bg: var(--bs-dark-bg-subtle, #eee);
  --bs-alert-border-color: var(--bs-dark-border-subtle, #ccc);
  --bs-alert-border: 1px solid var(--bs-alert-border-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* ===================== FULL MODE ===================== */
.steps-wrapper--full .step::before {
  content: "";
  display: block;
  width: 120px;
  height: 6px;
  background: var(--bs-alert-border-color);
}

.steps-wrapper--full .step:first-child::before {
  display: none;
}

.steps-wrapper--full .step > span {
  padding: 1rem;
  border: var(--bs-alert-border);
  border-radius: var(--bs-border-radius, 0.375rem);
  background-color: var(--bs-alert-bg);
}

.steps-wrapper--full .step.step--active {
  --bs-alert-bg: var(--bs-primary-bg-subtle);
  --bs-alert-border-color: var(--bs-primary-border-subtle);
}

.steps-wrapper--full .step.step--done {
  --bs-alert-bg: var(--bs-success-bg-subtle);
  --bs-alert-border-color: var(--bs-success-border-subtle);
}

/* ===================== BUBBLE MODE ===================== */
.steps-wrapper--bubble .step {
  flex-direction: column;
  padding-inline: 1rem;
}

/* bubble circle */
.step-bubble {
  width: var(--bubble-size);
  height: var(--bubble-size);
  border-radius: 999px;
  border: var(--bs-alert-border);
  background-color: var(--bs-alert-bg);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s ease;
}

.steps-wrapper--bubble .step.step--active {
  --bs-alert-bg: var(--bs-primary-bg-subtle);
  --bs-alert-border-color: var(--bs-primary-border-subtle);
}

.steps-wrapper--bubble .step.step--done {
  --bs-alert-bg: var(--bs-success-bg-subtle);
  --bs-alert-border-color: var(--bs-success-border-subtle);
}

/* bubble hover effect */
.steps-wrapper--bubble .step.step--active .step-bubble {
  transform: scale(1.07);
}

/* LINE POSITION: bubble center */
.steps-wrapper--bubble .step:not(:first-child)::before {
  content: "";
  display: block;
  position: absolute;
  width: var(--line-width);
  height: var(--line-height);
  background: var(--bs-alert-border-color);
  left: calc(-1 * var(--line-width) / 2);
  top: calc(var(--bubble-size) / 2 - var(--line-height) / 2);
  z-index: -1;
}

/* ===================== POPOVER ===================== */
.step-bubble__popover {
  position: absolute;
  top: calc(var(--bubble-size) + 0.6rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 280px;
  background: var(--bs-body-bg, white);
  border: 1px solid var(--bs-border-color, #ccc);
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  display: none;
}

/* Arrow */
.step-bubble__popover::after {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent var(--bs-body-bg, white) transparent;
}

.steps-wrapper--bubble .step:hover .step-bubble__popover,
.steps-wrapper--bubble .step.step--popover-open .step-bubble__popover {
  display: block;
}`;

  // packages/fucodo-steps/index.js
  var FucodoSteps = class extends HTMLElement {
    static styles = style_default;
    static get observedAttributes() {
      return ["current", "mode"];
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (event) => {
        const bubbleButton = event.target.closest(".step-bubble");
        const step = event.target.closest(".step");
        if (bubbleButton && step) {
          const isOpen = step.classList.toggle("step--popover-open");
          this.shadowRoot.querySelectorAll(".step.step--popover-open").forEach((el) => {
            if (el !== step) el.classList.remove("step--popover-open");
          });
          this.shadowRoot.querySelectorAll('.step-bubble[aria-expanded="true"]').forEach((btn) => {
            if (btn !== bubbleButton) btn.setAttribute("aria-expanded", "false");
          });
          bubbleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        } else {
          this.shadowRoot.querySelectorAll(".step.step--popover-open").forEach((el) => {
            el.classList.remove("step--popover-open");
          });
          this.shadowRoot.querySelectorAll('.step-bubble[aria-expanded="true"]').forEach((btn) => {
            btn.setAttribute("aria-expanded", "false");
          });
        }
      });
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      this.render();
    }
    get current() {
      const val = parseInt(this.getAttribute("current"), 10);
      return Number.isNaN(val) ? 0 : val;
    }
    get mode() {
      return this.getAttribute("mode") || "full";
    }
    render() {
      const list = this.querySelector("ul, ol");
      if (!list) return;
      const items = [...list.children].filter((el) => el.tagName === "LI");
      list.style.display = "none";
      const currentIndex = this.current;
      this.shadowRoot.innerHTML = `
            <style>${style_default}</style>

            <div class="steps-wrapper ${this.mode === "bubble" ? "steps-wrapper--bubble" : "steps-wrapper--full"}"></div>
        `;
      const wrapper = this.shadowRoot.querySelector(".steps-wrapper");
      items.forEach((item, index) => {
        const step = document.createElement("div");
        step.classList.add("step");
        if (index < currentIndex) step.classList.add("step--done");
        else if (index === currentIndex) step.classList.add("step--active");
        if (this.mode === "bubble") {
          const bubble = document.createElement("button");
          bubble.className = "step-bubble";
          const pop = document.createElement("div");
          pop.className = "step-bubble__popover";
          pop.innerHTML = item.innerHTML.trim();
          step.append(bubble, pop);
        } else {
          const content = document.createElement("span");
          content.innerHTML = item.innerHTML.trim();
          step.append(content);
        }
        wrapper.appendChild(step);
      });
    }
  };
  customElements.define("fucodo-steps", FucodoSteps);
})();
