export interface PageNavigationConfig {
  validPages: string[];
  defaultPage?: string;
  replaceHistory?: boolean;
}

export interface NavigationHookReturn {
  currentPage: string | null;
  isInitialized: boolean;
}

export type ValidPageType = 'about' | 'profile' | 'settings' | 'home';

export interface RouteConfig {
  path: string;
  name: string;
  component: React.ComponentType;
  requiresAuth?: boolean;
  isPublic?: boolean;
}

export interface NavigationItem {
  path: string;
  label: string;
  requiresAuth?: boolean;
  icon?: string;
}