class RoadmapConnector extends HTMLElement {
    static get observedAttributes() {
        return ['x1', 'y1', 'x2', 'y2', 'end', 'corner-radius', 'stroke-width', 'color'];
    }

    static STYLE_ID = 'roadmap-connector-styles';

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    numberAttr(name, fallback = 0) {
        const value = Number(this.getAttribute(name));
        return Number.isFinite(value) ? value : fallback;
    }

    ensureStyles() {
        if (this.querySelector(`#${RoadmapConnector.STYLE_ID}`)) {
            return;
        }

        const style = document.createElement('style');
        style.id = RoadmapConnector.STYLE_ID;
        style.textContent = `
      roadmap-connector {
        z-index: 99999999;
        position: absolute;
        pointer-events: none;
        display: block;
        overflow: visible;
      }
      .roadmap-connector-root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .roadmap-connector-segment,
      .roadmap-connector-corner {
        position: absolute;
        box-sizing: border-box;
      }
      
      .roadmap-connector-arrow {
        position: absolute;
        box-sizing: border-box;
        transform: translateX(-100%) rotate(180deg);
      }

      .roadmap-connector-segment--horizontal,
      .roadmap-connector-segment--vertical {
        background: var(--connector-color, #6c757d);
      }

      .roadmap-connector-corner {
        background: transparent;
      }
      .roadmap-connector-corner--left-to-bottom {
        transform: translateX(calc(-50% + 1px)) translateY(-1px);
        border-top-right-radius: 10px;
        border-top: var(--stroke-border, 3px solid red);
        border-right: var(--stroke-border, 3px solid red);
      }
      .roadmap-connector-corner--left-to-top {
        transform: translateX(calc(-50% + 1px)) translateY(1px);
        border-bottom-right-radius: 10px;
        border-bottom: var(--stroke-border, 3px solid red);
        border-right: var(--stroke-border, 3px solid red);
      }
      .roadmap-connector-corner--top-to-right {
        transform: translateX(calc(50% - 1px)) translateY(1px);
        border-bottom-left-radius: 10px;
        border-bottom: var(--stroke-border, 3px solid red);
        border-left: var(--stroke-border, 3px solid red);
        
      }
      .roadmap-connector-corner--bottom-to-right {
        transform: translateX(calc(50% - 1px)) translateY(-1px);
        border-top-left-radius: 10px;
        border-top: var(--stroke-border, 3px solid red);
        border-left: var(--stroke-border, 3px solid red);
      }
    `;

        this.prepend(style);
    }

    render() {
        const x1 = this.numberAttr('x1');
        const y1 = this.numberAttr('y1');
        const x2 = this.numberAttr('x2');
        const y2 = this.numberAttr('y2');
        const end = this.getAttribute('end') || 'arrow';
        const cornerRadius = this.numberAttr('corner-radius', 10);
        const strokeWidth = this.numberAttr('stroke-width', 2);
        const color = this.getAttribute('color') || '#6c757d';

        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.max(1, Math.abs(x2 - x1));
        const height = Math.max(1, Math.abs(y2 - y1));

        const localX1 = x1 - left;
        const localY1 = y1 - top;
        const localX2 = x2 - left;
        const localY2 = y2 - top;

        const downward = localY2 >= localY1;

        const midX = Math.max(
            cornerRadius,
            Math.min(
                width - cornerRadius,
                localX1 + Math.max(24, (localX2 - localX1) / 2)
            )
        );

        const startWidth = Math.max(0, midX - localX1 - cornerRadius);
        const endWidth = Math.max(0, localX2 - midX - cornerRadius);
        const verticalTop = downward ? localY1 + cornerRadius : localY2 + cornerRadius;
        const verticalHeight = Math.max(0, Math.abs(localY2 - localY1) - (cornerRadius * 2));

        const firstCornerTop = downward ? localY1 : localY1 - (cornerRadius * 2);
        const secondCornerTop = downward ? localY2 - (cornerRadius * 2) : localY2;

        const arrowHtml = end === 'arrow'
            ? `
        <div
          class="roadmap-connector-arrow"
          style="
            left:${localX2 - 1}px;
            top:${localY2 - 4}px;
            width:8px;
            height:8px;
            background:${color};
            clip-path:polygon(0 50%, 100% 0, 100% 100%);
          "
        ></div>
      `
            : '';

        this.setAttribute('aria-hidden', 'true');

        this.style.left = `${left}px`;
        this.style.top = `${top}px`;
        this.style.width = `${width}px`;
        this.style.height = `${height}px`;

        let firstCornerClass = 'roadmap-connector-corner--left-to-top';
        if (downward) {
            firstCornerClass = 'roadmap-connector-corner--left-to-bottom';
        }

        let secondCornerClass = 'roadmap-connector-corner--bottom-to-right';
        if (downward) {
            secondCornerClass = 'roadmap-connector-corner--top-to-right';
        }

        let dynamicStyles = `
            --connector-color:${color};
            --stroke-width:${strokeWidth}px;
            --stroke-border: ${strokeWidth}px solid ${color};
        `;

        this.innerHTML = `
      <div id="roadmap-connector-root" class="roadmap-connector-root" style="${dynamicStyles}">
        <div
          class="roadmap-connector-segment roadmap-connector-segment--horizontal"
          style="
            left:${localX1}px;
            top:${localY1 - strokeWidth / 2}px;
            width:${startWidth}px;
            height:${strokeWidth}px;
          "
        ></div>

        <div
          class="roadmap-connector-segment roadmap-connector-segment--vertical"
          style="
            left:${midX - strokeWidth / 2}px;
            top:${verticalTop}px;
            width:${strokeWidth}px;
            height:${verticalHeight}px;
          "
        ></div>

        <div
          class="roadmap-connector-segment roadmap-connector-segment--horizontal"
          style="
            left:${midX + cornerRadius}px;
            top:${localY2 - strokeWidth / 2}px;
            width:${endWidth}px;
            height:${strokeWidth}px;
          "
        ></div>

        <div
          class="roadmap-connector-corner ${firstCornerClass}"
          style="
            left:${midX - cornerRadius}px;
            top:${firstCornerTop}px;
            width:${cornerRadius * 2}px;
            height:${cornerRadius * 2}px;
          "
        ></div>

        <div
          class="roadmap-connector-corner ${secondCornerClass}"
          style="
            left:${midX - cornerRadius}px;
            top:${secondCornerTop}px;
            width:${cornerRadius * 2}px;
            height:${cornerRadius * 2}px;
          "
        ></div>

        ${arrowHtml}
      </div>
    `;

        this.ensureStyles();
    }
}

customElements.define('roadmap-connector', RoadmapConnector);