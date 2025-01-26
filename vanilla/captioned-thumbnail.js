// captioned-thumbnail.css?raw
var captioned_thumbnail_default = '\n\n:host\n{\n    display: inline-flex;\n    width: 80px;\n    height: 80px;\n    color-scheme: light dark;\n}\n\n:host(:focus) figure\n{\n    border-color: rgb(205 205 205);\n}\n@media (prefers-color-scheme: dark) \n{\n    :host(:focus) figure\n    {\n        border-color: rgb(81 81 81);\n    }\n}\n\nfigure\n{\n    flex: 1;\n    display: grid;\n    grid-template-rows: 1fr auto;\n    margin: 0;\n    padding: 0;\n    border: solid 1px transparent;\n}\n:host(.selected) figure\n{\n    border-color: inherit;\n}\n\n[part="selected"]\n,::slotted([slot="selected"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: flex-start;\n    align-self: flex-start;\n    z-index: 2;\n\n    opacity: 0;\n    transition: opacity 200ms ease;\n}\n\n:host(:not([select],[selectable])) [part="selected"]\n,:host(:not([select],[selectable])) ::slotted([slot="selected"])\n{\n    display: none;\n    pointer-events: none;\n}\n\n[part="edit-button"]\n,::slotted([slot="edit-button"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: flex-end;\n    align-self: flex-start;\n    z-index: 2;\n\n    opacity: 0;\n    transition: opacity 200ms ease;\n}\n\n:host(:not([edit],[editable])) [part="edit-button"]\n,:host(:not([edit],[editable])) ::slotted([slot="edit-button"])\n{\n    display: none;\n    pointer-events: none;\n}\n\n[part="icon"]\n,::slotted([slot="icon"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: center;\n    align-self: center;\n\n    width: var(--icon-width, var(--icon-size));\n    margin: .25em;\n}\n::slotted(img[slot="icon"])\n{\n    display: block;\n    max-width: 100%;\n    min-width: 0;\n    max-height: 100%;\n    min-height: 0;\n}\n.text-icon\n{\n    font-size: 36px;\n    line-height: 1;\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n[part="label"]\n,::slotted([slot="label"])\n{\n    text-align: center;\n    text-overflow: ellipsis;\n    overflow: hidden;\n}\n\n:host(:not([select],[selectable]):hover)  [part="edit-button"]\n,:host(:not([select],[selectable]):hover) ::slotted([slot="edit-button"])\n,:host(:focus)  [part="edit-button"]\n,:host(:focus) ::slotted([slot="edit-button"])\n,figure:has(:checked) [part="edit-button"]\n,figure:has(:checked) ::slotted([slot="edit-button"])\n,figure:has(:focus) [part="edit-button"]\n,figure:has(:focus) ::slotted([slot="edit-button"])\n,figure:has(:focus-within) [part="edit-button"]\n,figure:has(:focus-within) ::slotted([slot="edit-button"])\n{ \n    opacity: 1;\n}\n\n\n:host(:hover) [part="selected"]\n,figure:has(:checked) [part="selected"]\n,figure:focus [part="selected"] \n,figure:focus-within [part="selected"]\n{ \n    opacity: 1;\n}';

// captioned-thumbnail.html?raw
var captioned_thumbnail_default2 = '<figure part="figure">\n    <slot name="selected"><input type="checkbox" part="selected" /></slot>\n    <slot name="edit-button"><button type="button" part="edit-button">&#9998;</button></slot>\n    <slot name="icon"><span part="icon" class="text-icon">\u{1F5CE}</span></slot>\n    <slot name="label"><figcaption part="label"><slot>Item</slot></figcaption></slot>\n</figure>';

