import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';

interface MapServiceOptions {
  mapContainer: HTMLElement;
  drawOptions: any;
  center: [number, number];
  component: any; // Replace 'any' with the appropriate type for your form component if known
  value?: { markers: Array<{ lat: number; lng: number }> }; // Optional initial value for the markers
}

export default function MapService(options: MapServiceOptions): void {
  const { mapContainer, center, drawOptions, component, value } = options;
  console.log('options', options);
  if (mapContainer) {
    const map = L.map(mapContainer).setView(center, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (
      component.form &&
      component.form[0]?.classList.contains('formbuilder')
    ) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    }

    // Initialize Draw Layer
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Add Drawing Controllers
    const drawControl = new L.Control.Draw({
      draw: drawOptions,
      edit: {
        featureGroup: drawnItems,
      },
    });

    // Attach Controls to map
    map.addControl(drawControl);

    // Event listener for drawn objects
    map.on('draw:created', function (e) {
      const type = e.type;
      const layer = e.layer;

      drawnItems.addLayer(layer);
      updateComponentValue();
    });

    // Function to update the form component value
    const updateComponentValue = () => {
      const markers = [];
      drawnItems.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const latLng = layer.getLatLng();
          markers.push({ lat: latLng.lat, lng: latLng.lng });
        }
      });
      if (component) {
        component.setValue({ markers });
      }
    };

    // Set initial markers if value is provided
    if (value && value.markers) {
      value.markers.forEach((markerData) => {
        const marker = L.marker([markerData.lat, markerData.lng], {
          draggable: true,
        }).addTo(map);
        drawnItems.addLayer(marker);
        marker.on('dragend', updateComponentValue);
      });
    }

    // Event listener for each marker's dragend event
    drawnItems.on('layeradd', (e) => {
      const layer = e.layer;
      if (layer instanceof L.Marker) {
        layer.on('dragend', updateComponentValue);
      }
    });
  }
}
