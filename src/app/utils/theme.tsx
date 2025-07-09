export function toggleTheme(isDarkMode: boolean): void {
  if (typeof window === 'undefined') return;

  const htmlElement = document.documentElement;
  if (isDarkMode) {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

export function applySavedTheme(): void {
  if (typeof window === 'undefined') return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}