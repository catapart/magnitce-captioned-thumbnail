// captioned-thumbnail.css?raw
var captioned_thumbnail_default = '\r\n\r\n:host\r\n{\r\n    display: inline-flex;\r\n    width: 80px;\r\n    height: 80px;\r\n    color-scheme: light dark;\r\n}\r\n\r\n:host(:focus) figure\r\n{\r\n    border-color: rgb(205 205 205);\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host(:focus) figure\r\n    {\r\n        border-color: rgb(81 81 81);\r\n    }\r\n}\r\n\r\nfigure\r\n{\r\n    flex: 1;\r\n    display: grid;\r\n    grid-template-rows: 1fr auto;\r\n    margin: 0;\r\n    padding: 0;\r\n    border: solid 1px transparent;\r\n}\r\n:host(.selected) figure\r\n{\r\n    border-color: inherit;\r\n}\r\n\r\n[part="selected"]\r\n,::slotted([slot="selected"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: flex-start;\r\n    align-self: flex-start;\r\n    z-index: 2;\r\n\r\n    opacity: 0;\r\n    transition: opacity 200ms ease;\r\n}\r\n\r\n:host(:not([select],[selectable])) [part="selected"]\r\n,:host(:not([select],[selectable])) ::slotted([slot="selected"])\r\n{\r\n    display: none;\r\n    pointer-events: none;\r\n}\r\n\r\n[part="edit-button"]\r\n,::slotted([slot="edit-button"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: flex-end;\r\n    align-self: flex-start;\r\n    z-index: 2;\r\n\r\n    opacity: 0;\r\n    transition: opacity 200ms ease;\r\n}\r\n\r\n:host(:not([edit],[editable])) [part="edit-button"]\r\n,:host(:not([edit],[editable])) ::slotted([slot="edit-button"])\r\n{\r\n    display: none;\r\n    pointer-events: none;\r\n}\r\n\r\n[part="icon"]\r\n,::slotted([slot="icon"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: center;\r\n    align-self: center;\r\n\r\n    width: var(--icon-width, var(--icon-size));\r\n    margin: .25em;\r\n}\r\n::slotted(img[slot="icon"])\r\n{\r\n    display: block;\r\n    max-width: 100%;\r\n    min-width: 0;\r\n    max-height: 100%;\r\n    min-height: 0;\r\n}\r\n.text-icon\r\n{\r\n    font-size: 36px;\r\n    line-height: 1;\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n[part="label"]\r\n,::slotted([slot="label"])\r\n{\r\n    text-align: center;\r\n    text-overflow: ellipsis;\r\n    overflow: hidden;\r\n}\r\n\r\n:host(:not([select],[selectable]):hover)  [part="edit-button"]\r\n,:host(:not([select],[selectable]):hover) ::slotted([slot="edit-button"])\r\n,:host(:focus)  [part="edit-button"]\r\n,:host(:focus) ::slotted([slot="edit-button"])\r\n,figure:has(:checked) [part="edit-button"]\r\n,figure:has(:checked) ::slotted([slot="edit-button"])\r\n,figure:has(:focus) [part="edit-button"]\r\n,figure:has(:focus) ::slotted([slot="edit-button"])\r\n,figure:has(:focus-within) [part="edit-button"]\r\n,figure:has(:focus-within) ::slotted([slot="edit-button"])\r\n{ \r\n    opacity: 1;\r\n}\r\n\r\n\r\n:host(:hover) [part="selected"]\r\n,figure:has(:checked) [part="selected"]\r\n,figure:focus [part="selected"] \r\n,figure:focus-within [part="selected"]\r\n{ \r\n    opacity: 1;\r\n}';

// captioned-thumbnail.html?raw
var captioned_thumbnail_default2 = '<figure part="figure">\r\n    <slot name="selected"><input type="checkbox" part="selected" /></slot>\r\n    <slot name="edit-button"><button type="button" part="edit-button">&#9998;</button></slot>\r\n    <slot name="icon"><span part="icon" class="text-icon">\u{1F5CE}</span></slot>\r\n    <slot name="label"><figcaption part="label"><slot>Item</slot></figcaption></slot>\r\n</figure>';

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
