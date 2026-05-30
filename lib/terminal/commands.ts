export const COMMANDS = [
  'ask',
  'invoke',
  'whoami',
  'skills',
  'experience',
  'contact',
  'secret',
  'clear',
  'help'
] as const

export const ROOT_COMMANDS = {
  en: {
    help: [
      '  [angel@freak] — elevated access.',
      '  Extra commands:',
      '  status → active projects & WIP',
      '  env → dev environment & setup',
      '  cv → resume / curriculum',
      '  invoke → open chat mode',
      '  exit → back to guest mode',
      '',
      '  All guest commands still work.'
    ],
    status: [
      '  ── Active projects ──────────────────────────────',
      '  ai-dev-flow     Multi-agent AI system for software development workflows.',
      '                  Orchestrator coordinates specialized agents (reviewer,',
      '                  critic) to automate code review, validation & iteration.',
      '                  Vision-capable with token management.',
      '',
      '  beefy-guardian  Automated DeFi portfolio manager for Beefy Finance.',
      '                  Monitors vault APYs, auto-compounds rewards and',
      '                  rebalances positions using a LAZY HIGH yield strategy.',
      '  ─────────────────────────────────────────────────'
    ],
    env: [
      '  ── Dev Environment ──────────────────────────────',
      '  OS:       NixOS (declarative, reproducible)',
      '  Editor:   VS Code + Copilot',
      '  Shell:    Zsh + Nix flakes',
      '  WM:       Hyprland',
      '  Lang:     TypeScript, Nix',
      '  Config:   github.com/elbatlles/nixos-config',
      '  ─────────────────────────────────────────────────'
    ],
    cv: [
      '  ── Curriculum Vitae ─────────────────────────────',
      '  Angel Batlles — Software Engineer',
      '  Barcelona · angelbatlles@gmail.com',
      '',
      '  2022–now   Travelport — Software Development Engineer',
      '             JS, TypeScript, React, Node.js, C#, Bash',
      '  2021–2022  Freelance — Full Stack Developer',
      '             React, Next.js, TailwindCSS, Node.js, Strapi',
      '  2020–2021  Kumux — Frontend Developer',
      '             React, Gatsby.js, Styled Components',
      '  2012–2020  Grafix Gestió Informàtica — Web Developer',
      '             PHP, JavaScript, WordPress, PrestaShop, jQuery',
      '',
      '  Education:',
      '  2009–2013  DAI – IES Carles Vallbona, Granollers',
      '  2006–2008  ESI – IES Carles Vallbona, Granollers',
      '',
      '  Full CV → overleaf.com/read/jsnwfqpjpwtg#c8b1ed',
      '  ─────────────────────────────────────────────────'
    ]
  },
  es: {
    help: [
      '  [angel@freak] — acceso elevado.',
      '  Comandos extra:',
      '  status → proyectos activos y WIP',
      '  env → entorno de desarrollo',
      '  cv → curriculum vitae',
      '  invoke → abrir modo chat',
      '  exit → volver a modo guest',
      '',
      '  Los comandos de guest siguen activos.'
    ],
    status: [
      '  ── Proyectos activos ────────────────────────────',
      '  ai-dev-flow     Sistema multi-agente de IA para workflows de desarrollo.',
      '                  Un orquestador coordina agentes especializados (revisor,',
      '                  crítico) para automatizar revisión, validación e iteración.',
      '                  Con capacidad de visión y gestión de tokens.',
      '',
      '  beefy-guardian  Gestor automático de portfolio DeFi en Beefy Finance.',
      '                  Monitoriza APYs de vaults, auto-compone recompensas y',
      '                  rebalancea posiciones con estrategia LAZY HIGH.',
      '  ─────────────────────────────────────────────────'
    ],
    env: [
      '  ── Entorno de desarrollo ────────────────────────',
      '  OS:       NixOS (declarativo, reproducible)',
      '  Editor:   VS Code + Copilot',
      '  Shell:    Zsh + Nix flakes',
      '  WM:       Hyprland',
      '  Lang:     TypeScript, Nix',
      '  Config:   github.com/elbatlles/nixos-config',
      '  ─────────────────────────────────────────────────'
    ],
    cv: [
      '  ── Curriculum Vitae ─────────────────────────────',
      '  Angel Batlles — Software Engineer',
      '  Barcelona · angelbatlles@gmail.com',
      '',
      '  2022–hoy   Travelport — Software Development Engineer',
      '             JS, TypeScript, React, Node.js, C#, Bash',
      '  2021–2022  Freelance — Full Stack Developer',
      '             React, Next.js, TailwindCSS, Node.js, Strapi',
      '  2020–2021  Kumux — Frontend Developer',
      '             React, Gatsby.js, Styled Components',
      '  2012–2020  Grafix Gestió Informàtica — Web Developer',
      '             PHP, JavaScript, WordPress, PrestaShop, jQuery',
      '',
      '  Formación:',
      '  2009–2013  DAI – IES Carles Vallbona, Granollers',
      '  2006–2008  ESI – IES Carles Vallbona, Granollers',
      '',
      '  CV completo → overleaf.com/read/jsnwfqpjpwtg#c8b1ed',
      '  ─────────────────────────────────────────────────'
    ]
  }
}

export type RootCommandKey = keyof typeof ROOT_COMMANDS.en
