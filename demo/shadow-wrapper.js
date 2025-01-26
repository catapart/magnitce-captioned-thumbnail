import '../vanilla/captioned-thumbnail.js';
const COMPONENT_TAG_NAME = 'shadow-wrapper';
export class ShadowWrapperElement extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<slot></slot>
        <captioned-thumbnail edit select></captioned-thumbnail>`;
        const slot = this.shadowRoot.querySelector('slot');
        slot.onslotchange = () =>
        {
            const children = slot.assignedElements()[0].children;
            this.shadowRoot.querySelector('captioned-thumbnail').append(...children);
        }
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, ShadowWrapperElement);
}