import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated at request time so the card never drifts from the site config. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#05070a',
          padding: 80,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#4ade80',
            }}
          />
          <div style={{ color: '#6b7789', fontSize: 26 }}>{`${site.handle}.in`}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#ffffff', fontSize: 78, lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ color: '#4ade80', fontSize: 34, marginTop: 20 }}>
            {site.role}
          </div>
          <div style={{ color: '#98a3b5', fontSize: 27, marginTop: 28 }}>
            Streaming · Apache Beam · Flink · Airflow · BigQuery
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            borderTop: '1px solid #1c2430',
            paddingTop: 28,
          }}
        >
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: index % 4 === 0 ? '#4ade80' : '#1c2430',
              }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
