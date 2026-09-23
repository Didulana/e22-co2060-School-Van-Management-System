export type AppTheme = "light" | "night";
export type DashboardDensity = "comfortable" | "compact";
export type RefreshInterval = "30" | "60" | "120";

export interface AppSettings {
  theme: AppTheme;
  dashboardDensity: DashboardDensity;
  refreshInterval: RefreshInterval;
  showEmailInProfile: boolean;
  tripNotifications: boolean;
  announcementNotifications: boolean;
}

export const APP_SETTINGS_KEY = "school-van-app-settings";
export const APP_SETTINGS_EVENT = "school-van-settings-changed";

export const defaultAppSettings: AppSettings = {
  theme: "light",
  dashboardDensity: "comfortable",
  refreshInterval: "60",
  showEmailInProfile: true,
  tripNotifications: true,
  announcementNotifications: true,
};

export function readAppSettings(): AppSettings {
  const stored = window.localStorage.getItem(APP_SETTINGS_KEY);

  if (!stored) {
    return defaultAppSettings;
  }

  try {
    return {
      ...defaultAppSettings,
      ...(JSON.parse(stored) as Partial<AppSettings>),
    };
  } catch {
    window.localStorage.removeItem(APP_SETTINGS_KEY);
    return defaultAppSettings;
  }
}

export function applyAppSettings(settings: AppSettings) {
  document.documentElement.dataset.appTheme = settings.theme;
  document.documentElement.dataset.dashboardDensity = settings.dashboardDensity;
}

export function saveAppSettings(settings: AppSettings) {
  window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  applyAppSettings(settings);
  window.dispatchEvent(new CustomEvent(APP_SETTINGS_EVENT, { detail: settings }));
}
