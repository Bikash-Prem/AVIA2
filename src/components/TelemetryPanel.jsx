import React from 'react'

import {
  MoveUp,
  Gauge,
  Compass,
  Activity,
  Wifi,
  Cpu,
} from 'lucide-react'

export default function TelemetryPanel({
  telemetry,
  rosStatus,
}) {
  const angularZ =
    telemetry?.wz ?? 0

  const speed =
    Math.sqrt(
      (telemetry?.vx ?? 0) **
        2 +
        (telemetry?.vy ?? 0) **
          2 +
        (telemetry?.vz ?? 0) **
          2
    )

  const heading =
    telemetry?.yaw ?? 0

  const telemetryItems = [
    {
      label: 'Altitude',
      value: `${(
        telemetry?.z ?? 0
      ).toFixed(2)} m`,
      icon: MoveUp,
      color: '#2563eb',
    },

    {
      label: 'Speed',
      value: `${speed.toFixed(
        2
      )} m/s`,
      icon: Gauge,
      color: '#16a34a',
    },

    {
      label: 'Heading',
      value: `${heading.toFixed(
        1
      )}°`,
      icon: Compass,
      color: '#7c3aed',
    },

    {
      label: 'ROS Bridge',
      value:
        rosStatus ===
        'connected'
          ? 'Connected'
          : 'Offline',
      icon: Wifi,
      color:
        rosStatus ===
        'connected'
          ? '#16a34a'
          : '#dc2626',
    },

    {
      label: 'Linear X',
      value: `${(
        telemetry?.vx ??
        0
      ).toFixed(2)} m/s`,
      icon: Activity,
      color: '#ea580c',
    },

    {
      label: 'Angular Z',
      value: `${angularZ.toFixed(
        2
      )} rad/s`,
      icon: Cpu,
      color: '#0f766e',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',

        gap: 14,
      }}
    >
      {telemetryItems.map(
        (item) => {
          const Icon =
            item.icon

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',

                alignItems:
                  'center',

                justifyContent:
                  'space-between',

                padding:
                  '14px 16px',

                borderRadius: 18,

                background:
                  '#f8fafc',

                border:
                  '1px solid #e5e7eb',
              }}
            >
              {/* LEFT */}
              <div
                style={{
                  display: 'flex',

                  alignItems:
                    'center',

                  gap: 14,
                }}
              >
                {/* ICON */}
                <div
                  style={{
                    width: 42,
                    height: 42,

                    borderRadius: 14,

                    background:
                      '#fff',

                    display: 'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    border:
                      '1px solid #e5e7eb',
                  }}
                >
                  <Icon
                    size={20}
                    color={
                      item.color
                    }
                  />
                </div>

                {/* TEXT */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color:
                        '#6b7280',

                      marginBottom: 4,
                    }}
                  >
                    {
                      item.label
                    }
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color:
                        '#111827',
                    }}
                  >
                    {
                      item.value
                    }
                  </div>
                </div>
              </div>

              {/* STATUS DOT */}
              <div
                style={{
                  width: 10,
                  height: 10,

                  borderRadius:
                    '50%',

                  background:
                    item.color,
                }}
              />
            </div>
          )
        }
      )}
    </div>
  )
}