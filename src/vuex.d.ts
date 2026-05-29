// Vuex 4 ships type declarations but its package.json "exports" map omits a
// "types" condition, so TypeScript's "bundler"/"node16" resolution can't find
// them for the bare "vuex" specifier. Re-export the bundled declarations.
declare module "vuex" {
  export * from "vuex/types/index.js";
  export { default } from "vuex/types/index.js";
}
