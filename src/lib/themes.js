export const DEFAULT_THEME = 'forest';

export const THEMES = {
  forest: {
    label: 'Forest Green',
    note: 'The national default.',
    swatch: '#C2FF85',
    vars: {
      '--background': '156 20% 5%',
      '--card': '147 18% 10%',
      '--popover': '147 18% 9%',
      '--primary': '90 100% 76%',
      '--primary-foreground': '156 33% 6%',
      '--secondary': '147 18% 14%',
      '--muted': '147 18% 14%',
      '--muted-foreground': '123 13% 68%',
      '--accent': '147 18% 18%',
      '--border': '147 14% 19%',
      '--input': '147 14% 22%',
      '--ring': '90 100% 76%',
      '--sidebar-background': '156 22% 7%',
      '--sidebar-accent': '147 18% 14%',
    },
  },
  ocean: {
    label: 'Ocean Blue',
    note: 'Cold northern waters.',
    swatch: '#8FDCEA',
    vars: {
      '--background': '205 40% 6%',
      '--card': '205 32% 12%',
      '--popover': '205 32% 11%',
      '--primary': '188 85% 70%',
      '--primary-foreground': '205 45% 6%',
      '--secondary': '205 26% 16%',
      '--muted': '205 26% 16%',
      '--muted-foreground': '200 16% 70%',
      '--accent': '205 24% 20%',
      '--border': '205 20% 24%',
      '--input': '205 20% 26%',
      '--ring': '188 85% 70%',
      '--sidebar-background': '205 38% 8%',
      '--sidebar-accent': '205 26% 16%',
    },
  },
  sunset: {
    label: 'Sunset',
    note: 'Long evenings over the lake.',
    swatch: '#FFC178',
    vars: {
      '--background': '20 32% 7%',
      '--card': '20 24% 13%',
      '--popover': '20 24% 12%',
      '--primary': '36 100% 70%',
      '--primary-foreground': '20 40% 7%',
      '--secondary': '20 20% 17%',
      '--muted': '20 20% 17%',
      '--muted-foreground': '30 18% 72%',
      '--accent': '20 20% 21%',
      '--border': '20 16% 26%',
      '--input': '20 16% 28%',
      '--ring': '36 100% 70%',
      '--sidebar-background': '20 30% 9%',
      '--sidebar-accent': '20 20% 17%',
    },
  },
  royal: {
    label: 'Royal Purple',
    note: 'For state occasions only.',
    swatch: '#D6B5FF',
    vars: {
      '--background': '265 32% 7%',
      '--card': '265 24% 14%',
      '--popover': '265 24% 13%',
      '--primary': '265 90% 80%',
      '--primary-foreground': '265 40% 8%',
      '--secondary': '265 20% 18%',
      '--muted': '265 20% 18%',
      '--muted-foreground': '265 15% 74%',
      '--accent': '265 20% 22%',
      '--border': '265 16% 26%',
      '--input': '265 16% 28%',
      '--ring': '265 90% 80%',
      '--sidebar-background': '265 30% 9%',
      '--sidebar-accent': '265 20% 18%',
    },
  },
};

export function applyTheme(name) {
  const theme = THEMES[name] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}