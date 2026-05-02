'use client'
import { useTheme } from 'next-themes'

/**
 * Compatibility shim for Chakra UI v2's useColorModeValue.
 * Reads the resolved theme from next-themes (which Chakra v3 uses).
 * Returns `light` on SSR (resolvedTheme is undefined) and the correct
 * value on the client after hydration.
 */
export function useColorModeValue<T>(light: T, dark: T): T {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? dark : light
}

/**
 * Compatibility shim for Chakra UI v2's useColorMode.
 */
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  return {
    colorMode: resolvedTheme ?? 'dark',
    toggleColorMode: () =>
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
}
