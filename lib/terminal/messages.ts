export const TERMINAL_DICT = {
  en: {
    banner: 'angel@freak.wtf',
    boot: [] as string[],
    help: [
      '  Available commands:',
      '  ask <question> → about my work',
      '  whoami → who is Angel',
      '  skills → tech stack',
      '  experience → work history',
      '  contact → how to reach me',
      '  secret → 👀',
      '  clear → clear terminal',
      '  help → show this help'
    ],
    static: {
      whoami: [
        '  Angel Batlles — software engineer, Barcelona.',
        '  10+ years building products: from startup MVPs to platform SDKs at Travelport.',
        '  I care about clarity, velocity, and software that actually holds up under pressure.',
        '  Currently exploring AI-assisted interfaces and memory-driven UX.'
      ],
      skills: [
        '  Languages:   TypeScript, JavaScript, Python',
        '  Frontend:    React, Next.js, Chakra UI, Three.js',
        '  Backend:     Node.js, REST, GraphQL',
        '  Tooling:     Git, Docker, CI/CD, Turbopack',
        '  AI/ML:       OpenAI API, prompt engineering, RAG patterns'
      ],
      experience: [
        '  2022–now   Travelport — Senior Frontend Engineer',
        '             SDK, plugin workflows, platform-scale UI',
        '  2021       Freelance — Startup MVPs and product consulting',
        '  2020–2021  Kumux — Frontend & data visualization',
        '  2012–2020  Grafix — WordPress, Prestashop, full-stack & marketing'
      ],
      contact: [
        '  GitHub    → github.com/elbatlles',
        '  LinkedIn  → linkedin.com/in/abatlles',
        '  X         → x.com/elbatlles',
        "  Or just use ask — I'm right here."
      ],
      secret: [
        '  You found it.',
        '  No magic prize, just proof you read the help.',
        '  That already puts you in the top 5%.',
        '',
        '  Hint: `su` — switch to superuser. Try it.'
      ]
    },
    placeholders: {
      input: 'type a command...',
      ask: 'Usage: ask <question>',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `command not found: ${cmd}. Did you mean "${suggestion}"?`
          : `command not found: ${cmd}. Try "help".`,
      recovering: 'thinking...',
      timeout: 'Could not reach memory right now. Try again.',
      limited: 'low confidence match — try rephrasing.'
    },
    examples: [
      'ask who is Angel?',
      'whoami',
      'ask what does he work on?',
      'experience',
      'skills',
      'ask what are his side projects?',
      'contact'
    ]
  },
  es: {
    banner: 'angel@freak.wtf',
    boot: [] as string[],
    help: [
      '  Comandos disponibles:',
      '  ask <pregunta> → sobre mí',
      '  whoami → quién es Angel',
      '  skills → stack tecnológico',
      '  experience → historial',
      '  contact → contactarme',
      '  secret → 👀',
      '  clear → limpiar terminal',
      '  help → mostrar ayuda'
    ],
    static: {
      whoami: [
        '  Angel Batlles — software engineer, Barcelona.',
        '  +10 años construyendo productos: desde MVPs de startup hasta SDKs a escala en Travelport.',
        '  Me importan la claridad, la velocidad y el software que aguanta bajo presión.',
        '  Ahora explorando interfaces con IA y UX basada en memoria.'
      ],
      skills: [
        '  Lenguajes:   TypeScript, JavaScript, Python',
        '  Frontend:    React, Next.js, Chakra UI, Three.js',
        '  Backend:     Node.js, REST, GraphQL',
        '  Tooling:     Git, Docker, CI/CD, Turbopack',
        '  IA/ML:       OpenAI API, prompt engineering, patrones RAG'
      ],
      experience: [
        '  2022–hoy   Travelport — Senior Frontend Engineer',
        '             SDK, plugin workflows, UI a escala de plataforma',
        '  2021       Freelance — MVPs de startup y consultoría de producto',
        '  2020–2021  Kumux — Frontend y visualización de datos',
        '  2012–2020  Grafix — WordPress, Prestashop, full-stack y marketing'
      ],
      contact: [
        '  GitHub    → github.com/elbatlles',
        '  LinkedIn  → linkedin.com/in/abatlles',
        '  X         → x.com/elbatlles',
        '  O usa ask — estoy aquí.'
      ],
      secret: [
        '  Lo encontraste.',
        '  No hay premio, solo prueba de que lees el help.',
        '  Eso ya te pone en el top 5%.',
        '',
        '  Pista: `su` — superusuario. Pruébalo.'
      ]
    },
    placeholders: {
      input: 'escribe un comando...',
      ask: 'Uso: ask <pregunta>',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `comando no encontrado: ${cmd}. ¿Quizás "${suggestion}"?`
          : `comando no encontrado: ${cmd}. Prueba "help".`,
      recovering: 'pensando...',
      timeout: 'No pude responder ahora mismo. Inténtalo de nuevo.',
      limited: 'respuesta con baja confianza — intenta reformular.'
    },
    examples: [
      'ask ¿quién es Angel?',
      'whoami',
      'ask ¿en qué trabaja?',
      'experience',
      'skills',
      'ask ¿cuáles son sus proyectos?',
      'contact'
    ]
  }
}

export type TerminalLang = keyof typeof TERMINAL_DICT
