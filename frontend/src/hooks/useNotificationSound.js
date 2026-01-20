import { useEffect, useCallback, useState } from 'react';
import notificationSound from '../utils/notificationSound';

/**
 * React Hook for managing notification sounds
 * 
 * @example
 * const { playNewOrder, isEnabled, setEnabled, volume, setVolume } = useNotificationSound();
 * 
 * // Play notification
 * playNewOrder();
 * 
 * // Toggle notifications
 * setEnabled(false);
 * 
 * // Adjust volume
 * setVolume(0.8);
 */
export const useNotificationSound = () => {
  const [isEnabled, setIsEnabledState] = useState(notificationSound.isEnabled());
  const [volume, setVolumeState] = useState(notificationSound.getVolume());
  const [isInitialized, setIsInitialized] = useState(notificationSound.initialized);

  // Play new order notification
  const playNewOrder = useCallback((force = false) => {
    return notificationSound.playNewOrder(force);
  }, []);

  // Play order update notification
  const playOrderUpdate = useCallback((force = false) => {
    return notificationSound.playOrderUpdate(force);
  }, []);

  // Play delivery update notification
  const playDeliveryUpdate = useCallback((force = false) => {
    return notificationSound.playDeliveryUpdate(force);
  }, []);

  // Play success notification
  const playSuccess = useCallback((force = false) => {
    return notificationSound.playSuccess(force);
  }, []);

  // Play alert notification
  const playAlert = useCallback((force = false) => {
    return notificationSound.playAlert(force);
  }, []);

  // Play custom notification
  const play = useCallback((type, force = false) => {
    return notificationSound.playNotification(type, force);
  }, []);

  // Enable/disable notifications
  const setEnabled = useCallback((enabled) => {
    notificationSound.setEnabled(enabled);
    setIsEnabledState(enabled);
  }, []);

  // Set volume (0.0 to 1.0)
  const setVolume = useCallback((vol) => {
    notificationSound.setVolume(vol);
    setVolumeState(vol);
  }, []);

  // Test notification
  const test = useCallback((type = 'new-order') => {
    return notificationSound.test(type);
  }, []);

  // Request browser notification permission
  const requestPermission = useCallback(async () => {
    return await notificationSound.requestBrowserPermission();
  }, []);

  // Show browser notification with sound
  const showNotification = useCallback(async (title, options = {}) => {
    return await notificationSound.showBrowserNotification(title, options);
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      notificationSound.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return {
    // Play functions
    playNewOrder,
    playOrderUpdate,
    playDeliveryUpdate,
    playSuccess,
    playAlert,
    play,
    
    // Settings
    isEnabled,
    setEnabled,
    volume,
    setVolume,
    
    // Utilities
    test,
    requestPermission,
    showNotification,
    isInitialized
  };
};

export default useNotificationSound;
