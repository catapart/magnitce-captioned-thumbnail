// captioned-thumbnail.css?raw
var captioned_thumbnail_default = '\r\n\r\n:host\r\n{\r\n    display: inline-flex;\r\n    width: 80px;\r\n    height: 80px;\r\n    color-scheme: light dark;\r\n}\r\n\r\n:host(:focus) figure\r\n{\r\n    border-color: rgb(205 205 205);\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host(:focus) figure\r\n    {\r\n        border-color: rgb(81 81 81);\r\n    }\r\n}\r\n\r\nfigure\r\n{\r\n    flex: 1;\r\n    display: grid;\r\n    grid-template-rows: 1fr auto;\r\n    margin: 0;\r\n    padding: 0;\r\n    border: solid 1px transparent;\r\n}\r\n:host(.selected) figure\r\n{\r\n    border-color: inherit;\r\n}\r\n\r\n#selected\r\n,::slotted([slot="selected"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: flex-start;\r\n    align-self: flex-start;\r\n    z-index: 2;\r\n\r\n    opacity: 0;\r\n    transition: opacity 200ms ease;\r\n}\r\n\r\n:host(:not([select],[selectable])) #selected\r\n,:host(:not([select],[selectable])) ::slotted([slot="selected"])\r\n{\r\n    display: none;\r\n    pointer-events: none;\r\n}\r\n\r\n#edit-button\r\n,::slotted([slot="edit-button"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: flex-end;\r\n    align-self: flex-start;\r\n    z-index: 2;\r\n\r\n    opacity: 0;\r\n    transition: opacity 200ms ease;\r\n}\r\n\r\n:host(:not([edit],[editable])) #edit-button\r\n,:host(:not([edit],[editable])) ::slotted([slot="edit-button"])\r\n{\r\n    display: none;\r\n    pointer-events: none;\r\n}\r\n\r\n.icon\r\n,::slotted([slot="icon"])\r\n{\r\n    grid-column: 1;\r\n    grid-row: 1;\r\n\r\n    justify-self: center;\r\n    align-self: center;\r\n\r\n    width: var(--icon-width, var(--icon-size));\r\n    margin: .25em;\r\n}\r\n#image-icon\r\n,::slotted(img[slot="icon"])\r\n{\r\n    display: block;\r\n    max-width: 100%;\r\n    min-width: 0;\r\n    max-height: 100%;\r\n    min-height: 0;\r\n}\r\n#text-icon\r\n{\r\n    font-size: 36px;\r\n    line-height: 1;\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n:host(:not([src])) #image-icon\r\n,:host([src]) #text-icon\r\n{\r\n    display: none;\r\n}\r\n\r\n#caption\r\n,::slotted([slot="caption"])\r\n{\r\n    text-align: center;\r\n    text-overflow: ellipsis;\r\n    overflow: hidden;\r\n}\r\n\r\n:host(:not([select],[selectable]):hover)  #edit-button\r\n,:host(:not([select],[selectable]):hover) ::slotted([slot="edit-button"])\r\n,:host(:focus)  #edit-button\r\n,:host(:focus) ::slotted([slot="edit-button"])\r\n,figure:has(:checked) #edit-button\r\n,figure:has(:checked) ::slotted([slot="edit-button"])\r\n,figure:has(:focus) #edit-button\r\n,figure:has(:focus) ::slotted([slot="edit-button"])\r\n,figure:has(:focus-within) #edit-button\r\n,figure:has(:focus-within) ::slotted([slot="edit-button"])\r\n{ \r\n    opacity: 1;\r\n}\r\n\r\n\r\n:host(:hover) #selected\r\n,figure:has(:checked) #selected\r\n,figure:focus #selected\r\n,figure:focus-within #selected\r\n{ \r\n    opacity: 1;\r\n}';

// captioned-thumbnail.html?raw
var captioned_thumbnail_default2 = '<figure id="figure">\r\n    <slot name="selected"><input type="checkbox" id="selected" /></slot>\r\n    <slot name="edit-button"><button type="button" id="edit-button">&#9998;</button></slot>\r\n    <slot name="icon">\r\n        <span id="text-icon" class="icon">\u{1F5CE}</span>\r\n        <img id="image-icon" class="icon" />\r\n    </slot>\r\n    <slot name="caption"><figcaption id="caption"><slot>Item</slot></figcaption></slot>\r\n</figure>';

