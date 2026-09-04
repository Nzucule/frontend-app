/*
 * Gera uma imagem de substituição (SVG) para artigos
 * sem fotografia carregada, usando as iniciais do nome.
 */
export function createProductPlaceholder(name = 'Artigo') {
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('') || 'A';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#0B4F6C" />
      <text x="50%" y="50%" fill="#FFD93D" font-family="Arial, sans-serif"
        font-size="120" font-weight="700" text-anchor="middle" dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
