import React, { useState, useEffect } from 'react';
import { 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon, 
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { playNotificationSound, setNotificationEnabled, setNotificationVolume } from '../../utils/notificationSound';

const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Load saved preferences
    const savedEnabled = localStorage.getItem('notificationSoundEnabled');
    const savedVolume = localStorage.getItem('notificationVolume');
    
    if (savedEnabled !== null) {
      setEnabled(savedEnabled === 'true');
    }
    if (savedVolume !== null) {
      setVolume(Math.round(parseFloat(savedVolume) * 100));
    }
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    setNotificationEnabled(newEnabled);
    
    if (newEnabled) {
      setTestResult('✅ Notifications enabled!');
      playNotificationSound('success');
    } else {
      setTestResult('🔇 Notifications muted');
    }
    
    setTimeout(() => setTestResult(''), 2000);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setNotificationVolume(newVolume / 100);
  };

  const testSound = (type) => {
    playNotificationSound(type);
    setTestResult(`🔊 Playing ${type} sound...`);
    setTimeout(() => setTestResult(''), 2000);
  };

  const soundTypes = [
    { type: 'new-order', label: '🆕 New Order', description: 'Urgent 3-tone alert' },
    { type: 'order-update', label: '📦 Order Update', description: 'Gentle 2-tone notification' },
    { type: 'delivery-update', label: '🚚 Delivery Update', description: 'Quick chirp' },
    { type: 'success', label: '✅ Success', description: 'Ascending chime' },
    { type: 'alert', label: '⚠️ Alert', description: 'Attention grabber' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BellIcon className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
            <p className="text-sm text-gray-600">Manage your sound notifications</p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            enabled 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {enabled ? (
            <>
              <SpeakerWaveIcon className="w-5 h-5" />
              <span>Enabled</span>
            </>
          ) : (
            <>
              <SpeakerXMarkIcon className="w-5 h-5" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      {testResult && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-center">
          {testResult}
        </div>
      )}

      {/* Volume Control */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Volume</label>
          <span className="text-sm text-gray-600">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          disabled={!enabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Quiet</span>
          <span>Loud</span>
        </div>
      </div>

      {/* Test Sounds */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Notification Sounds</h3>
        <div className="grid gap-3">
          {soundTypes.map(({ type, label, description }) => (
            <button
              key={type}
              onClick={() => testSound(type)}
              disabled={!enabled}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                enabled
                  ? 'border-gray-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{label.split(' ')[0]}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{label.split(' ').slice(1).join(' ')}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              </div>
              <SpeakerWaveIcon className="w-5 h-5 text-orange-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Receive audio alerts for order updates in real-time</li>
              <li>• Different sounds for different types of notifications</li>
              <li>• Settings are saved and persist across sessions</li>
              <li>• Works alongside browser notifications for maximum visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
