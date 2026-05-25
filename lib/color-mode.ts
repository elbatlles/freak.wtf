// Dark mode removed. useColorModeValue always returns the light value.
export function useColorModeValue<T>(light: T, _dark: T): T {
  return light
}
