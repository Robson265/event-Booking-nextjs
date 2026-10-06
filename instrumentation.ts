import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfigurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
  );
}

export const posthogLogProvider = (() => {
  if (!projectToken || !host) {
    if (process.env.NODE_ENV === "development") {
      throw missingConfigurationError(
        projectToken
          ? "NEXT_PUBLIC_POSTHOG_HOST"
          : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
      );
    }

    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "event-booking",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  });
})();

export function register() {
  // The dedicated provider is used directly by posthog-logger so application loggers remain local.
}
