---
title: 'Comenzando con TypeScript en 2024'
date: '2024-12-01'
excerpt: 'Aprende cómo configurar y usar TypeScript en proyectos de desarrollo web modernos con ejemplos prácticos y mejores prácticas.'
category: 'typescript'
tags: ['typescript', 'javascript', 'desarrollo', 'tutorial']
author: 'Angel Batlles'
---

# Comenzando con TypeScript en 2024

TypeScript se ha convertido en el estándar de facto para el desarrollo JavaScript en 2024. Aquí tienes todo lo que necesitas saber para empezar.

## ¿Por qué TypeScript?

TypeScript ofrece varias ventajas sobre JavaScript puro:

- **Seguridad de tipos**: Detecta errores en tiempo de compilación
- **Mejor soporte IDE**: Autocompletado mejorado y refactorización
- **Código autodocumentado**: Los tipos sirven como documentación
- **Refactorización más fácil**: Cambios de código con confianza

## Configurando TypeScript

Primero, instala TypeScript globalmente:

```bash
npm install -g typescript
```

Crea un nuevo proyecto:

```bash
mkdir my-typescript-project
cd my-typescript-project
npm init -y
tsc --init
```

## Tipos Básicos

Aquí están los tipos fundamentales de TypeScript:

```typescript
// Tipos primitivos
let nombre: string = 'Angel'
let edad: number = 30
let activo: boolean = true

// Arrays
let numeros: number[] = [1, 2, 3]
let nombres: Array<string> = ['Angel', 'Maria']

// Objetos
interface Usuario {
  id: number
  nombre: string
  email?: string // Propiedad opcional
}

const usuario: Usuario = {
  id: 1,
  nombre: 'Angel Batlles'
}
```

## Funciones

TypeScript hace las funciones mucho más predecibles:

```typescript
function saludar(nombre: string): string {
  return `¡Hola, ${nombre}!`
}

// Funciones flecha
const sumar = (a: number, b: number): number => a + b

// Parámetros opcionales
function construirMensaje(nombre: string, edad?: number): string {
  if (edad) {
    return `${nombre} tiene ${edad} años`
  }
  return `Hola, ${nombre}`
}
```

## Interfaces vs Types

Ambos sirven propósitos similares pero tienen diferencias sutiles:

```typescript
// Interface
interface RespuestaApi {
  datos: any[]
  estado: number
  mensaje: string
}

// Type alias
type Estado = 'cargando' | 'éxito' | 'error'

type UsuarioConEstado = Usuario & {
  estado: Estado
}
```

## Tipos Genéricos

Los genéricos te permiten escribir código reutilizable:

```typescript
function identidad<T>(arg: T): T {
  return arg
}

// Uso
const resultadoString = identidad<string>('hola')
const resultadoNumero = identidad<number>(42)

// Interfaces genéricas
interface Repositorio<T> {
  crear(item: T): Promise<T>
  buscarPorId(id: string): Promise<T | null>
  actualizar(id: string, actualizaciones: Partial<T>): Promise<T>
  eliminar(id: string): Promise<void>
}
```

## Mejores Prácticas

1. **Usa modo estricto**: Habilita verificaciones estrictas en `tsconfig.json`
2. **Evita `any`**: Usa tipos específicos o `unknown` en su lugar
3. **Aprovecha la inferencia de tipos**: No sobre-anotes
4. **Usa tipos utilitarios**: `Partial<T>`, `Required<T>`, `Pick<T, K>`

## Conclusión

TypeScript es una inversión en calidad de código y experiencia del desarrollador. Empieza pequeño, añade tipos gradualmente y disfruta de los beneficios de código más seguro y mantenible.

¡Feliz programación! 🚀
