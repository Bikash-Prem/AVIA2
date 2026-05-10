import ROSLIB from 'roslib'
import { config } from './config'

class RosService {
  constructor() {
    this.ros = null

    /* =========================
        PUBLISHERS
    ========================= */

    this.cmdVelTopic = null

    /* =========================
        SUBSCRIBERS
    ========================= */

    this.odomTopic = null
    this.batteryTopic = null

    /* =========================
        CALLBACKS
    ========================= */

    this._onStatus = null
    this._onTelemetry = null

    /* =========================
        RECONNECT
    ========================= */

    this._retryTimer = null
    this._retryDelay = 3000
  }

  /* =========================
      CONNECT
  ========================= */

  connect(onStatus, onTelemetry) {
    this._onStatus = onStatus
    this._onTelemetry =
      onTelemetry

    // Close previous socket
    if (this.ros) {
      try {
        this.ros.close()
      } catch {}
    }

    /* =========================
        CREATE ROS CONNECTION
    ========================= */

    this.ros =
      new ROSLIB.Ros({
        url: config.rosWsUrl,
      })

    /* =========================
        CONNECTION EVENTS
    ========================= */

    this.ros.on(
      'connection',
      () => {
        console.info(
          '[ROS] Connected:',
          config.rosWsUrl
        )

        onStatus?.(
          'connected'
        )

        this._setupTopics()
      }
    )

    this.ros.on(
      'error',
      (err) => {
        console.error(
          '[ROS] Error:',
          err
        )

        onStatus?.('error')
      }
    )

    this.ros.on('close', () => {
      console.warn(
        '[ROS] Disconnected. Retrying...'
      )

      onStatus?.(
        'disconnected'
      )

      clearTimeout(
        this._retryTimer
      )

      this._retryTimer =
        setTimeout(() => {
          this.connect(
            onStatus,
            onTelemetry
          )
        }, this._retryDelay)
    })
  }

  /* =========================
      TOPICS
  ========================= */

  _setupTopics() {
    /* =========================
        COMMAND PUBLISHER
    ========================= */

    this.cmdVelTopic =
      new ROSLIB.Topic({
        ros: this.ros,

        name:
          '/user_command',

        messageType:
          'std_msgs/String',
      })

    /* =========================
        LOCAL POSITION
    ========================= */

    this.odomTopic =
      new ROSLIB.Topic({
        ros: this.ros,

        name:
          '/fmu/out/vehicle_local_position_v1',

        messageType:
          'px4_msgs/msg/VehicleLocalPosition',

        throttle_rate: 200,
      })

    this.odomTopic.subscribe(
      (msg) => {
        if (
          !this
            ._onTelemetry
        )
          return

        /*
          PX4 Local Frame:
          x = North
          y = East
          z = Down

          Convert z to altitude
        */

        this._onTelemetry({
          x: msg.x ?? 0,

          y: msg.y ?? 0,

          z:
            -(msg.z ?? 0),

          vx:
            msg.vx ?? 0,

          vy:
            msg.vy ?? 0,

          vz:
            -(msg.vz ?? 0),

          yaw:
            (msg.heading ??
              0) *
            (180 / Math.PI),
        })
      }
    )

    /* =========================
        BATTERY
        IMPORTANT:
        Backend should expose:
        /drone/battery_percent
        as std_msgs/Float32
    ========================= */

    this.batteryTopic =
      new ROSLIB.Topic({
        ros: this.ros,

        name:
          '/drone/battery_percent',

        messageType:
          'std_msgs/Float32',

        throttle_rate: 1000,
      })

    this.batteryTopic.subscribe(
      (msg) => {
        if (
          !this
            ._onTelemetry
        )
          return

        console.log(
          '[BATTERY]',
          msg
        )

        this._onTelemetry({
          battery:
            Math.round(
              msg.data ?? 0
            ),
        })
      }
    )
  }

  /* =========================
      COMMAND PUBLISH
  ========================= */

  publishCommand(
    commandText
  ) {
    if (!this.cmdVelTopic)
      return false

    const msg =
      new ROSLIB.Message({
        data: commandText,
      })

    try {
      this.cmdVelTopic.publish(
        msg
      )

      console.info(
        '[ROS] Published:',
        commandText
      )

      return true
    } catch (err) {
      console.error(
        '[ROS] Publish failed:',
        err
      )

      return false
    }
  }

  /* =========================
      EMERGENCY STOP
  ========================= */

  emergencyStop() {
    return this.publishCommand(
      'stop'
    )
  }

  /* =========================
      TWIST WRAPPER
  ========================= */

  publishTwist(
    linear,
    angular
  ) {
    if (
      !linear.x &&
      !linear.y &&
      !linear.z &&
      !angular.z
    ) {
      return this.publishCommand(
        'stop'
      )
    }

    return this.publishCommand(
      'move'
    )
  }

  /* =========================
      DISCONNECT
  ========================= */

  disconnect() {
    clearTimeout(
      this._retryTimer
    )

    try {
      this.odomTopic?.unsubscribe()

      this.batteryTopic?.unsubscribe()

      this.ros?.close()
    } catch {}
  }
}

export const rosService =
  new RosService()