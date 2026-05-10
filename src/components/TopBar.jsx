import React from 'react'

import {
  Cpu,
  Zap,
  Wifi,
  WifiOff,
  Loader,
  ShieldCheck,
} from 'lucide-react'

import { config } from '../services/config'

function StatusPill({ status }) {
  const map = {
    connected: {
      bg: '#ecfdf5',
      border: '#bbf7d0',
      color: '#16a34a',
      label: 'ROS Connected',
      Icon: Wifi,
    },

    disconnected: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#dc2626',
      label: 'ROS Offline',
      Icon: WifiOff,
    },

    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#dc2626',
      label: 'ROS Error',
      Icon: WifiOff,
    },

    connecting: {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#d97706',
      label: 'Connecting...',
      Icon: Loader,
    },
  }

  const s =
    map[status] ||
    map.disconnected

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,

        padding: '10px 16px',

        borderRadius: 999,

        background: s.bg,
        border: `1px solid ${s.border}`,

        color: s.color,

        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <s.Icon
        size={14}
        className={
          status === 'connecting'
            ? 'animate-spin'
            : ''
        }
      />

      {s.label}
    </div>
  )
}

export default function TopBar({
  rosStatus,
  onEmergencyStop,
}) {
  return (
    <div
      className="dashboard-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',

        padding: '18px 24px',
      }}
    >
      {/* =========================
          LEFT
      ========================= */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: 56,
            height: 56,

            borderRadius: 18,

            background:
              'linear-gradient(135deg, #2563eb, #1d4ed8)',

            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',

            boxShadow:
              '0 12px 30px rgba(37,99,235,0.22)',
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle
              cx="12"
              cy="12"
              r="3"
            />

            <path d="M6 3l2 3M18 3l-2 3M6 21l2-3M18 21l-2-3" />

            <circle
              cx="4"
              cy="6"
              r="2"
            />

            <circle
              cx="20"
              cy="6"
              r="2"
            />

            <circle
              cx="4"
              cy="18"
              r="2"
            />

            <circle
              cx="20"
              cy="18"
              r="2"
            />
          </svg>
        </div>

        {/* TITLE */}
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#111827',
              letterSpacing:
                '-0.03em',
              marginBottom: 4,
            }}
          >
            Drone AI Control
          </div>

          <div
            style={{
              fontSize: 14,
              color: '#6b7280',
            }}
          >
            GPS-Denied Autonomous
            Navigation ·{' '}
            {config.ollamaModel}
          </div>
        </div>
      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {/* ROS STATUS */}
        <StatusPill
          status={rosStatus}
        />

        {/* MODEL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,

            padding: '10px 16px',

            borderRadius: 999,

            background: '#eff6ff',
            border:
              '1px solid #bfdbfe',

            color: '#2563eb',

            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Cpu size={14} />

          Phi-3 · Ollama
        </div>

        {/* SAFETY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,

            padding: '10px 16px',

            borderRadius: 999,

            background: '#ecfdf5',
            border:
              '1px solid #bbf7d0',

            color: '#16a34a',

            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <ShieldCheck
            size={14}
          />

          Safety Active
        </div>

        {/* E-STOP */}
        <button
          onClick={
            onEmergencyStop
          }
          className="danger-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,

            padding:
              '0 20px',
          }}
        >
          <Zap size={14} />

          E-STOP
        </button>
      </div>
    </div>
  )
}