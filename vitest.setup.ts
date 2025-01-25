/// <reference types="node" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Mock TextEncoder and TextDecoder for Node environment
class NodeTextEncoder implements TextEncoder {
  encoding = 'utf-8';
  encode(input?: string): Uint8Array {
    return new Uint8Array(Buffer.from(input || ''));
  }
  encodeInto(
    source: string,
    destination: Uint8Array
  ): TextEncoderEncodeIntoResult {
    const encoded = this.encode(source);
    destination.set(encoded);
    return {
      read: source.length,
      written: encoded.length,
    };
  }
}

class NodeTextDecoder implements TextDecoder {
  encoding = 'utf-8';
  fatal = false;
  ignoreBOM = false;
  decode(input?: BufferSource | undefined): string {
    if (!input) return '';
    return Buffer.from(input as Uint8Array).toString();
  }
}

globalThis.TextEncoder = NodeTextEncoder as unknown as typeof TextEncoder;
globalThis.TextDecoder = NodeTextDecoder as unknown as typeof TextDecoder;

let container: Awaited<ReturnType<typeof AstroContainer.create>> | null = null;

beforeEach(async () => {
  container = await AstroContainer.create();
});

afterEach(() => {
  container = null;
});

// runs a cleanup after each test case
afterEach(() => {
  cleanup();
});
