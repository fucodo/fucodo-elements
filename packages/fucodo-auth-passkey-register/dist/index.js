(() => {
  // packages/fucodo-auth-passkey-register/index.js
  var PasskeyRegister = class extends HTMLElement {
    static get observedAttributes() {
      return ["endpoint", "username", "display-name"];
    }
    constructor() {
      super();
      this.root = this.attachShadow({ mode: "open" });
      this._render();
    }
    connectedCallback() {
      this._updateFromAttributes();
    }
    attributeChangedCallback() {
      this._updateFromAttributes();
    }
    _render() {
      const style = document.createElement("style");
      style.textContent = `
      :host { display: block; font: inherit; }
      .row { display: flex; gap: .5rem; align-items: center; margin: .25rem 0; }
      button { padding: .5rem .75rem; font: inherit; cursor: pointer; }
      .status { margin-top: .5rem; min-height: 1.2em; }
      .ok { color: #137333; }
      .err { color: #b00020; }
    `;
      const container = document.createElement("div");
      const rowHint = document.createElement("div");
      rowHint.className = "row";
      const hint = document.createElement("div");
      hint.style.opacity = "0.8";
      hint.style.fontSize = ".9em";
      hint.textContent = "Setze die Attribute `endpoint`, `username` und optional `display-name` am Element.";
      rowHint.append(hint);
      const rowAction = document.createElement("div");
      rowAction.className = "row";
      this.btn = document.createElement("button");
      const actionSlot = document.createElement("slot");
      actionSlot.name = "action";
      actionSlot.textContent = "Passkey registrieren";
      this.btn.append(actionSlot);
      this.btn.addEventListener("click", () => this._onRegisterClick());
      this.spinner = document.createElement("fucodo-spinner");
      this.spinner.setAttribute("enabled", "0");
      rowAction.append(this.btn, this.spinner);
      this.status = document.createElement("div");
      this.status.className = "status";
      container.append(rowHint, rowAction, this.status);
      this.root.append(style, container);
    }
    _updateFromAttributes() {
      const base = (this.getAttribute("endpoint") || "").trim();
      const user = (this.getAttribute("username") || "").trim();
      const ready = !!base && !!user;
      if (this.btn) this.btn.disabled = !ready;
      if (!ready) {
        this._setStatus("Bitte Attribute `endpoint` und `username` setzen", false);
      } else {
        this._setStatus("", true);
      }
    }
    async _onRegisterClick() {
      try {
        this._setBusy(true);
        this._setStatus("Starte Registrierung \u2026");
        const base = (this.getAttribute("endpoint") || "").trim().replace(/\/?$/, "");
        const username = (this.getAttribute("username") || "").trim();
        const displayName = (this.getAttribute("display-name") || username).trim();
        if (!base) throw new Error("Bitte Endpoint angeben");
        if (!username) throw new Error("Bitte Username angeben");
        const optionsRes = await fetch(base + "/webauthn/register/options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, displayName })
        });
        if (!optionsRes.ok) throw new Error("Fehler beim Laden der Optionen: " + optionsRes.status);
        const pubKey = await optionsRes.json();
        const publicKey = this._inflateCreationOptions(pubKey);
        if (!("credentials" in navigator) || !("create" in navigator.credentials)) {
          throw new Error("WebAuthn wird von diesem Browser nicht unterst\xFCtzt");
        }
        const cred = await navigator.credentials.create({ publicKey });
        if (!cred) throw new Error("Erstellung der Anmeldedaten abgebrochen");
        const attestation = this._deflateCredential(cred);
        const verifyRes = await fetch(base + "/webauthn/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, credential: attestation })
        });
        if (!verifyRes.ok) throw new Error("Server hat die Registrierung abgelehnt: " + verifyRes.status);
        const verifyJson = await verifyRes.json().catch(() => ({}));
        this._setStatus("Passkey erfolgreich registriert", true);
        this.dispatchEvent(new CustomEvent("registered", { detail: { username, result: verifyJson }, bubbles: true }));
      } catch (e) {
        this._setStatus(e.message || String(e), false);
        this.dispatchEvent(new CustomEvent("error", { detail: { error: e }, bubbles: true }));
      } finally {
        this._setBusy(false);
      }
    }
    _setBusy(b) {
      this.btn.disabled = !!b;
      if (this.spinner) this.spinner.setAttribute("enabled", b ? "1" : "0");
    }
    _setStatus(msg, ok) {
      this.status.textContent = msg || "";
      this.status.classList.remove("ok", "err");
      this.status.classList.add(ok ? "ok" : "err");
    }
    // Convert JSON with base64url members to proper ArrayBuffers for WebAuthn
    _inflateCreationOptions(opts) {
      const out = structuredClone(opts);
      if (out.challenge) out.challenge = this._b64urlToBuf(out.challenge);
      if (out.user && out.user.id) out.user.id = this._b64urlToBuf(out.user.id);
      if (Array.isArray(out.excludeCredentials)) {
        out.excludeCredentials = out.excludeCredentials.map((c) => ({
          ...c,
          id: typeof c.id === "string" ? this._b64urlToBuf(c.id) : c.id
        }));
      }
      return out;
    }
    _deflateCredential(cred) {
      const clientExtensionResults = cred.getClientExtensionResults ? cred.getClientExtensionResults() : {};
      return {
        id: cred.id,
        type: cred.type,
        rawId: this._bufToB64url(cred.rawId),
        response: {
          attestationObject: this._bufToB64url(cred.response.attestationObject),
          clientDataJSON: this._bufToB64url(cred.response.clientDataJSON)
        },
        clientExtensionResults,
        authenticatorAttachment: cred.authenticatorAttachment || null
      };
    }
    _b64urlToBuf(b64url) {
      const pad = (s2) => s2 + "=".repeat((4 - s2.length % 4) % 4);
      const s = b64url.replace(/-/g, "+").replace(/_/g, "/");
      const str = atob(pad(s));
      const buf = new ArrayBuffer(str.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
      return buf;
    }
    _bufToB64url(buf) {
      const bytes = new Uint8Array(buf);
      let str = "";
      for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
      const b64 = btoa(str).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      return b64;
    }
  };
  customElements.define("fucodo-auth-passkey-register", PasskeyRegister);
})();
