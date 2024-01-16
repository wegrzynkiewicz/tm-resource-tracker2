type DOMElement = Element

declare namespace JSX {
  export interface Element extends DOMElement { }
  export interface IntrinsicElements {
    [e: string]: unknown;
  }
}
