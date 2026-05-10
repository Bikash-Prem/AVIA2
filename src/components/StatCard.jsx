import React from 'react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#2563eb',
}) {
  return (
    <div className="dashboard-card">
      {/* TOP */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',

          marginBottom: 18,
        }}
      >
        {/* TEXT */}
        <div>
          <div
            style={{
              fontSize: 13,
              color: '#6b7280',
              marginBottom: 6,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#111827',
              letterSpacing:
                '-0.02em',
            }}
          >
            {value}
          </div>
        </div>

        {/* ICON */}
        <div
          style={{
            width: 42,
            height: 42,

            borderRadius: 18,

            background:
              `${color}15`,

            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
          }}
        >
          {Icon && (
            <Icon
              size={24}
              color={color}
            />
          )}
        </div>
      </div>

      {/* SUBTITLE */}
      <div
        style={{
          fontSize: 12,
          color: '#6b7280',
        }}
      >
        {subtitle}
      </div>
    </div>
  )
}