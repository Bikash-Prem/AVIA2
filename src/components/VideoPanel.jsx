import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'

import {
  RefreshCw,
  Video,
  Wifi,
  WifiOff,
  Radio,
  Maximize2,
} from 'lucide-react'

import DroneViz from './DroneViz'

const BASE = `http://${import.meta.env.VITE_ROS_SERVER_IP}:${import.meta.env.VITE_VIDEO_PORT || 8080}`

const TOPIC =
  import.meta.env
    .VITE_CAMERA_TOPIC ||
  '/gimbal/camera/image'

const SNAP_URL = `${BASE}/snapshot?topic=${TOPIC}&type=jpeg`

function freshSnap() {
  return `${SNAP_URL}&_t=${Date.now()}`
}

export default function VideoPanel({
  telemetry = {},
  rosStatus,
}) {
  const [mode, setMode] =
    useState('stream')

  const [src, setSrc] =
    useState(freshSnap)

  const [error, setError] =
    useState(false)

  const timerRef = useRef(null)

  const connected =
    rosStatus === 'connected'

  /* =========================
      POLLING
  ========================= */

  const startPolling =
    useCallback(() => {
      clearInterval(
        timerRef.current
      )

      setError(false)

      setSrc(freshSnap())

      timerRef.current =
        setInterval(() => {
          setSrc(freshSnap())
        }, 100)
    }, [])

  const stopPolling =
    useCallback(() => {
      clearInterval(
        timerRef.current
      )
    }, [])

  useEffect(() => {
    if (mode === 'stream') {
      startPolling()
    } else {
      stopPolling()
    }

    return stopPolling
  }, [
    mode,
    startPolling,
    stopPolling,
  ])

  /* =========================
      SAFE TELEMETRY
  ========================= */

  const altitude =
    telemetry?.z ?? 0

  const velocity =
    telemetry?.vx ?? 0

  const angular =
    telemetry?.wz ?? 0

  return (
    <div
      className="dashboard-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 620,
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          padding: '18px 20px',

          borderBottom:
            '1px solid #e5e7eb',

          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',

          background: '#ffffff',
        }}
      >
        {/* LEFT */}
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 4,
            }}
          >
            Visual Feed
          </div>

          <div
            style={{
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            {mode === 'stream'
              ? 'Live ROS2 camera stream'
              : '3D simulation feed'}
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* STATUS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,

              padding:
                '10px 14px',

              borderRadius: 999,

              background:
                connected
                  ? '#ecfdf5'
                  : '#fef2f2',

              border: connected
                ? '1px solid #bbf7d0'
                : '1px solid #fecaca',

              color: connected
                ? '#16a34a'
                : '#dc2626',

              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {connected ? (
              <Wifi size={14} />
            ) : (
              <WifiOff
                size={14}
              />
            )}

            {connected
              ? 'Connected'
              : 'Offline'}
          </div>

          {/* STREAM BUTTON */}
          <button
            onClick={() =>
              setMode('stream')
            }
            className="icon-btn"
            style={{
              background:
                mode === 'stream'
                  ? '#eff6ff'
                  : '#fff',
            }}
          >
            <Video
              size={16}
              color={
                mode === 'stream'
                  ? '#2563eb'
                  : '#6b7280'
              }
            />
          </button>

          {/* SIM BUTTON */}
          <button
            onClick={() =>
              setMode('sim')
            }
            className="icon-btn"
            style={{
              background:
                mode === 'sim'
                  ? '#eff6ff'
                  : '#fff',
            }}
          >
            <RefreshCw
              size={16}
              color={
                mode === 'sim'
                  ? '#2563eb'
                  : '#6b7280'
              }
            />
          </button>

          {/* FULLSCREEN */}
          <button className="icon-btn">
            <Maximize2
              size={16}
            />
          </button>
        </div>
      </div>

      {/* =========================
          VIDEO AREA
      ========================= */}

      <div
        style={{
          flex: 1,
          position: 'relative',
          background: '#0f172a',
          overflow: 'hidden',

          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'center',
        }}
      >
        {/* =========================
            SIMULATION
        ========================= */}

        {mode === 'sim' && (
          <>
            <DroneViz
              telemetry={
                telemetry
              }
            />

            <Overlay
              telemetry={
                telemetry
              }
            />
          </>
        )}

        {/* =========================
            STREAM
        ========================= */}

        {mode === 'stream' && (
          <>
            {error ? (
              <div
                style={{
                  display:
                    'flex',
                  flexDirection:
                    'column',
                  alignItems:
                    'center',
                  gap: 16,
                  color:
                    '#94a3b8',
                }}
              >
                <Video
                  size={48}
                />

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Stream
                  unavailable
                </div>

                <div
                  style={{
                    fontSize: 13,
                  }}
                >
                  Waiting for
                  ROS2 video
                  stream...
                </div>

                <button
                  onClick={
                    startPolling
                  }
                  className="secondary-btn"
                  style={{
                    width: 140,
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <img
                src={src}
                alt="Drone Feed"
                onError={() =>
                  setError(true)
                }
                style={{
                  width: '100%',
                  height:
                    '100%',
                  objectFit:
                    'cover',
                }}
              />
            )}

            {!error && (
              <Overlay
                telemetry={
                  telemetry
                }
                live
              />
            )}
          </>
        )}

        {/* =========================
            TOP RIGHT LIVE BADGE
        ========================= */}

        <div
          style={{
            position:
              'absolute',
            top: 18,
            right: 18,

            display: 'flex',
            alignItems:
              'center',
            gap: 8,

            padding:
              '10px 14px',

            borderRadius: 999,

            background:
              'rgba(15,23,42,0.72)',

            backdropFilter:
              'blur(10px)',

            color: '#fff',

            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Radio size={14} />

          {mode === 'stream'
            ? 'LIVE'
            : 'SIM'}
        </div>

        {/* =========================
            BOTTOM TELEMETRY
        ========================= */}

        <div
          style={{
            position:
              'absolute',

            left: 18,
            right: 18,
            bottom: 18,

            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fit, minmax(120px, 1fr))',

            gap: 12,
          }}
        >
          <OverlayCard
            label="Altitude"
            value={`${altitude.toFixed(
              2
            )} m`}
          />

          <OverlayCard
            label="Velocity"
            value={`${velocity.toFixed(
              2
            )} m/s`}
          />

          <OverlayCard
            label="Angular"
            value={`${angular.toFixed(
              2
            )} rad/s`}
          />

          <OverlayCard
            label="Status"
            value={
              connected
                ? 'Operational'
                : 'Offline'
            }
          />
        </div>
      </div>
    </div>
  )
}

/* =========================
    OVERLAY
========================= */

function Overlay({
  telemetry,
  live,
}) {
  const x =
    telemetry?.x ?? 0

  const y =
    telemetry?.y ?? 0

  const z =
    telemetry?.z ?? 0

  return (
    <>
      <div
        style={{
          position:
            'absolute',

          top: 18,
          left: 18,

          display: 'flex',
          alignItems:
            'center',
          gap: 8,

          padding:
            '8px 14px',

          borderRadius: 999,

          background:
            'rgba(15,23,42,0.72)',

          color: '#fff',

          fontSize: 12,
          fontWeight: 700,

          backdropFilter:
            'blur(10px)',
        }}
      >
        {live && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius:
                '50%',
              background:
                '#ef4444',
            }}
          />
        )}

        {live
          ? 'Live Feed'
          : 'Simulation'}
      </div>

      <div
        style={{
          position:
            'absolute',

          bottom: 90,
          left: 18,

          display: 'flex',
          gap: 8,
        }}
      >
        {[
          ['X', x],
          ['Y', y],
          ['Z', z],
        ].map(
          ([label, val]) => (
            <div
              key={label}
              style={{
                background:
                  'rgba(15,23,42,0.72)',

                backdropFilter:
                  'blur(10px)',

                color:
                  '#fff',

                padding:
                  '8px 12px',

                borderRadius: 12,

                fontSize: 12,

                fontFamily:
                  'monospace',
              }}
            >
              <span
                style={{
                  opacity: 0.7,
                }}
              >
                {label}:{' '}
              </span>

              {Number(
                val
              ).toFixed(2)}
            </div>
          )
        )}
      </div>
    </>
  )
}

/* =========================
    OVERLAY CARD
========================= */

function OverlayCard({
  label,
  value,
}) {
  return (
    <div
      style={{
        background:
          'rgba(15,23,42,0.72)',

        backdropFilter:
          'blur(10px)',

        borderRadius: 16,

        padding:
          '12px 14px',

        color: '#fff',
      }}
    >
      <div
        style={{
          fontSize: 11,
          opacity: 0.7,
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  )
}