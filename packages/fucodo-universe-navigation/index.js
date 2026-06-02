import style from './style.scss'

class FucodoUniverseNavigation extends HTMLElement {
    static get observedAttributes() {
        return ["src", "interval", "cache-key", "breakpoint"];
    }

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this._data = null;
        this._refreshTimer = null;
        this._drawerOpen = false;
        this._abortController = null;

        this._onResize = this._onResize.bind(this);
        this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
        this._onAfterPageLoad = this._onAfterPageLoad.bind(this);
    }

    connectedCallback() {
        this.render();

        this.loadFromCache();
        this.fetchNavigation({ silent: true });

        if (document.readyState === "complete") {
            this._onAfterPageLoad();
        } else {
            window.addEventListener("load", this._onAfterPageLoad, { once: true });
        }

        window.addEventListener("resize", this._onResize);
        document.addEventListener("keydown", this._onDocumentKeydown);

        this.setupRefreshTimer();
    }

    disconnectedCallback() {
        window.removeEventListener("load", this._onAfterPageLoad);
        window.removeEventListener("resize", this._onResize);
        document.removeEventListener("keydown", this._onDocumentKeydown);

        if (this._refreshTimer) {
            clearInterval(this._refreshTimer);
            this._refreshTimer = null;
        }

        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
    }

    attributeChangedCallback() {
        if (!this.isConnected) {
            return;
        }

        this.setupRefreshTimer();
        this.fetchNavigation({ silent: true });
    }

    get src() {
        return this.getAttribute("src");
    }

    get intervalSeconds() {
        const value = Number(this.getAttribute("interval"));
        return Number.isFinite(value) && value > 0 ? value : 300;
    }

    get cacheKey() {
        return (
            this.getAttribute("cache-key") ||
            `fucodo-universe-navigation:${this.src || "default"}`
        );
    }

    get breakpoint() {
        const value = Number(this.getAttribute("breakpoint"));
        return Number.isFinite(value) && value > 0 ? value : 768;
    }

    get isMobile() {
        return window.innerWidth < this.breakpoint;
    }

    _onAfterPageLoad() {
        this.fetchNavigation({ silent: true });
    }

    _onResize() {
        this.render();
    }

    _onDocumentKeydown(event) {
        if (event.key === "Escape" && this._drawerOpen) {
            this.closeDrawer();
        }
    }

    setupRefreshTimer() {
        if (this._refreshTimer) {
            clearInterval(this._refreshTimer);
            this._refreshTimer = null;
        }

        this._refreshTimer = setInterval(() => {
            this.fetchNavigation({ silent: true });
        }, this.intervalSeconds * 1000);
    }

    loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);

            if (!cached) {
                return;
            }

            const parsed = JSON.parse(cached);

            if (!parsed || typeof parsed !== "object" || !parsed.data) {
                return;
            }

            this.validateNavigationData(parsed.data);

            this._data = parsed.data;
            this.render();
        } catch (error) {
            console.warn("[fucodo-universe-navigation] Could not read cache", error);
        }
    }

    saveToCache(data) {
        try {
            localStorage.setItem(
                this.cacheKey,
                JSON.stringify({
                    cachedAt: new Date().toISOString(),
                    data
                })
            );
        } catch (error) {
            console.warn("[fucodo-universe-navigation] Could not write cache", error);
        }
    }

    async fetchNavigation({ silent = false } = {}) {
        if (!this.src) {
            if (!silent) {
                console.warn(
                    "[fucodo-universe-navigation] Missing required src attribute."
                );
            }

            return;
        }

        if (this._abortController) {
            this._abortController.abort();
        }

        this._abortController = new AbortController();

        try {
            const response = await fetch(this.src, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                credentials: "same-origin",
                signal: this._abortController.signal
            });

            if (!response.ok) {
                throw new Error(`Navigation API responded with ${response.status}`);
            }

            const data = await response.json();

            this.validateNavigationData(data);

            this._data = data;
            this.saveToCache(data);
            this.render();

            this.dispatchEvent(
                new CustomEvent("fucodo-universe-navigation:updated", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        data
                    }
                })
            );
        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }

            if (!silent) {
                console.error(
                    "[fucodo-universe-navigation] Could not fetch navigation",
                    error
                );
            }

            this.dispatchEvent(
                new CustomEvent("fucodo-universe-navigation:error", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        error
                    }
                })
            );
        }
    }

    validateNavigationData(data) {
        if (!data || typeof data !== "object") {
            throw new Error("Navigation API must return a JSON object.");
        }

        if (!Array.isArray(data.menu)) {
            throw new Error("Navigation API response must contain a menu array.");
        }

        for (const item of data.menu) {
            if (!item || typeof item !== "object") {
                throw new Error("Each menu item must be an object.");
            }

            if (typeof item.text !== "string" || item.text.trim() === "") {
                throw new Error("Each menu item requires a non-empty text property.");
            }

            if (typeof item.url !== "string" || item.url.trim() === "") {
                throw new Error("Each menu item requires a non-empty url property.");
            }

            if (item.icon !== undefined && item.icon !== null) {
                this.validateIcon(item.icon);
            }
        }
    }

    validateIcon(icon) {
        if (!icon || typeof icon !== "object") {
            throw new Error("Icon must be an object.");
        }

        if (icon.type !== "url" && icon.type !== "svg") {
            throw new Error('Icon type must be either "url" or "svg".');
        }

        if (typeof icon.value !== "string" || icon.value.trim() === "") {
            throw new Error("Icon value must be a non-empty string.");
        }
    }

    openDrawer() {
        this._drawerOpen = true;
        this.render();

        this.dispatchEvent(
            new CustomEvent("fucodo-universe-navigation:drawer-opened", {
                bubbles: true,
                composed: true
            })
        );
    }

    closeDrawer() {
        this._drawerOpen = false;
        this.render();

        this.dispatchEvent(
            new CustomEvent("fucodo-universe-navigation:drawer-closed", {
                bubbles: true,
                composed: true
            })
        );
    }

    toggleDrawer() {
        if (this._drawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    render() {
        const data = this._data || {
            logo: null,
            notifications: null,
            menu: []
        };

        this.shadowRoot.replaceChildren();

        const style = document.createElement("style");
        style.textContent = this.getStyles();

        const root = document.createElement("div");
        root.className = "navigation-root";

        if (this.isMobile) {
            root.appendChild(this.renderMobile(data));
        } else {
            root.appendChild(this.renderDesktop(data));
        }

        this.shadowRoot.append(style, root);
    }

    renderDesktop(data) {
        const nav = document.createElement("nav");
        nav.className = "topbar";
        nav.setAttribute("aria-label", "Fucodo Universe Navigation");

        nav.appendChild(this.renderLogo(data.logo));

        const list = document.createElement("ul");
        list.className = "menu-list";

        for (const item of data.menu || []) {
            list.appendChild(this.renderMenuItem(item));
        }

        nav.appendChild(list);

        if (data.notifications) {
            nav.appendChild(this.renderNotifications(data.notifications));
        }

        return nav;
    }

    renderMobile(data) {
        const fragment = document.createDocumentFragment();

        const mobileBar = document.createElement("div");
        mobileBar.className = "mobilebar";

        const toggle = document.createElement("button");
        toggle.className = "drawer-toggle";
        toggle.type = "button";
        toggle.setAttribute(
            "aria-label",
            this._drawerOpen ? "Menü schließen" : "Menü öffnen"
        );
        toggle.setAttribute("aria-expanded", String(this._drawerOpen));
        toggle.textContent = this._drawerOpen ? "×" : "☰";
        toggle.addEventListener("click", () => this.toggleDrawer());

        mobileBar.appendChild(toggle);
        mobileBar.appendChild(this.renderLogo(data.logo));

        if (data.notifications) {
            mobileBar.appendChild(this.renderNotifications(data.notifications));
        }

        fragment.appendChild(mobileBar);

        if (this._drawerOpen) {
            const backdrop = document.createElement("button");
            backdrop.className = "drawer-backdrop";
            backdrop.type = "button";
            backdrop.setAttribute("aria-label", "Menü schließen");
            backdrop.addEventListener("click", () => this.closeDrawer());

            const drawer = document.createElement("aside");
            drawer.className = "drawer";
            drawer.setAttribute("aria-label", "Mobile Navigation");
            drawer.setAttribute("role", "dialog");
            drawer.setAttribute("aria-modal", "true");

            const drawerHeader = document.createElement("div");
            drawerHeader.className = "drawer-header";

            drawerHeader.appendChild(this.renderLogo(data.logo));

            const close = document.createElement("button");
            close.className = "drawer-close";
            close.type = "button";
            close.setAttribute("aria-label", "Menü schließen");
            close.textContent = "×";
            close.addEventListener("click", () => this.closeDrawer());

            drawerHeader.appendChild(close);

            const list = document.createElement("ul");
            list.className = "drawer-list";

            for (const item of data.menu || []) {
                list.appendChild(this.renderMenuItem(item));
            }

            drawer.append(drawerHeader, list);

            fragment.append(backdrop, drawer);
        }

        return fragment;
    }

    renderLogo(logo = {}) {
        const normalizedLogo = logo && typeof logo === "object" ? logo : {};
        const href = normalizedLogo.url || "/";

        const link = document.createElement("a");
        link.className = "logo";
        link.href = href;

        if (normalizedLogo.image) {
            const img = document.createElement("img");
            img.src = normalizedLogo.image;
            img.alt = normalizedLogo.text || "Logo";
            img.loading = "eager";
            img.decoding = "async";
            link.appendChild(img);
        }

        if (normalizedLogo.text) {
            const span = document.createElement("span");
            span.textContent = normalizedLogo.text;
            link.appendChild(span);
        }

        if (!normalizedLogo.image && !normalizedLogo.text) {
            link.textContent = "Fucodo";
        }

        return link;
    }

    renderMenuItem(item) {
        const li = document.createElement("li");
        li.className = "menu-item";

        const link = document.createElement("a");
        link.className = "menu-link";
        link.href = item.url || "#";

        if (this.isCurrentUrl(item.url)) {
            link.setAttribute("aria-current", "page");
        }

        const renderedIcon = this.renderIcon(item.icon);

        if (renderedIcon) {
            link.appendChild(renderedIcon);
        }

        const text = document.createElement("span");
        text.className = "menu-text";
        text.textContent = item.text || "";
        link.appendChild(text);

        if (Number(item.badge) > 0) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = String(item.badge);
            badge.setAttribute("aria-label", `${item.badge} neue Elemente`);
            link.appendChild(badge);
        }

        link.addEventListener("click", () => {
            if (this.isMobile && this._drawerOpen) {
                this.closeDrawer();
            }
        });

        li.appendChild(link);
        return li;
    }

    renderIcon(icon) {
        if (!icon || typeof icon !== "object") {
            return null;
        }

        const wrapper = document.createElement("span");
        wrapper.className = "menu-icon";
        wrapper.setAttribute("aria-hidden", "true");

        if (icon.type === "url" && typeof icon.value === "string") {
            const img = document.createElement("img");
            img.src = icon.value;
            img.alt = "";
            img.loading = "lazy";
            img.decoding = "async";

            wrapper.appendChild(img);
            return wrapper;
        }

        if (icon.type === "svg" && typeof icon.value === "string") {
            const svg = this.createSafeSvgElement(icon.value);

            if (!svg) {
                return null;
            }

            wrapper.appendChild(svg);
            return wrapper;
        }

        return null;
    }

    createSafeSvgElement(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");

        const parserError = doc.querySelector("parsererror");

        if (parserError) {
            return null;
        }

        const svg = doc.documentElement;

        if (!svg || svg.tagName.toLowerCase() !== "svg") {
            return null;
        }

        const forbiddenElements = [
            "script",
            "foreignObject",
            "iframe",
            "object",
            "embed",
            "audio",
            "video",
            "canvas"
        ];

        for (const elementName of forbiddenElements) {
            svg.querySelectorAll(elementName).forEach((element) => element.remove());
        }

        const allElements = [svg, ...svg.querySelectorAll("*")];

        for (const element of allElements) {
            for (const attribute of [...element.attributes]) {
                const name = attribute.name.toLowerCase();
                const value = attribute.value.trim();

                const lowerValue = value.toLowerCase();

                const isEventHandler = name.startsWith("on");
                const isJavascriptUrl = lowerValue.startsWith("javascript:");
                const isDataUrl =
                    lowerValue.startsWith("data:") &&
                    !lowerValue.startsWith("data:image/svg+xml");
                const isExternalHref =
                    (name === "href" || name === "xlink:href") &&
                    /^(https?:)?\/\//i.test(value);

                if (isEventHandler || isJavascriptUrl || isDataUrl || isExternalHref) {
                    element.removeAttribute(attribute.name);
                }
            }
        }

        svg.setAttribute("focusable", "false");
        svg.setAttribute("aria-hidden", "true");

        if (!svg.getAttribute("viewBox") && svg.hasAttribute("width") && svg.hasAttribute("height")) {
            const width = Number(svg.getAttribute("width"));
            const height = Number(svg.getAttribute("height"));

            if (Number.isFinite(width) && Number.isFinite(height)) {
                svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            }
        }

        return document.importNode(svg, true);
    }

    renderNotifications(notifications) {
        const normalized =
            notifications && typeof notifications === "object" ? notifications : {};

        const link = document.createElement("a");
        link.className = "notifications";
        link.href = normalized.url || "#";
        link.setAttribute(
            "aria-label",
            normalized.label || "Benachrichtigungen"
        );

        const icon = document.createElement("span");
        icon.className = "notifications-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "🔔";

        link.appendChild(icon);

        if (Number(normalized.count) > 0) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = String(normalized.count);
            link.appendChild(badge);
        }

        return link;
    }

    isCurrentUrl(url) {
        if (!url) {
            return false;
        }

        try {
            const target = new URL(url, window.location.origin);
            return target.pathname === window.location.pathname;
        } catch {
            return false;
        }
    }

    getStyles() {
        return style;
    }
}

if (!customElements.get("fucodo-universe-navigation")) {
    customElements.define(
        "fucodo-universe-navigation",
        FucodoUniverseNavigation
    );
}