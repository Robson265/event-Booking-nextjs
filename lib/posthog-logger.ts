import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogLogProvider } from "@/instrumentation";

const posthogLogger = posthogLogProvider?.getLogger("posthog-event-booking");

export function logFeaturedEventsRendered(eventCount: number) {
  posthogLogger?.emit({
    body: "Featured events rendered",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      component: "featured_events",
      event_count: eventCount,
    },
  });
}

export async function flushPostHogLogs() {
  await posthogLogProvider?.forceFlush();
}
