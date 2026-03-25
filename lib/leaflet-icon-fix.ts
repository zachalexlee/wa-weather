// Fix for Leaflet marker icons in Next.js

export function fixLeafletIcons() {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  import('leaflet').then((L) => {
    // @ts-ignore
    delete L.default.Icon.Default.prototype._getIconUrl;

    L.default.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  });
}
