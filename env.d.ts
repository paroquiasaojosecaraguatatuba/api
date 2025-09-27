import type { Context, TypedResponse } from "hono";

declare global {
  type DomainContext = Context<{ Bindings: Bindings; Variables: Variables }>;
  type ControllerFunction = (c: DomainContext) => Promise<TypedResponse>;

  type Variables = {
    // dbClient: PoolClient;
    dbClient: any;
  };

  type Env = {
    ENVIRONMENT: "development" | "production";

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
    /** Service Bindings */
    DB: D1Database;

    /** External Services */

    /** Configurations */
    payload: {
      timezoneOffset: string;
    };

    /** Request Body Parsed */
    data: any;
  };
}