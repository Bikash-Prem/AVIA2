import React, {
  useState,
} from 'react'

import {
  Send,
  Sparkles,
  Bot,
} from 'lucide-react'

export default function CommandCard({
  messages = [],
  isLoading,
  history,
  alerts = [],
  onSend,
}) {
  const [input, setInput] =
    useState('')

  /* =========================
      SEND
  ========================= */

  const handleSend = () => {
    const text = input.trim()

    if (!text) return

    onSend(text)

    setInput('')
  }

  const handleKeyDown = (
    e
  ) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()

      handleSend()
    }
  }

  return (
    <div
      className="dashboard-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 520,
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <div
          className="card-title"
        >
          Command Center
        </div>

        <div
          className="card-subtitle"
        >
          Natural language drone
          control using LLM
        </div>
      </div>

      {/* =========================
          ALERTS
      ========================= */}

      {alerts.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {alerts.map(
            (alert) => (
              <div
                key={alert.id}
                style={{
                  padding:
                    '12px 14px',

                  borderRadius: 14,

                  background:
                    alert.type ===
                    'error'
                      ? '#fef2f2'
                      : '#fffbeb',

                  border:
                    alert.type ===
                    'error'
                      ? '1px solid #fecaca'
                      : '1px solid #fde68a',

                  color:
                    alert.type ===
                    'error'
                      ? '#dc2626'
                      : '#d97706',

                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {alert.msg}
              </div>
            )
          )}
        </div>
      )}

      {/* =========================
          CHAT AREA
      ========================= */}

      <div
        style={{
          flex: 1,
          overflowY: 'auto',

          display: 'flex',
          flexDirection:
            'column',

          gap: 16,

          paddingRight: 4,
          marginBottom: 20,
        }}
      >
        {messages.length ===
        0 ? (
          <div
            style={{
              flex: 1,

              display: 'flex',
              flexDirection:
                'column',

              alignItems:
                'center',

              justifyContent:
                'center',

              textAlign:
                'center',

              color: '#6b7280',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,

                borderRadius: 22,

                background:
                  '#eff6ff',

                display: 'flex',
                alignItems:
                  'center',

                justifyContent:
                  'center',

                marginBottom: 20,
              }}
            >
              <Bot
                size={32}
                color="#2563eb"
              />
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#111827',
                marginBottom: 8,
              }}
            >
              Awaiting Command
            </div>

            <div
              style={{
                fontSize: 14,
                maxWidth: 320,
                lineHeight: 1.7,
              }}
            >
              Send natural language
              drone instructions
              like:
              <br />
              <br />
              “Takeoff and hover
              at 2 meters”
            </div>
          </div>
        ) : (
          messages.map(
            (msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    msg.role ===
                    'user'
                      ? 'flex-end'
                      : 'flex-start',

                  maxWidth:
                    '85%',

                  background:
                    msg.role ===
                    'user'
                      ? '#2563eb'
                      : '#f8fafc',

                  color:
                    msg.role ===
                    'user'
                      ? '#fff'
                      : '#111827',

                  padding:
                    '14px 16px',

                  borderRadius: 18,

                  border:
                    msg.role ===
                    'assistant'
                      ? '1px solid #e5e7eb'
                      : 'none',

                  lineHeight: 1.6,

                  fontSize: 14,
                }}
              >
                {msg.content}
              </div>
            )
          )
        )}

        {/* LOADING */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 10,

              padding:
                '12px 16px',

              borderRadius: 16,

              background:
                '#f8fafc',

              border:
                '1px solid #e5e7eb',

              width: 'fit-content',
            }}
          >
            <Sparkles
              size={16}
              color="#2563eb"
            />

            <span
              style={{
                fontSize: 14,
                color: '#374151',
              }}
            >
              Interpreting
              command...
            </span>
          </div>
        )}
      </div>

      {/* =========================
          INPUT
      ========================= */}

      <div
        style={{
          border:
            '1px solid #e5e7eb',

          borderRadius: 22,

          padding: 16,

          background: '#fff',

          marginTop: 'auto',
        }}
      >
        <textarea
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder="Send command to drone..."
          className="command-input"
          style={{
            border: 'none',
            padding: 0,
            minHeight: 120,
          }}
        />

        {/* BOTTOM */}
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',

            justifyContent:
              'space-between',

            marginTop: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            LLM-powered ROS2
            command parsing
          </div>

          <button
            onClick={
              handleSend
            }
            disabled={
              isLoading
            }
            className="primary-btn"
            style={{
              display: 'flex',
              alignItems:
                'center',

              gap: 10,

              padding:
                '0 20px',
            }}
          >
            <Send
              size={16}
            />

            Send
          </button>
        </div>
      </div>
    </div>
  )
}