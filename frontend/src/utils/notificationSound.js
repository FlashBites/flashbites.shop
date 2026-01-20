/**
 * Real-time Notification Sound System
 * Provides audio notifications for orders, updates, and alerts
 */

class NotificationSound {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
    this.enabled = true;
    this.volume = 0.5;
    this.lastPlayTime = 0;
    this.minInterval = 500; // Minimum 500ms between sounds
    
    // Load preferences from localStorage
    this.loadPreferences();
    
    // Auto-initialize on user interaction
    this.setupAutoInit();
  }

  // Setup auto-initialization on user interaction
  setupAutoInit() {
    const initOnInteraction = () => {
      this.init();
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchstart', initOnInteraction);
      document.removeEventListener('keydown', initOnInteraction);
    };

    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
    document.addEventListener('keydown', initOnInteraction, { once: true });
  }

  // Load user preferences
  loadPreferences() {
    try {
      const enabled = localStorage.getItem('notificationSoundEnabled');
      const volume = localStorage.getItem('notificationVolume');
      
      if (enabled !== null) {
        this.enabled = enabled === 'true';
      }
      if (volume !== null) {
        this.volume = parseFloat(volume);
      }
    } catch (error) {
      console.warn('Could not load notification preferences:', error);
    }
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      console.log('🔊 Audio context initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  // Play notification sound (synthesized beep)
  async playNotification(type = 'new-order', force = false) {
    // Check if enabled
    if (!this.enabled) {
      console.log('🔇 Notifications are muted');
      return false;
    }

    // Prevent sound spam
    const now = Date.now();
    if (!force && now - this.lastPlayTime < this.minInterval) {
      console.log('⏱️ Notification throttled');
      return false;
    }

    // Auto-initialize if not initialized
    if (!this.initialized) {
      const success = this.init();
      if (!success) {
        console.warn('Audio context not available');
        this.playFallbackAlert();
        return false;
      }
    }

    if (!this.audioContext) {
      console.warn('Audio context not available');
      this.playFallbackAlert();
      return false;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        console.log('Resuming suspended audio context...');
        await this.audioContext.resume();
      }

      const startTime = this.audioContext.currentTime;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Apply volume
      const vol = this.volume;

      // Different sounds for different notification types
      switch (type) {
        case 'new-order':
          // Urgent three-tone alert (like a doorbell)
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, startTime);
          oscillator.frequency.setValueAtTime(1000, startTime + 0.15);
          oscillator.frequency.setValueAtTime(800, startTime + 0.3);
          oscillator.frequency.setValueAtTime(1000, startTime + 0.45);
          
          gainNode.gain.setValueAtTime(vol * 0.4, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.7);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.7);
          break;

        case 'order-update':
          // Pleasant two-tone notification
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, startTime);
          oscillator.frequency.setValueAtTime(750, startTime + 0.15);
          
          gainNode.gain.setValueAtTime(vol * 0.3, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.4);
          break;

        case 'delivery-update':
          // Quick chirp
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(700, startTime);
          oscillator.frequency.exponentialRampToValueAtTime(900, startTime + 0.12);
          
          gainNode.gain.setValueAtTime(vol * 0.25, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.25);
          break;

        case 'success':
          // Ascending success chime
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523, startTime); // C5
          oscillator.frequency.setValueAtTime(659, startTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, startTime + 0.2); // G5

          gainNode.gain.setValueAtTime(vol * 0.3, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

          oscillator.start(startTime);
          oscillator.stop(startTime + 0.5);
          break;

        case 'alert':
          // Attention-grabbing alert
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(440, startTime);
          oscillator.frequency.setValueAtTime(330, startTime + 0.1);
          oscillator.frequency.setValueAtTime(440, startTime + 0.2);
          
          gainNode.gain.setValueAtTime(vol * 0.2, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.4);
          break;

        default:
          // Default beep
          oscillator.frequency.setValueAtTime(600, startTime);
          gainNode.gain.setValueAtTime(vol * 0.3, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.3);
      }

      this.lastPlayTime = now;
      console.log(`🔔 Played ${type} notification sound (volume: ${Math.round(vol * 100)}%)`);
      return true;
    } catch (error) {
      console.error('Failed to play notification sound:', error);
      this.playFallbackAlert();
      return false;
    }
  }

  // Fallback alert for when audio context fails
  playFallbackAlert() {
    try {
      // Use console.beep or vibration as fallback
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
        console.log('📳 Vibration fallback triggered');
      }
    } catch (error) {
      console.warn('Fallback alert failed:', error);
    }
  }

  // Convenience methods for specific notification types
  async playNewOrder(force = false) {
    return await this.playNotification('new-order', force);
  }

  async playOrderUpdate(force = false) {
    return await this.playNotification('order-update', force);
  }

  async playDeliveryUpdate(force = false) {
    return await this.playNotification('delivery-update', force);
  }

  async playSuccess(force = false) {
    return await this.playNotification('success', force);
  }

  async playAlert(force = false) {
    return await this.playNotification('alert', force);
  }

  // Enable/disable notifications
  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
    console.log(`🔊 Notifications ${enabled ? 'enabled' : 'disabled'}`);
    return this.enabled;
  }

  // Check if sound is enabled
  isEnabled() {
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('notificationVolume', this.volume.toString());
    console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
    return this.volume;
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Test notification sound
  test(type = 'new-order') {
    console.log(`🧪 Testing ${type} notification sound...`);
    return this.playNotification(type, true);
  }

  // Request notification permission
  async requestBrowserPermission() {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        console.log(`🔔 Browser notification permission: ${permission}`);
        return permission === 'granted';
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    }
    return false;
  }

  // Show browser notification with sound
  async showBrowserNotification(title, options = {}) {
    // Play sound first
    await this.playNotification(options.soundType || 'new-order');

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          requireInteraction: false,
          ...options
        });

        // Auto-close after 5 seconds if not interacted with
        setTimeout(() => {
          try {
            notification.close();
          } catch (e) {
            // Notification might already be closed
          }
        }, 5000);

        return notification;
      } catch (error) {
        console.error('Browser notification failed:', error);
        return null;
      }
    }
    return null;
  }
}

