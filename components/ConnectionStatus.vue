<template>
  <div class="connection-status" :class="statusClass">
    <div class="status-indicator">
      <div class="status-dot" :class="dotClass"></div>
      <span class="status-text">{{ statusText }}</span>
    </div>
    <div v-if="connectionState.isReconnecting" class="reconnect-info">
      <span>Reconnecting... ({{ connectionState.connectionAttempts }}/5)</span>
    </div>
    <div v-if="offlineQueue.length > 0" class="offline-queue">
      <span>{{ offlineQueue.length }} actions queued</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { connectionState, offlineQueue } = useAppwrite()

const statusText = computed(() => {
  if (connectionState.value.isReconnecting) {
    return 'Reconnecting...'
  }
  if (connectionState.value.isConnected) {
    return 'Connected'
  }
  return 'Disconnected'
})

const statusClass = computed(() => {
  if (connectionState.value.isReconnecting) {
    return 'status-reconnecting'
  }
  if (connectionState.value.isConnected) {
    return 'status-connected'
  }
  return 'status-disconnected'
})

const dotClass = computed(() => {
  if (connectionState.value.isReconnecting) {
    return 'dot-reconnecting'
  }
  if (connectionState.value.isConnected) {
    return 'dot-connected'
  }
  return 'dot-disconnected'
})
</script>

<style scoped>
.connection-status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dot-connected {
  background-color: #10b981;
}

.dot-disconnected {
  background-color: #ef4444;
}

.dot-reconnecting {
  background-color: #f59e0b;
  animation: pulse 1.5s infinite;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
}

.status-connected .status-text {
  color: #059669;
}

.status-disconnected .status-text {
  color: #dc2626;
}

.status-reconnecting .status-text {
  color: #d97706;
}

.reconnect-info,
.offline-queue {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Hide when connected for cleaner UI */
.status-connected {
  opacity: 0.7;
}

.status-connected:hover {
  opacity: 1;
}
</style>