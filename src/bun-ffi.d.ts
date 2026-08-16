/**
 * Minimal ambient types for `bun:ffi`, used only by the Windows focus fallback.
 * Bun provides the real module at runtime; this shim exists so `tsc --noEmit`
 * passes without pulling in full bun-types.
 */
declare module "bun:ffi" {
  export function ptr(value: ArrayBufferView): number;
  export function dlopen(library: string, symbols: Record<string, unknown>): {
    symbols: Record<string, (...args: unknown[]) => any>;
  };
}