// Export singleton instance
const notificationSoundInstance = new NotificationSound();

// Auto-request browser notification permission on first interaction
if (typeof window !== 'undefined') {
  const requestPermissionOnce = () => {
    notificationSoundInstance.requestBrowserPermission();
    document.removeEventListener('click', requestPermissionOnce);
  };
  document.addEventListener('click', requestPermissionOnce, { once: true });
}

export default notificationSoundInstance;

// Export convenience functions for direct use
export const playNotificationSound = (type, force) => {
  return notificationSoundInstance.playNotification(type, force);
};

export const playNewOrderSound = (force) => {
  return notificationSoundInstance.playNewOrder(force);
};

export const playOrderUpdateSound = (force) => {
  return notificationSoundInstance.playOrderUpdate(force);
};

export const playDeliveryUpdateSound = (force) => {
  return notificationSoundInstance.playDeliveryUpdate(force);
};

export const playSuccessSound = (force) => {
  return notificationSoundInstance.playSuccess(force);
};

export const playAlertSound = (force) => {
  return notificationSoundInstance.playAlert(force);
};

export const setNotificationEnabled = (enabled) => {
  return notificationSoundInstance.setEnabled(enabled);
};

export const isNotificationEnabled = () => {
  return notificationSoundInstance.isEnabled();
};

export const setNotificationVolume = (volume) => {
  return notificationSoundInstance.setVolume(volume);
};

export const getNotificationVolume = () => {
  return notificationSoundInstance.getVolume();
};

export const testNotificationSound = (type) => {
  return notificationSoundInstance.test(type);
};

export const showNotification = (title, options) => {
  return notificationSoundInstance.showBrowserNotification(title, options);
};
