export const LOCALES = ["en", "ja", "vi"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_COOKIE_NAME = "locale";
