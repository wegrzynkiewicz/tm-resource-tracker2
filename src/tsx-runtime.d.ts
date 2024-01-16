declare namespace JSX {
  export interface Element extends HTMLElement { }
  export interface IntrinsicElements {
    [e: string]: unknown;
  }
}
