export function applyTheme(theme?: { accent?: string }) {
  if (theme?.accent) document.documentElement.style.setProperty('--hedge-accent', theme.accent)
}
