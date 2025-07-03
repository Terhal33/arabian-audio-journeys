
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export const configureMobileApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#F5F2E8' });
    } catch (error) {
      console.log('Mobile configuration error:', error);
    }
  }
};

export const handleBackButton = () => {
  // Handle Android back button
  if (Capacitor.getPlatform() === 'android') {
    document.addEventListener('backbutton', (e) => {
      e.preventDefault();
      // Custom back button logic
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }
};

export const preventZoomOnInputs = () => {
  // Prevent zoom on input focus for iOS
  const addMaximumScaleToMetaViewport = () => {
    const el = document.querySelector('meta[name=viewport]');
    if (el !== null) {
      let content = el.getAttribute('content');
      let re = /maximum\-scale=[0-9\.]+/g;
      
      if (re.test(content)) {
        content = content.replace(re, 'maximum-scale=1.0');
      } else {
        content = [content, 'maximum-scale=1.0'].join(', ');
      }
      
      el.setAttribute('content', content);
    }
  };

  const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

  // iOS Safari
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    disableIosTextFieldZoom();
  }
};
