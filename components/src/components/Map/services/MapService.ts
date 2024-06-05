import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';

interface MapServiceOptions {
  mapContainer: HTMLElement;
  drawOptions: any;
  center: [number, number];
  form: any;
  component: any; // Replace 'any' with the appropriate type for your form component if known
  value?: { markers: Array<{ lat: number; lng: number }> }; // Optional initial value for the markers
}

const DEFAULT_MAP_LAYER_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function MapService(options: MapServiceOptions): void {
  const { mapContainer, center, drawOptions, component, value } = options;
  if (mapContainer) {
    const { map, drawnItems } = initializeMap(options);

    //event listener for drawn objects
    map.on('draw:created', function (e) {
      //console.log(e)
      let type = e.type;
      let layer = e.layer;
      drawnItems.addLayer(layer);
      drawnItems.eachLayer((l) => {
        console.log(l);
      });
      updateComponentValue();
    });
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

const initializeMap = (options: MapServiceOptions) => {
  const { mapContainer, center, drawOptions, form } = options;

  const map = L.map(mapContainer).setView(center, 13);
  L.tileLayer(DEFAULT_MAP_LAYER_URL, {
    attribution: DEFAULT_LAYER_ATTRIBUTION,
  }).addTo(map);

  if (form && form[0]?.classList.contains('formbuilder')) {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
  }

  //Initialize Draw Layer
  let drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  //Add Drawing Controllers
  let drawControl = new L.Control.Draw({
    draw: drawOptions,
    edit: {
      featureGroup: drawnItems,
    },
  });
  //Attach Controls to map
  map.addControl(drawControl);
  return { map, drawnItems };
};
