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

    get isSelected()
    {
        return this.findPart<HTMLInputElement>('selected')?.checked;
    }
    set isSelected(_value: boolean)
    {
        if(this.getAttribute('select') ?? this.getAttribute('selectable') == null)
        {
            return;
        }

        const selected = this.findPart<HTMLInputElement>('selected')
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
        
        // const src = this.getAttribute('src');
        // if(src != null) 
        // {
        //     this.updateImage(src);
        // }
        // const selectable = this.getAttribute('select') ?? this.getAttribute('selectable');
        // if(selectable != null)
        // {
        //     this.findPart('figure').tabIndex = 0;
        // }

        /*
         * click events fire before change events, per spec
         * input gets checked before click event
         * 
         * to straighten this out, we use the click event
         * to dispatch an input change event which handles
         * the logic.
         */

        this.findPart('selected')?.addEventListener('change', (event) =>
        {
            const mouseEvent = (event as MouseEvent);
            const eventTarget = (event.target as HTMLInputElement);
            eventTarget.checked = !eventTarget.checked;
            if(eventTarget.checked == true)
            {
                this.classList.add('selected');
            }
            else
            {
                this.classList.remove('selected');
            }
            this.dispatchEvent(new CustomEvent('change', { detail: { shiftKey: mouseEvent.shiftKey, ctrlKey: mouseEvent.ctrlKey, method: 'click'  }}));
        });

        this.addEventListener('keydown', (event) =>
        {
            console.log();
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
            this.findPart<HTMLInputElement>('selected')?.dispatchEvent(new Event('change'));
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
            if(label != null ) { label.textContent = newValue; }
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