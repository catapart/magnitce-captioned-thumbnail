import '../vanilla/captioned-thumbnail.js';
import './shadow-wrapper.js';

const COMPONENT_TAG_NAME = 'shadow-wrapper-container';
export class ShadowRapperContainerElement extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<slot></slot>
        <shadow-wrapper part="shadow-wrapper" exportpart="captioned-thumbnail"></shadow-wrapper>`;
        const slot = this.shadowRoot.querySelector('slot');
        slot.onslotchange = () =>
        {
            const children = slot.assignedElements()[0].children;
            const subslot = document.createElement('slot');
            subslot.append(...children);

            this.shadowRoot.querySelector('shadow-wrapper').innerHTML = "";
            this.shadowRoot.querySelector('shadow-wrapper').append(subslot);
        }
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, ShadowRapperContainerElement);
}