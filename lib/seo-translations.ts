export const seoTranslations = {
  en: {
    home: {
      title: 'Angel Batlles - Full Stack Developer',
      description: 'Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog with insights about software development.'
    },
    works: {
      title: 'Portfolio - Angel Batlles',
      description: 'Explore my portfolio of web development projects, including React apps, Next.js websites, and full-stack solutions.'
    },
    blog: {
      title: 'Blog - Angel Batlles',
      description: 'Articles and tutorials about web development, React, TypeScript, Next.js, and modern software engineering practices.'
    },
    timeline: {
      title: 'Timeline - Angel Batlles',
      description: 'My professional and personal journey as a software developer. Key milestones, achievements, and experiences.'
    },
    posts: {
      title: 'Posts - Angel Batlles',
      description: 'Latest articles and technical posts about web development and software engineering.'
    }
  },
  es: {
    home: {
      title: 'Angel Batlles - Desarrollador Full Stack',
      description: 'Desarrollador full-stack especializado en React, Node.js y tecnologías web modernas. Explora mi portafolio, línea de tiempo y blog con contenido sobre desarrollo de software.'
    },
    works: {
      title: 'Portafolio - Angel Batlles',
      description: 'Explora mi portafolio de proyectos de desarrollo web, incluyendo aplicaciones React, sitios Next.js y soluciones full-stack.'
    },
    blog: {
      title: 'Blog - Angel Batlles',
      description: 'Artículos y tutoriales sobre desarrollo web, React, TypeScript, Next.js y prácticas modernas de ingeniería de software.'
    },
    timeline: {
      title: 'Línea de Tiempo - Angel Batlles',
      description: 'Mi trayectoria profesional y personal como desarrollador de software. Hitos clave, logros y experiencias.'
    },
    posts: {
      title: 'Publicaciones - Angel Batlles',
      description: 'Últimos artículos y posts técnicos sobre desarrollo web e ingeniería de software.'
    }
  }
}

export const getSeoData = (page: keyof typeof seoTranslations.en, locale: string = 'es') => {
  const lang = locale === 'es' ? 'es' : 'en'
  return seoTranslations[lang][page] || seoTranslations[lang].home
}