// captioned-thumbnail.ts
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(captioned_thumbnail_default);
var COMPONENT_TAG_NAME = "captioned-thumbnail";
var CaptionedThumbnailElement = class _CaptionedThumbnailElement extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getPart(key) {
    if (this.componentParts.get(key) == null) {
      const part = this.shadowRoot.querySelector(`[part="${key}"]`);
      if (part != null) {
        this.componentParts.set(key, part);
      }
    }
    return this.componentParts.get(key);
  }
  findPart(key) {
    return this.shadowRoot.querySelector(`[part="${key}"]`);
  }
  static selectedClassName = "selected";
  get isSelected() {
    return this.classList.contains(_CaptionedThumbnailElement.selectedClassName);
  }
  set isSelected(value) {
    if (this.getAttribute("select") ?? this.getAttribute("selectable") == null) {
      return;
    }
    if (value == true) {
      this.classList.add(_CaptionedThumbnailElement.selectedClassName);
    } else {
      this.classList.remove(_CaptionedThumbnailElement.selectedClassName);
    }
    const selected = this.findPart("selected");
    if (selected != null) {
      selected.checked = value;
    }
  }
  editButton;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = captioned_thumbnail_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", (event) => {
      let title = "";
      for (let i = 0; i < this.childNodes.length; i++) {
        const node = this.childNodes[i];
        if (node.nodeType == Node.TEXT_NODE) {
          const nodeText = node.textContent?.trim() ?? "";
          if (nodeText != "") {
            title += nodeText;
          }
        }
      }
      this.title = title;
    });
    this.addEventListener("keydown", (event) => {
      if (this.shadowRoot.activeElement == this.findPart("figure") && event.code == "Space") {
        this.isSelected = !this.isSelected;
      }
    });
    this.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.getAttribute("select") ?? this.getAttribute("selectable") == null) {
        return;
      }
      const selected = this.findPart("selected");
      if (selected != null) {
        const isSelected = this.classList.contains(_CaptionedThumbnailElement.selectedClassName);
        const method = isSelected == selected.checked ? "click" : "input";
        if (isSelected == true) {
          this.classList.remove(_CaptionedThumbnailElement.selectedClassName);
          selected.checked = false;
        } else {
          this.classList.add(_CaptionedThumbnailElement.selectedClassName);
          selected.checked = true;
        }
        const mouseEvent = event;
        this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { shiftKey: mouseEvent.shiftKey, ctrlKey: mouseEvent.ctrlKey, method } }));
      }
    });
    const editButtonSlot = this.shadowRoot.querySelector('slot[name="edit-button"]');
    editButtonSlot.addEventListener("slotchange", () => {
      const button = editButtonSlot.assignedElements()[0];
      if (this.editButton == button) {
        return;
      }
      button.addEventListener("click", (event) => {
        this.dispatchEvent(new CustomEvent("edit", { bubbles: true, composed: true }));
        event.stopPropagation();
        event.preventDefault();
        return false;
      });
      this.editButton = button;
    });
    this.findPart("edit-button")?.addEventListener("click", (event) => {
      this.dispatchEvent(new CustomEvent("edit", { bubbles: true, composed: true }));
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  }
  static observedAttributes = ["label", "src", "select", "selectable"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "label") {
      const label = this.findPart("label") ?? this.querySelector(":not([slot])");
      if (label != null) {
        label.textContent = newValue;
        this.title = newValue;
      }
    } else if (attributeName == "src") {
      this.updateImage(newValue);
    } else if (attributeName == "select" || attributeName == "selectable") {
      this.findPart("figure").tabIndex = 0;
    }
  }
  updateImage(source) {
    let icon = this.findPart("icon") ?? this.querySelector('[slot="icon"]');
    if (source == null) {
      if (icon != null) {
        icon.remove();
      }
      icon = document.createElement("span");
      icon.setAttribute("part", "icon");
      icon.classList.add("text-icon");
      icon.textContent = "\u{1F5CE}";
      this.shadowRoot.querySelector('slot[name="icon"]')?.appendChild(icon);
      return;
    }
    if (icon != null && icon.tagName != "img") {
      icon.remove();
      icon = null;
    }
    if (icon == null) {
      icon = document.createElement("img");
      icon.setAttribute("alt", "Icon");
      icon.setAttribute("title", "Icon");
      icon.setAttribute("slot", "icon");
      this.appendChild(icon);
    }
    icon.src = source;
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, CaptionedThumbnailElement);
}
export {
  CaptionedThumbnailElement
};
