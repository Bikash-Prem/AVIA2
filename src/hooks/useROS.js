import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'

import { rosService } from '../services/rosService'

/* =========================
    INITIAL TELEMETRY
========================= */

const INITIAL_TELEMETRY = {
  x: 0,
  y: 0,
  z: 0,

  vx: 0,
  vy: 0,
  vz: 0,

  yaw: 0,

  // REAL value should come from ROS
  battery: 0,
}

/* =========================
    HOOK
========================= */

export function useROS() {
  const [rosStatus, setRosStatus] =
    useState('disconnected')

  const [telemetry, setTelemetry] =
    useState(INITIAL_TELEMETRY)

  const simTimer = useRef(null)

  /* =========================
      SIMULATION FALLBACK
      (ONLY POSITION DATA)
  ========================= */

  const startSim = useCallback(() => {
    clearInterval(simTimer.current)

    simTimer.current = setInterval(
      () => {
        const t =
          Date.now() / 1000

        setTelemetry((prev) => ({
          ...prev,

          x:
            prev.x +
            Math.sin(
              t * 0.3
            ) *
              0.018,

          y:
            prev.y +
            Math.cos(
              t * 0.25
            ) *
              0.013,

          z:
            1.2 +
            Math.sin(
              t * 0.5
            ) *
              0.09,

          vx:
            Math.sin(
              t * 0.3
            ) * 0.28,

          vy:
            Math.cos(
              t * 0.25
            ) * 0.19,

          vz:
            Math.sin(
              t * 0.5
            ) * 0.08,

          yaw:
            (prev.yaw +
              0.12) %
            360,

          /*
            IMPORTANT:
            DO NOT simulate battery here.
            Battery must come from ROS only.
          */
        }))
      },
      250
    )
  }, [])

  const stopSim = useCallback(() => {
    clearInterval(simTimer.current)
  }, [])

  /* =========================
      ROS CONNECTION
  ========================= */

  useEffect(() => {
    // fallback sim before ROS connects
    startSim()

    rosService.connect(
      (status) => {
        setRosStatus(status)

        if (
          status ===
          'connected'
        ) {
          stopSim()
        } else {
          startSim()
        }
      },

      (data) => {
        setTelemetry(
          (prev) => ({
            ...prev,
            ...data,
          })
        )
      }
    )

    return () => {
      stopSim()

      rosService.disconnect()
    }
  }, [startSim, stopSim])

  /* =========================
      COMMAND PUBLISH
  ========================= */

  const publishCmd =
    useCallback(
      (commandText) => {
        return rosService.publishCommand(
          commandText
        )
      },
      []
    )

  /* =========================
      E-STOP
  ========================= */

  const emergencyStop =
    useCallback(() => {
      return rosService.emergencyStop()
    }, [])

  return {
    rosStatus,
    telemetry,
    publishCmd,
    emergencyStop,
  }
}