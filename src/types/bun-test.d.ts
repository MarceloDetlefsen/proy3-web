declare module "bun:test" {
  export type TestFn = () => void | Promise<void>

  export type Matcher = {
    toBe(expected: unknown): void
    toEqual(expected: unknown): void
    toContain(expected: string): void
    toMatch(expected: RegExp): void
    toBeGreaterThan(expected: number): void
    toBeGreaterThanOrEqual(expected: number): void
    not: {
      toThrow(): void
    }
  }

  export function describe(name: string, fn: TestFn): void
  export function it(name: string, fn: TestFn): void
  export function expect<T>(value: T): Matcher
}
