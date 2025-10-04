---
title: "Getting Started with TypeScript in 2024"
date: "2024-12-01"
excerpt: "Learn how to set up and use TypeScript in modern web development projects with practical examples and best practices."
category: "typescript"
tags: ["typescript", "javascript", "development", "tutorial"]
author: "Angel Batlles"
---

# Getting Started with TypeScript in 2024

TypeScript has become the de facto standard for JavaScript development in 2024. Here's everything you need to know to get started.

## Why TypeScript?

TypeScript offers several advantages over plain JavaScript:

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Confident code changes

## Setting Up TypeScript

First, install TypeScript globally:

```bash
npm install -g typescript
```

Create a new project:

```bash
mkdir my-typescript-project
cd my-typescript-project
npm init -y
tsc --init
```

## Basic Types

Here are the fundamental TypeScript types:

```typescript
// Primitive types
let name: string = "Angel"
let age: number = 30
let isActive: boolean = true

// Arrays
let numbers: number[] = [1, 2, 3]
let names: Array<string> = ["Angel", "Maria"]

// Objects
interface User {
  id: number
  name: string
  email?: string // Optional property
}

const user: User = {
  id: 1,
  name: "Angel Batlles"
}
```

## Functions

TypeScript makes functions much more predictable:

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`
}

// Arrow functions
const add = (a: number, b: number): number => a + b

// Optional parameters
function buildMessage(name: string, age?: number): string {
  if (age) {
    return `${name} is ${age} years old`
  }
  return `Hello, ${name}`
}
```

## Interfaces vs Types

Both serve similar purposes but have subtle differences:

```typescript
// Interface
interface ApiResponse {
  data: any[]
  status: number
  message: string
}

// Type alias
type Status = "loading" | "success" | "error"

type UserWithStatus = User & {
  status: Status
}
```

## Generic Types

Generics allow you to write reusable code:

```typescript
function identity<T>(arg: T): T {
  return arg
}

// Usage
const stringResult = identity<string>("hello")
const numberResult = identity<number>(42)

// Generic interfaces
interface Repository<T> {
  create(item: T): Promise<T>
  findById(id: string): Promise<T | null>
  update(id: string, updates: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}
```

## Best Practices

1. **Use strict mode**: Enable strict checks in `tsconfig.json`
2. **Avoid `any`**: Use specific types or `unknown` instead
3. **Leverage type inference**: Don't over-annotate
4. **Use utility types**: `Partial<T>`, `Required<T>`, `Pick<T, K>`

## Conclusion

TypeScript is an investment in code quality and developer experience. Start small, add types gradually, and enjoy the benefits of safer, more maintainable code.

Happy coding! 🚀