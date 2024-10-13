import style from './captioned-thumbnail.css?raw';
import html from './captioned-thumbnail.html?raw';


const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'captioned-thumbnail';
export class CaptionedThumbnailElement extends HTMLElement
{
    componentParts: Map<string, HTMLElement> = new Map();
    getPart<T extends HTMLElement = HTMLElement>(key: string)
    {
        if(this.componentParts.get(key) == null)
        {
            const part = this.shadowRoot!.querySelector(`[part="${key}"]`) as HTMLElement;
            if(part != null) { this.componentParts.set(key, part); }
        }

        return this.componentParts.get(key) as T;
    }
    findPart<T extends HTMLElement = HTMLElement>(key: string) { return this.shadowRoot!.querySelector(`[part="${key}"]`) as T; }

    static selectedClassName: string = 'selected';
    get isSelected()
    {
        return this.findPart<HTMLInputElement>(CaptionedThumbnailElement.selectedClassName)?.checked;
    }
    set isSelected(_value: boolean)
    {
        if(this.getAttribute('select') ?? this.getAttribute(CaptionedThumbnailElement.selectedClassName) == null)
        {
            return;
        }

        const selected = this.findPart<HTMLInputElement>(CaptionedThumbnailElement.selectedClassName)
        if(selected != null)
        {
            selected.dispatchEvent(new Event('change'));
        }
    }

    editButton?: WeakKey;

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', (event) =>
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
            this.title = title;
        });

        this.addEventListener('keydown', (event) =>
        {
            if(this.shadowRoot!.activeElement == this.findPart('figure') && event.code == "Space")
            {
                this.isSelected = !this.isSelected;
            }
        })

        this.addEventListener('click', (event) =>
        {
            event.stopPropagation();

            if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
            {
                return;
            }

            const selected = this.findPart(CaptionedThumbnailElement.selectedClassName) as HTMLInputElement;
            if(selected != null)
            {
                const isSelected = (this.classList.contains(CaptionedThumbnailElement.selectedClassName));
                const method = (isSelected == selected.checked) ? "click" : "input";
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
                const mouseEvent = (event as MouseEvent);
                this.dispatchEvent(new CustomEvent('change', { detail: { shiftKey: mouseEvent.shiftKey, ctrlKey: mouseEvent.ctrlKey, method  }}));
            }
        });

        const editButtonSlot = this.shadowRoot!.querySelector('slot[name="edit-button"]') as HTMLSlotElement;
        editButtonSlot.addEventListener('slotchange', () =>
        {
            const button = editButtonSlot.assignedElements()[0];
            if(this.editButton == button) { return; }
            button.addEventListener('click', (event) =>
            {
                this.dispatchEvent(new CustomEvent('edit'));
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.editButton = button;
        });

        this.findPart('edit-button')?.addEventListener('click', (event) =>
        {
            this.dispatchEvent(new CustomEvent('edit'));
            event.stopPropagation();
            event.preventDefault();
            return false;
        });
        
    }

    static observedAttributes = [ 'label', 'src', 'select', 'selectable' ];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
    {
        if(attributeName == 'label')
        {
            const label = this.findPart('label') ?? this.querySelector(':not([slot])');
            if(label != null )
            { 
                label.textContent = newValue;
                this.title = newValue;
            }
        }
        else if(attributeName == 'src')
        {
            this.updateImage(newValue);
        }
        else if(attributeName == 'select' || attributeName == 'selectable')
        {
            this.findPart('figure').tabIndex = 0;
        }
    }

    updateImage(source: string)
    {
        let icon: HTMLElement|null = this.findPart('icon') ?? this.querySelector('[slot="icon"]');

        if(source == null)
        {
            // clear thumbnail

            if(icon != null)
            {
                icon.remove();
            }

            icon = document.createElement('span');
            icon.setAttribute('part', 'icon');
            icon.classList.add('text-icon');
            icon.textContent = '🗎';

            this.shadowRoot!.querySelector('slot[name="icon"]')?.appendChild(icon);

            return;
        }

        if(icon != null && icon.tagName != 'img')
        {
            icon.remove();
            icon = null;
        }
        if(icon == null)
        {
            icon = document.createElement('img');
            icon.setAttribute('alt', 'Icon');
            icon.setAttribute('title', 'Icon');
            icon.setAttribute('slot', 'icon');
            this.appendChild(icon);
        }
        (icon as HTMLImageElement).src = source;

    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CaptionedThumbnailElement);
}