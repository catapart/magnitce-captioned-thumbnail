declare class CaptionedThumbnailElement extends HTMLElement {
    #private;
    componentParts: Map<string, HTMLElement>;
    getElement<T extends HTMLElement = HTMLElement>(id: string): T;
    findElement<T extends HTMLElement = HTMLElement>(id: string): T;
    static selectedClassName: string;
    get isSelected(): boolean;
    set isSelected(value: boolean);
    constructor();
    toggleSelection(): void;
    updateImage(source: string): void;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
}

export { CaptionedThumbnailElement };
