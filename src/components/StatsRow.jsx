import React from 'react'

import {
  Battery,
  Signal,
  Bot,
  MapPinned,
  Camera,
  Clock3,
} from 'lucide-react'

import StatCard from './StatCard'

export default function StatsRow({
  telemetry,
  rosStatus,
}) {
  const currentTime =
    new Date().toLocaleTimeString()

  const stats = [
    {
      title: 'Battery',
      value: `${Number(
  telemetry?.battery ?? 0
).toFixed(0)}%`,
      subtitle: 'Power Level',
      icon: Battery,
      color:
        (telemetry?.battery ?? 0) > 30
          ? '#16a34a'
          : '#dc2626',
    },

    {
      title: 'ROS Signal',
      value:
        rosStatus === 'connected'
          ? 'Strong'
          : 'Offline',
      subtitle: 'ROS2 Websocket',
      icon: Signal,
      color:
        rosStatus === 'connected'
          ? '#16a34a'
          : '#dc2626',
    },

    {
      title: 'Mode',
      value: 'LLM AUTO',
      subtitle: 'AI Navigation',
      icon: Bot,
      color: '#2563eb',
    },

    {
      title: 'GPS',
      value: 'Denied',
      subtitle: 'SLAM Active',
      icon: MapPinned,
      color: '#ea580c',
    },

    {
      title: 'Vision',
      value:
        rosStatus === 'connected'
          ? 'Online'
          : 'Offline',
      subtitle: 'Camera Stream',
      icon: Camera,
      color:
        rosStatus === 'connected'
          ? '#16a34a'
          : '#dc2626',
    },

    {
      title: 'System Time',
      value: currentTime,
      subtitle: 'Local Time',
      icon: Clock3,
      color: '#111827',
    },
  ]

  return (
    <div className="stats-grid">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  )
}