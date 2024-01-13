/// <reference types="vite/client" />

import 'tsx-dom';

declare module "tsx-dom" {
    export interface TsxConfig {
        // Set one of these to false to disable support for them
        svg: false;
        // html: false;
    }
}
