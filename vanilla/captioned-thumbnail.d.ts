declare class CaptionedThumbnailElement extends HTMLElement {
    componentParts: Map<string, HTMLElement>;
    getPart<T extends HTMLElement = HTMLElement>(key: string): T;
    findPart<T extends HTMLElement = HTMLElement>(key: string): T;
    static selectedClassName: string;
    get isSelected(): boolean;
    set isSelected(value: boolean);
    editButton?: WeakKey;
    constructor();
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
    updateImage(source: string): void;
}

export { CaptionedThumbnailElement };
