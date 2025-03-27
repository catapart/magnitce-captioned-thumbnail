// captioned-thumbnail.css?raw
var captioned_thumbnail_default = '\n\n:host\n{\n    display: inline-flex;\n    width: 80px;\n    height: 80px;\n    color-scheme: light dark;\n}\n\n:host(:focus) figure\n{\n    border-color: rgb(205 205 205);\n}\n@media (prefers-color-scheme: dark) \n{\n    :host(:focus) figure\n    {\n        border-color: rgb(81 81 81);\n    }\n}\n\nfigure\n{\n    flex: 1;\n    display: grid;\n    grid-template-rows: 1fr auto;\n    margin: 0;\n    padding: 0;\n    border: solid 1px transparent;\n}\n:host(.selected) figure\n{\n    border-color: inherit;\n}\n\n#selected\n,::slotted([slot="selected"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: flex-start;\n    align-self: flex-start;\n    z-index: 2;\n\n    opacity: 0;\n    transition: opacity 200ms ease;\n}\n\n:host(:not([select],[selectable])) #selected\n,:host(:not([select],[selectable])) ::slotted([slot="selected"])\n{\n    display: none;\n    pointer-events: none;\n}\n\n#edit-button\n,::slotted([slot="edit-button"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: flex-end;\n    align-self: flex-start;\n    z-index: 2;\n\n    opacity: 0;\n    transition: opacity 200ms ease;\n}\n\n:host(:not([edit],[editable])) #edit-button\n,:host(:not([edit],[editable])) ::slotted([slot="edit-button"])\n{\n    display: none;\n    pointer-events: none;\n}\n\n.icon\n,::slotted([slot="icon"])\n{\n    grid-column: 1;\n    grid-row: 1;\n\n    justify-self: center;\n    align-self: center;\n\n    width: var(--icon-width, var(--icon-size));\n    margin: .25em;\n}\n#image-icon\n,::slotted(img[slot="icon"])\n{\n    display: block;\n    max-width: 100%;\n    min-width: 0;\n    max-height: 100%;\n    min-height: 0;\n}\n#text-icon\n{\n    font-size: 36px;\n    line-height: 1;\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n:host(:not([src])) #image-icon\n,:host([src]) #text-icon\n{\n    display: none;\n}\n\n#caption\n,::slotted([slot="caption"])\n{\n    text-align: center;\n    text-overflow: ellipsis;\n    overflow: hidden;\n}\n\n:host(:not([select],[selectable]):hover)  #edit-button\n,:host(:not([select],[selectable]):hover) ::slotted([slot="edit-button"])\n,:host(:focus)  #edit-button\n,:host(:focus) ::slotted([slot="edit-button"])\n,figure:has(:checked) #edit-button\n,figure:has(:checked) ::slotted([slot="edit-button"])\n,figure:has(:focus) #edit-button\n,figure:has(:focus) ::slotted([slot="edit-button"])\n,figure:has(:focus-within) #edit-button\n,figure:has(:focus-within) ::slotted([slot="edit-button"])\n{ \n    opacity: 1;\n}\n\n\n:host(:hover) #selected\n,figure:has(:checked) #selected\n,figure:focus #selected\n,figure:focus-within #selected\n{ \n    opacity: 1;\n}';

// captioned-thumbnail.html?raw
var captioned_thumbnail_default2 = '<figure id="figure">\n    <slot name="selected"><input type="checkbox" id="selected" /></slot>\n    <slot name="edit-button"><button type="button" id="edit-button">&#9998;</button></slot>\n    <slot name="icon">\n        <span id="text-icon" class="icon">\u{1F5CE}</span>\n        <img id="image-icon" class="icon" />\n    </slot>\n    <slot name="caption"><figcaption id="caption"><slot>Item</slot></figcaption></slot>\n</figure>';

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
