export interface WorkItem {
  title: string;
  summary: string;
  stack: string[];
  category?: string;
  href?: string;
  year: string;
}

/**
 * Selected projects shown on the home page. Add entries here — the layout
 * adapts to any number of items.
 */
export const work: WorkItem[] = [
  {
    title: 'Flink event-time aggregation pipeline',
    summary:
      'A Kafka-to-Kafka streaming job doing 10s tumbling event-time windows with bounded out-of-orderness watermarks, checkpointing, and a side-output dead letter queue for late and malformed records. Fully containerised so it runs with one command.',
    stack: ['Apache Flink', 'Kafka', 'Java', 'Docker Compose'],
    category: 'streaming',
    year: '2026',
  },
];

export interface Capability {
  area: string;
  detail: string;
  tools: string[];
}

/**
 * What "always eager to learn" actually means right now — grounded in real
 * areas covered by the capabilities above and the DSA/interview-prep posts,
 * not a generic platitude. Shown by `GrowingWords`.
 */
export const currentlyLearning = [
  'data foundations for AI',
  'retrieval-augmented generation',
  'AI agents & workflow automation',
  'evaluation, reliability & cost',
  'real-time data for intelligent applications',
  'emerging tools & industry use cases',
];

export const capabilities: Capability[] = [
  {
    area: 'Streaming',
    detail:
      'Event-time semantics, watermarking, windowing and state management — stay correct when data arrives late, out of order, or twice.',
    tools: ['Apache Beam', 'Apache Flink', 'Dataflow', 'Pub/Sub', 'Kafka'],
  },
  {
    area: 'Batch & warehousing',
    detail:
      'Partitioned, clustered models in BigQuery with an eye on query cost, plus the orchestration that keeps them fresh and reliably backfillable.',
    tools: ['BigQuery', 'Airflow', 'dbt-style modelling', 'SQL'],
  },
  {
    area: 'Reliability',
    detail:
      'Checkpointing, replay, idempotent sinks and dead letter queues — plus the alerting that makes a 3am page actionable instead of terrifying.',
    tools: ['Checkpoints', 'DLQs', 'Replay', 'Observability'],
  },
  {
    area: 'Platform',
    detail:
      'Reproducible local environments and CI, so a new engineer runs the whole stack on day one rather than week two.',
    tools: ['GCP', 'Docker', 'GitHub Actions', 'Terraform-style IaC'],
  },
];
