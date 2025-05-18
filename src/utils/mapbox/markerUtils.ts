
// Create a marker element
export const createMarkerElement = (isPremium?: boolean, isActive?: boolean): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'mapbox-marker';
  el.style.width = '25px';
  el.style.height = '25px';
  el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
  el.style.backgroundSize = 'contain';
  el.style.backgroundRepeat = 'no-repeat';
  el.style.cursor = 'pointer';
  
  // If the point is premium, add a special style
  if (isPremium) {
    el.style.filter = 'hue-rotate(40deg) saturate(2)';
  }
  
  // Highlight active tour
  if (isActive) {
    el.style.filter = 'hue-rotate(180deg) brightness(1.2)';
    el.style.transform = 'scale(1.2)';
    el.style.zIndex = '10';
  }
  
  return el;
};

// Create a user location marker
export const createUserLocationMarker = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'user-marker';
  el.innerHTML = `
    <div style="position: relative;">
      <div style="position: absolute; transform: translate(-50%, -50%); width: 16px; height: 16px; background-color: white; border: 3px solid #3b82f6; border-radius: 50%; box-shadow: 0 0 0 2px white;"></div>
      <div style="position: absolute; transform: translate(-50%, -50%); width: 32px; height: 32px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
    </div>
  `;
  
  return el;
};

// Add CSS for map markers
export const addMarkerStyles = (): void => {
  if (!document.getElementById('mapbox-marker-styles')) {
    const style = document.createElement('style');
    style.id = 'mapbox-marker-styles';
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      
      .mapbox-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }
};
