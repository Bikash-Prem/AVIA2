import React, {
  useState,
  useCallback,
} from 'react'

import './styles/dashboard.css'
import './styles/cards.css'

import TopBar from './components/TopBar'
import StatsRow from './components/StatsRow'
import ChatPanel from './components/ChatPanel'
import VideoPanel from './components/VideoPanel'
import TelemetryPanel from './components/TelemetryPanel'
import QuickActions from './components/QuickActions'
import ConnectionCard from './components/ConnectionCard'

import { useROS } from './hooks/useROS'
import { useChat } from './hooks/useChat'
import { useTelemetryHistory } from './hooks/useTelemetryHistory'

import { isCommandSafe } from './utils/validation'

export default function App() {
  const {
    rosStatus,
    telemetry,
    publishCmd,
    emergencyStop,
  } = useROS()

  const [alerts, setAlerts] = useState([])

  const {
    velHistory,
    altHistory,
  } = useTelemetryHistory(telemetry)

  /* =========================
      ALERTS
  ========================= */

  const addAlert = useCallback(
    (msg, type = 'error') => {
      const id = Date.now()

      setAlerts((a) => [
        ...a.slice(-2),
        { id, msg, type },
      ])

      setTimeout(() => {
        setAlerts((a) =>
          a.filter((x) => x.id !== id)
        )
      }, 5000)
    },
    []
  )

  /* =========================
      COMMAND HANDLING
  ========================= */

  const handleParsedCommand =
    useCallback(
      (parsed, originalText) => {
        if (!isCommandSafe(parsed)) {
          addAlert(
            'Command exceeds safety limits.',
            'error'
          )
          return
        }

        if (parsed.confidence < 0.5) {
          addAlert(
            'Low confidence command blocked.',
            'warning'
          )
          return
        }

        const ok =
          publishCmd(originalText)

        if (
          !ok &&
          rosStatus === 'connected'
        ) {
          addAlert(
            'Failed to publish to ROS.',
            'warning'
          )
        }
      },
      [
        publishCmd,
        rosStatus,
        addAlert,
      ]
    )

  /* =========================
      CHAT
  ========================= */

  const {
    messages,
    isLoading,
    history,
    send,
  } = useChat(handleParsedCommand)

  const handleSend = useCallback(
    async (text) => {
      const result = await send(text)

      if (
        result?.error &&
        !result?.parsed
      ) {
        addAlert(
          result.error,
          'error'
        )
      }
    },
    [send, addAlert]
  )

  /* =========================
      E-STOP
  ========================= */

  const handleEmergencyStop =
    useCallback(() => {
      emergencyStop()

      addAlert(
        'Emergency stop triggered.',
        'warning'
      )
    }, [emergencyStop, addAlert])

  /* =========================
      QUICK ACTIONS
  ========================= */

  const handleQuickAction =
    useCallback(
      (command) => {
        handleSend(command)
      },
      [handleSend]
    )

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">

        {/* =========================
            TOP BAR
        ========================= */}

        <TopBar
          rosStatus={rosStatus}
          telemetry={telemetry}
          onEmergencyStop={
            handleEmergencyStop
          }
        />

        {/* =========================
            STATS ROW
        ========================= */}

        <StatsRow
          telemetry={telemetry}
          rosStatus={rosStatus}
        />

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="main-grid">

          {/* VIDEO PANEL */}

          <VideoPanel
            telemetry={telemetry}
            rosStatus={rosStatus}
          />

          {/* CHAT / COMMAND */}

          <div
            className="dashboard-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <div
              className="card-title"
            >
              Command Center
            </div>

            <div
              className="card-subtitle"
              style={{
                marginBottom: 20,
              }}
            >
              Natural language drone
              control
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <ChatPanel
                messages={messages}
                isLoading={isLoading}
                history={history}
                onSend={handleSend}
                alerts={alerts}
              />
            </div>
          </div>
        </div>

        {/* =========================
            BOTTOM GRID
        ========================= */}

        <div className="bottom-grid">

          {/* TELEMETRY */}

          <div className="dashboard-card">
            <div className="card-title">
              Telemetry
            </div>

            <div className="card-subtitle">
              Real-time drone data
            </div>

            <div
              style={{
                marginTop: 20,
              }}
            >
              <TelemetryPanel
                telemetry={telemetry}
                rosStatus={rosStatus}
                velHistory={
                  velHistory
                }
                altHistory={
                  altHistory
                }
              />
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <QuickActions
            onSend={
              handleQuickAction
            }
          />

          {/* CONNECTION */}

          <ConnectionCard
            rosStatus={rosStatus}
            latency={28}
          />

          {/* INTERPRETED COMMAND */}

          <div className="dashboard-card">
            <div className="card-title">
              Interpreted Command
            </div>

            <div className="card-subtitle">
              Parsed LLM action output
            </div>

            <div
              style={{
                marginTop: 20,
                background:
                  '#f8fafc',
                borderRadius: 18,
                padding: 20,
                minHeight: 240,
                border:
                  '1px solid #e5e7eb',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace:
                    'pre-wrap',
                  wordBreak:
                    'break-word',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#111827',
                  fontFamily:
                    'monospace',
                }}
              >
{`{
  "action": "hover",
  "linear": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "angular": {
    "z": 0
  }
}`}
              </pre>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 16,
                marginTop: 20,
              }}
            >
              <button className="success-btn">
                Execute
              </button>

              <button className="secondary-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}