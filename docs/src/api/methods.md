# Methods

## window.$hubble.all

Gets all elements with hubble selectors.

`window.$hubble.all(): HTMLElement[]`

## window.$hubble.allMapped

Gets all elements with hubble selectors, mapped by selector.

`window.$hubble.allMapped(): { [string]: HTMLElement }`

## window.$hubble.find

Finds all elements with hubble selectors matching the passed selector.

`window.$hubble.find(selector: string): HTMLElement[]]`

## window.$hubble.findMapped

Finds all elements with hubble selectors matching the passed selector, mapped by selector.

`window.$hubble.findMapped(selector: string): { [string]: HTMLElement }`

## window.$hubble.first

Finds the first element with hubble selectors matching the passed selector.

`window.$hubble.first(selector: string): HTMLElement | undefined`
