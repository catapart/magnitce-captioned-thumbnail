import style from './captioned-thumbnail.css?raw';
import html from './captioned-thumbnail.html?raw';


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
        return this.classList.contains(CaptionedThumbnailElement.selectedClassName);
    }
    set isSelected(value: boolean)
    {
        if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
        {
            return;
        }

        if(value == true)
        {
            this.classList.add(CaptionedThumbnailElement.selectedClassName);
        }
        else
        {
            this.classList.remove(CaptionedThumbnailElement.selectedClassName);
        }
        const selected = this.findElement<HTMLInputElement>('selected')
        if(selected != null)
        {
            selected.checked = value;
        }
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
        this.#applyPartAttributes();
        this.#updateTitle();

        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', (event) =>
        {
            this.#updateTitle();
        });

        this.addEventListener('keydown', (event) =>
        {
            if(this.shadowRoot!.activeElement == this.findElement('figure') && event.code == "Space")
            {
                this.isSelected = !this.isSelected;
            }
        })

        this.addEventListener('click', (event) =>
        {
            if(this.hasAttribute('stop-click') == true)
            {
                event.stopPropagation();
            }

            const targetEditButton = event.composedPath().find(item => item instanceof HTMLElement 
            && (item.id == 'edit-button' || item.getAttribute('slot') == "edit-button"))
            if(targetEditButton != null) {
                this.dispatchEvent(new CustomEvent('edit', { detail: { button: targetEditButton, item: this }, bubbles: true, composed: true, }));
                return;
            }

            if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
            {
                return;
            }

            const selected = this.findElement('selected') as HTMLInputElement;
            if(selected != null)
            {
                const isSelected = (this.classList.contains(CaptionedThumbnailElement.selectedClassName));
                const method = (isSelected == selected.checked) ? "click" : "input";

                const mouseEvent = (event as MouseEvent);
                const allowDefault = this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, cancelable: true, detail: { shiftKey: mouseEvent.shiftKey, ctrlKey: mouseEvent.ctrlKey, method  }}));
                console.log('allowDefault', allowDefault);
                if(allowDefault == false) { return; }
                if(isSelected == true)
                {
                    this.classList.remove(CaptionedThumbnailElement.selectedClassName);
                    selected.checked = false;
                }
                else
                {
                    this.classList.add(CaptionedThumbnailElement.selectedClassName);
                    selected.checked = true;
                }
            }
        });
        
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

    updateImage(source: string)
    {
        let imageIcon = this.findElement<HTMLImageElement>('image-icon')!;
        imageIcon.src = source;
    }

    static observedAttributes = [ 'label', 'src', 'select', 'selectable' ];
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
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CaptionedThumbnailElement);
}