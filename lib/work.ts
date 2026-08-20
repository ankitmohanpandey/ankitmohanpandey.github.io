export interface WorkItem {
  title: string;
  summary: string;
  stack: string[];
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
      'A Kafka-to-Kafka streaming job doing 10s tumbling event-time windows with bounded out-of-orderness watermarks, checkpointing, and a side-output dead letter queue for malformed records. Fully containerised so it runs with one command.',
    stack: ['Apache Flink', 'Kafka', 'Java', 'Docker Compose'],
    year: '2026',
  },
];

export interface Capability {
  area: string;
  detail: string;
  tools: string[];
}

export const capabilities: Capability[] = [
  {
    area: 'Streaming',
    detail:
      'Event-time semantics, watermarking, windowing and state management for pipelines that have to be correct when data arrives late or twice.',
    tools: ['Apache Beam', 'Apache Flink', 'Dataflow', 'Pub/Sub', 'Kafka'],
  },
  {
    area: 'Batch & warehousing',
    detail:
      'Partitioned, clustered models in BigQuery with an eye on query cost, plus the orchestration to keep them fresh and backfillable.',
    tools: ['BigQuery', 'Airflow', 'dbt-style modelling', 'SQL'],
  },
  {
    area: 'Reliability',
    detail:
      'Checkpointing, replay, idempotent sinks, dead letter queues and the alerting that makes a 3am page actionable instead of terrifying.',
    tools: ['Checkpoints', 'DLQs', 'Data quality checks', 'Observability'],
  },
  {
    area: 'Platform',
    detail:
      'Reproducible local environments and CI so a new engineer can run the whole stack on day one rather than week two.',
    tools: ['GCP', 'Docker', 'GitHub Actions', 'Terraform-style IaC'],
  },
];
