import type { Context, TypedResponse, Next } from 'hono';
import { TranslatorFn } from '@/dictionaries';
import { IDAF } from '@/services/database';

declare global {
  type DomainContext = Context<{ Bindings: Bindings; Variables: Variables }>;
  type ControllerFn = (c: DomainContext) => Promise<TypedResponse>;
  type MiddlewareFn = (
    c: DomainContext,
    next: Next,
  ) => Promise<void | Response>;

  type Variables = {
    dictionary: TranslatorFn;
    daf: IDAF;
    user: {
      id: string;
      email: string;
      role: string;
    };
    timezone: string;
    timezoneOffset: string;
    inputs: any;
  };

  type Env = {
    ENVIRONMENT: 'development' | 'production';
    ENCRYPTION_SECRET: string;
    SIGNING_SECRET: string;

    // Logging
    ENABLE_PERFORMANCE_LOG: boolean;
    ENABLE_ERROR_LOG: boolean;

    // API URLs
    BASE_API_URL: string;
    ERROR_LOGGER_API_URL: string;

    // Site URLs
    PANEL_BASE_URL: string;
    SITE_BASE_URL: string;
  };

  type Bindings = Env & {
    DB: D1Database;
  };
}
