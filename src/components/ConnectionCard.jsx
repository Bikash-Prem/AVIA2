import React from 'react'

import {
  Wifi,
  WifiOff,
  Activity,
  ShieldCheck,
} from 'lucide-react'

export default function ConnectionCard({
  rosStatus,
  latency = 0,
}) {
  const connected =
    rosStatus === 'connected'

  return (
    <div className="dashboard-card">
      {/* HEADER */}
      <div className="card-title">
        Connection Status
      </div>

      <div className="card-subtitle">
        ROS2 bridge and communication health
      </div>

      {/* STATUS */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          padding: '16px 18px',
          borderRadius: 18,
          background: connected
            ? '#ecfdf5'
            : '#fef2f2',
          border: connected
            ? '1px solid #bbf7d0'
            : '1px solid #fecaca',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'center',
            }}
          >
            {connected ? (
              <Wifi
                size={20}
                color="#16a34a"
              />
            ) : (
              <WifiOff
                size={20}
                color="#dc2626"
              />
            )}
          </div>

          {/* TEXT */}
          <div>
            <div
              style={{
                fontSize: 13,
                color: '#6b7280',
                marginBottom: 4,
              }}
            >
              ROS2 Websocket
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: connected
                  ? '#16a34a'
                  : '#dc2626',
              }}
            >
              {connected
                ? 'Connected'
                : 'Disconnected'}
            </div>
          </div>
        </div>

        {/* STATUS DOT */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: connected
              ? '#16a34a'
              : '#dc2626',
          }}
        />
      </div>

      {/* METRICS */}
      <div
        style={{
          marginTop: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* LATENCY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            padding: '14px 16px',
            borderRadius: 16,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Activity
              size={18}
              color="#2563eb"
            />

            <span
              style={{
                fontSize: 14,
                color: '#374151',
              }}
            >
              Network Latency
            </span>
          </div>

          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color:
                latency < 100
                  ? '#16a34a'
                  : '#dc2626',
            }}
          >
            {latency} ms
          </span>
        </div>

        {/* SAFETY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            padding: '14px 16px',
            borderRadius: 16,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <ShieldCheck
              size={18}
              color="#16a34a"
            />

            <span
              style={{
                fontSize: 14,
                color: '#374151',
              }}
            >
              Safety Layer
            </span>
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#16a34a',
            }}
          >
            Active
          </span>
        </div>
      </div>
    </div>
  )
}