// captioned-thumbnail.ts
var KEYCODE_SELECTION_MAP = ["Space", "Enter"];
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(captioned_thumbnail_default);
var COMPONENT_TAG_NAME = "captioned-thumbnail";
var CaptionedThumbnailElement = class _CaptionedThumbnailElement extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getElement(id) {
    if (this.componentParts.get(id) == null) {
      const part = this.findElement(id);
      if (part != null) {
        this.componentParts.set(id, part);
      }
    }
    return this.componentParts.get(id);
  }
  findElement(id) {
    return this.shadowRoot.getElementById(id);
  }
  static selectedClassName = "selected";
  get isSelected() {
    return this.hasAttribute("aria-selected");
  }
  set isSelected(value) {
    if (value == true) {
      this.#select();
    } else {
      this.#deselect();
    }
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = captioned_thumbnail_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.#applyPartAttributes();
    this.#updateTitle();
    this.addEventListener("click", this.#onClick.bind(this));
    this.addEventListener("keydown", this.#onKeyDown.bind(this));
    this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", this.#onSlotChange.bind(this));
    const selected = this.findElement("selected");
    if (selected != null) {
      selected.addEventListener("input", this.#selectedInput_onInput.bind(this));
    }
  }
  #applyPartAttributes() {
    const identifiedElements = [...this.shadowRoot.querySelectorAll("[id]")];
    for (let i = 0; i < identifiedElements.length; i++) {
      identifiedElements[i].part.add(identifiedElements[i].id);
    }
    const classedElements = [...this.shadowRoot.querySelectorAll("[class]")];
    for (let i = 0; i < classedElements.length; i++) {
      classedElements[i].part.add(...classedElements[i].classList);
    }
  }
  #onSlotChange(_event) {
    this.#updateTitle();
  }
  #onClick(event) {
    const targetEditButton = event.composedPath().find((item) => item instanceof HTMLElement && (item.id == "edit-button" || item.getAttribute("slot") == "edit-button"));
    if (targetEditButton != null) {
      this.dispatchEvent(new CustomEvent("edit", { detail: { button: targetEditButton, item: this }, bubbles: true, composed: true }));
      event.stopPropagation();
      return;
    }
    if (this.getAttribute("select") ?? this.getAttribute("selectable") == null) {
      return;
    }
    const targetSelectInput = event.composedPath().find((item) => item instanceof HTMLInputElement && (item.id == "selected" || item.getAttribute("slot") == "selected"));
    const method = targetSelectInput == null ? "click" : "input";
    const mouseEvent = event;
    const allowDefault = this.dispatchEvent(new CustomEvent(
      "change",
      {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          shiftKey: mouseEvent.shiftKey,
          ctrlKey: mouseEvent.ctrlKey,
          method
        }
      }
    ));
    if (allowDefault == false) {
      return;
    }
    this.toggleSelection();
  }
  #onKeyDown(event) {
    if (this.shadowRoot.activeElement == this.findElement("figure") && KEYCODE_SELECTION_MAP.indexOf(event.code) != -1) {
      event.preventDefault();
      const allowDefault = this.dispatchEvent(new CustomEvent(
        "change",
        {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            method: event.code
          }
        }
      ));
      if (allowDefault == false) {
        return;
      }
      this.toggleSelection();
    }
  }
  #selectedInput_onInput(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isSelected = event.target.checked;
  }
  #updateTitle() {
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
    if (title.trim() == "") {
      title = this.findElement("caption").textContent;
    }
    this.title = title;
  }
  #select() {
    if (this.getAttribute("select") ?? this.getAttribute("selectable") == null) {
      return;
    }
    this.setAttribute("aria-selected", "option");
  }
  #deselect() {
    this.removeAttribute("aria-selected");
  }
  toggleSelection() {
    if (this.isSelected == true) {
      this.#deselect();
    } else {
      this.#select();
    }
  }
  #updateSelectionIndicators() {
    const isSelected = this.isSelected;
    const selected = this.findElement("selected");
    if (selected != null) {
      selected.checked = this.isSelected;
    }
    this.classList.toggle(_CaptionedThumbnailElement.selectedClassName, isSelected);
  }
  updateImage(source) {
    let imageIcon = this.findElement("image-icon");
    imageIcon.src = source;
  }
  static observedAttributes = ["label", "src", "select", "selectable", "aria-selected"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "label") {
      const textNodes = Array.from(this.childNodes).filter((item) => item.nodeType == Node.TEXT_NODE);
      for (let i = 0; i < textNodes.length; i++) {
        textNodes[i].remove();
      }
      this.append(newValue);
      this.#updateTitle();
    } else if (attributeName == "src") {
      this.updateImage(newValue);
    } else if (attributeName == "select" || attributeName == "selectable") {
      this.findElement("figure").tabIndex = 0;
    } else if (attributeName == "aria-selected") {
      this.#updateSelectionIndicators();
    }
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, CaptionedThumbnailElement);
}
export {
  CaptionedThumbnailElement
};
