'use client'
import { useTheme } from 'next-themes'

/**
 * Compatibility shim for Chakra UI v2's useColorModeValue.
 * Reads the resolved theme from next-themes (which Chakra v3 uses).
 *
 * Defaults to `dark` when resolvedTheme is undefined (SSR / first render)
 * because defaultTheme="dark". This avoids a hydration mismatch with React 19
 * which refuses to patch className differences between server and client.
 * Light-mode users will see a brief re-render after mount — acceptable trade-off.
 */
export function useColorModeValue<T>(light: T, dark: T): T {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'light' ? light : dark
}

/**
 * Compatibility shim for Chakra UI v2's useColorMode.
 */
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  return {
    colorMode: resolvedTheme ?? 'dark',
    toggleColorMode: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
}
