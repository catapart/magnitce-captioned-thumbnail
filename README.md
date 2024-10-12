# magnitce-captioned-thumbnail
A custom `HTMLElement` that displays an image or icon with a caption and interactive components.

Package size: ~6kb minified, ~8kb verbose.

## Quick Reference
```html
<script type="module" src="/path/to/captioned-thumbnail[.min].js"></script>
```

## Demos
https://catapart.github.io/magnitce-captioned-thumbnail/demo/

## Support
- Firefox
- Chrome
- Edge
- <s>Safari</s> (Has not been tested; should be supported, based on custom element support)

## Getting Started
 1. [Install/Reference the library](#referenceinstall)

### Reference/Install
#### HTML Import (not required for vanilla js/ts; alternative to import statement)
```html
<script type="module" src="/path/to/captioned-thumbnail[.min].js"></script>
```
#### npm
```cmd
npm install @magnit-ce/captioned-thumbnail
```

### Import
#### Vanilla js/ts
```js
import "/path/to/captioned-thumbnail[.min].js"; // if you didn't reference from a <script>, reference with an import like this

import { CaptionedThumbnailElement } from "/path/to/captioned-thumbnail[.min].js";
```
#### npm
```js
import "@magnit-ce/captioned-thumbnail"; // if you didn't reference from a <script>, reference with an import like this

import { CaptionedThumbnailElement } from "@magnit-ce/captioned-thumbnail";
```

---
---
---

## Overview
The `<captioned-thumbnail>` element is an element that shows a small image ("thumbnail") with centered caption text below it.

It can also include the ability for selection, by clicking on the element, or editing by clicking on an "edit" button that the `<captioned-thumbnail>` element includes.

The `<captioned-thumbnail>` element does not have any dependencies and can be used arbitrarily, but it was developed with the intention of mimicing OS-native file-browser apps and the common layout of their "file" display. It should function, both in selection and appearance, similarly to those inspirations.

Selection can be done either by pointer events (clicking, tapping, etc), or by key events (tab/shift+tab).

## Attributes
|Attribute Name|Description|
|-|-|
|`label`|Sets the caption.|
|`src`|Sets the thumbnail content to an `<img>` element, and sets that element's `src` attribute to the provided value.|
|`select`|If present, allows the `<captioned-thumbnail>` element to be selectable. If not present, prevents the element from being selectable. [*Alias: `selectable`*]|

## Events
The `<captioned-thumbnail>` element dispatches a `change` event whenever it becomes selected or unselected, if the element has a `select` attribute. If the element has an `edit` attribute, it will dispatch an `edit` event whenever the internal edit `<button>` is clicked.

## Parts
|Part Name|Description|
|-|-|
|`figure`|An `HTMLFigureElement` that wraps the content of the element.|
|`selected`|An `HTMLInputElement` that wraps the indicates whether the element has been selected or not. If selected, this element will be checked, otherwise, it will be unchecked.|
|`edit-button`|An `HTMLButtonElement` that allows users to dispatch an `edit` event.|
|`icon`|An `HTMLSpanElement` that displays the element's thumbnail.|
|`label`|An `HTMLFigcaptionElement` that displays the element's caption.|

## Slots
The `<captioned-thumbnail>` element exposes the following `slot`s: 
|Slot Name|Description|Default
|-|-|-|
|`selected`|An element that indicates whether or not the item has been "selected".|`HTMLInputElement[type="checkbox"]`|
|`edit-button`|A clickable element that dispatches an `edit` event.|`HTMLButtonElement`|
|`icon`|The element that displays the item's icon.|`HTMLSpanElement`|
|`label`|The container element for the item's caption.|`HTMLFigcaptionElement`|
|[Default]|Slot that holds the caption text for the item. The slot is inside of a `<figcaption>` element. (*note: this slot has no name; all children of the `<captioned-thumbnail>` element that do not have a `slot` attribute will be placed in this default slot.*)|Text: `Item`|

## Styling
The `<captioned-thumbnail>` element can be styled with CSS, normally. The `<captioned-thumbnail>` element also utilizes the shadowDOM for layout, so styling the internal layout elements must be done using a `::part()` selector.

In this example, the `figure` part is being selected for styling:
```css
captioned-thumbnail::part(figure)
{
    /* styling */
}
```

For a list of all part names, see the [parts](#parts) section.

## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.