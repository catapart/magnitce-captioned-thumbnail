import style from './captioned-thumbnail.css?raw';
import html from './captioned-thumbnail.html?raw';

const KEYCODE_SELECTION_MAP = ['Space', 'Enter'];

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'captioned-thumbnail';
export class CaptionedThumbnailElement extends HTMLElement
{
    componentParts: Map<string, HTMLElement> = new Map();
    getElement<T extends HTMLElement = HTMLElement>(id: string)
    {
        if(this.componentParts.get(id) == null)
        {
            const part = this.findElement(id);
            if(part != null) { this.componentParts.set(id, part); }
        }

        return this.componentParts.get(id) as T;
    }
    findElement<T extends HTMLElement = HTMLElement>(id: string) { return this.shadowRoot!.getElementById(id) as T; }

    static selectedClassName: string = 'selected';
    get isSelected()
    {
        return this.hasAttribute('aria-selected');
    }
    set isSelected(value: boolean)
    {
        if(value == true) { this.#select(); }
        else { this.#deselect(); }
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
        this.#applyPartAttributes();
        this.#updateTitle();

        this.addEventListener('click', this.#onClick.bind(this));
        this.addEventListener('keydown', this.#onKeyDown.bind(this));

        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', this.#onSlotChange.bind(this));

        const selected = this.findElement<HTMLInputElement>('selected');
        if(selected != null)
        {
            selected.addEventListener('input', this.#selectedInput_onInput.bind(this))
        }
    }
    #applyPartAttributes()
    {
        const identifiedElements = [...this.shadowRoot!.querySelectorAll('[id]')];
        for(let i = 0; i < identifiedElements.length; i++)
        {
            identifiedElements[i].part.add(identifiedElements[i].id);
        }
        const classedElements = [...this.shadowRoot!.querySelectorAll('[class]')];
        for(let i = 0; i < classedElements.length; i++)
        {
            classedElements[i].part.add(...classedElements[i].classList);
        }
    }

    #onSlotChange(_event: Event)
    {
        this.#updateTitle();
    }
    #onClick(event: Event)
    {
        const targetEditButton = event.composedPath().find(item => item instanceof HTMLElement 
        && (item.id == 'edit-button' || item.getAttribute('slot') == "edit-button"));
        if(targetEditButton != null) {
            this.dispatchEvent(new CustomEvent('edit', { detail: { button: targetEditButton, item: this }, bubbles: true, composed: true, }));
            event.stopPropagation();
            return;
        }

        if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
        {
            return;
        }
        
        const targetSelectInput = event.composedPath().find(item => item instanceof HTMLInputElement 
        && (item.id == 'selected' || item.getAttribute('slot') == "selected"));
        const method = (targetSelectInput == null) ? "click" : "input";
        const mouseEvent = (event as MouseEvent);
        const allowDefault = this.dispatchEvent(new CustomEvent('change', 
        { 
            bubbles: true,
            composed: true,
            cancelable: true,
            detail:
            {
                shiftKey: mouseEvent.shiftKey,
                ctrlKey: mouseEvent.ctrlKey,
                method
            }
        }));
        if(allowDefault == false) { return; }
        this.toggleSelection();
    }
    #onKeyDown(event: KeyboardEvent)
    {
        if(this.shadowRoot!.activeElement == this.findElement('figure') && KEYCODE_SELECTION_MAP.indexOf(event.code) != -1)
        {
            event.preventDefault();
            const allowDefault = this.dispatchEvent(new CustomEvent('change', 
            { 
                bubbles: true,
                composed: true,
                cancelable: true,
                detail:
                {
                    method: event.code
                }
            }));
            if(allowDefault == false) { return; }
            this.toggleSelection();
        }
    }
    #selectedInput_onInput(event: Event)
    {
        event.preventDefault();
        event.stopPropagation();

        this.isSelected = (event.target as HTMLInputElement).checked;
    }

    #updateTitle()
    {
        let title = "";
        for(let i = 0; i < this.childNodes.length; i++)
        {
            const node = this.childNodes[i];
            if(node.nodeType == Node.TEXT_NODE)
            {
                const nodeText = node.textContent?.trim() ?? "";
                if(nodeText != "")
                {
                    title += nodeText;
                }
            }
        }
        if(title.trim() == "") { title = this.findElement('caption')!.textContent!; }
        this.title = title;
    }

    #select()
    {
        if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
        {
            return;
        }
        this.setAttribute('aria-selected', 'option');
    }
    #deselect()
    {
        this.removeAttribute('aria-selected');
    }
    toggleSelection()
    {
        if(this.isSelected == true) { this.#deselect(); }
        else { this.#select(); }
    }

    #updateSelectionIndicators()
    {
        const isSelected = this.isSelected;

        const selected = this.findElement<HTMLInputElement>('selected');
        if(selected != null)
        {
            selected.checked = this.isSelected;
        }
        this.classList.toggle(CaptionedThumbnailElement.selectedClassName, isSelected);
    }

    updateImage(source: string)
    {
        let imageIcon = this.findElement<HTMLImageElement>('image-icon')!;
        imageIcon.src = source;
    }

    static observedAttributes = [ 'label', 'src', 'select', 'selectable', 'aria-selected' ];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
    {
        if(attributeName == 'label')
        {
            // clear text nodes
            const textNodes = Array.from(this.childNodes).filter(item => item.nodeType == Node.TEXT_NODE);
            for(let i = 0; i < textNodes.length; i++) { textNodes[i].remove(); }
            // add new label as child to be handled as default slot
            this.append(newValue);
            this.#updateTitle();
        }
        else if(attributeName == 'src')
        {
            this.updateImage(newValue);
        }
        else if(attributeName == 'select' || attributeName == 'selectable')
        {
            this.findElement('figure').tabIndex = 0;
        }
        else if(attributeName == 'aria-selected')
        {
            this.#updateSelectionIndicators();
        }
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CaptionedThumbnailElement);
}