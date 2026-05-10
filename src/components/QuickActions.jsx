import React from 'react'

import {
  PlaneTakeoff,
  PlaneLanding,
  PauseCircle,
  RotateCcw,
  MoveUp,
  ShieldAlert,
} from 'lucide-react'

export default function QuickActions({
  onSend,
}) {
  const actions = [
    {
      title: 'Takeoff',
      subtitle:
        'Launch drone',
      icon: PlaneTakeoff,
      color: '#16a34a',
      bg: '#ecfdf5',
      border: '#bbf7d0',
      command: 'takeoff',
    },

    {
      title: 'Land',
      subtitle:
        'Safe landing',
      icon: PlaneLanding,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      command: 'land',
    },

    {
      title: 'Hover',
      subtitle:
        'Maintain position',
      icon: PauseCircle,
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      command: 'hover',
    },

    {
      title: 'Rotate',
      subtitle:
        'Rotate 90°',
      icon: RotateCcw,
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      command:
        'rotate right 90 degrees',
    },

    {
      title: 'Ascend',
      subtitle:
        'Increase altitude',
      icon: MoveUp,
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fed7aa',
      command:
        'move upward',
    },

    {
      title: 'Emergency',
      subtitle:
        'Immediate stop',
      icon: ShieldAlert,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      command:
        'emergency stop',
    },
  ]

  return (
    <div className="dashboard-card">
      {/* =========================
          HEADER
      ========================= */}

      <div
        className="card-title"
      >
        Quick Actions
      </div>

      <div
        className="card-subtitle"
        style={{
          marginBottom: 20,
        }}
      >
        One-click drone
        commands
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: 14,
        }}
      >
        {actions.map((item) => {
          const Icon =
            item.icon

          return (
            <button
              key={item.title}
              onClick={() =>
                onSend?.(
                  item.command
                )
              }
              style={{
                border: `1px solid ${item.border}`,

                background:
                  item.bg,

                borderRadius: 20,

                padding:
                  '16px 18px',

                cursor:
                  'pointer',

                display: 'flex',

                alignItems:
                  'center',

                justifyContent:
                  'space-between',

                transition:
                  'all 0.2s ease',
              }}
              onMouseEnter={(
                e
              ) => {
                e.currentTarget.style.transform =
                  'translateY(-2px)'
              }}
              onMouseLeave={(
                e
              ) => {
                e.currentTarget.style.transform =
                  'translateY(0px)'
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
                    width: 48,
                    height: 48,

                    borderRadius: 16,

                    background:
                      '#ffffff',

                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',

                    border: `1px solid ${item.border}`,
                  }}
                >
                  <Icon
                    size={22}
                    color={
                      item.color
                    }
                  />
                </div>

                {/* TEXT */}
                <div
                  style={{
                    textAlign:
                      'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color:
                        '#111827',
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color:
                        '#6b7280',
                    }}
                  >
                    {
                      item.subtitle
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
            </button>
          )
        })}
      </div>
    </div>
  )
}