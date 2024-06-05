import { Components } from 'formiojs';
import MapService from './services/MapService';

const FieldComponent = (Components as any).components.field;

const CENTER: [number, number] = [48.41939025932759, -123.37029576301576];

export default class Component extends (FieldComponent as any) {
  static schema(...extend: any[]) {
    return FieldComponent.schema({
      type: 'map',
      label: 'Map',
      key: 'map',
      input: true,
      ...extend,
    });
  }

  static get builderInfo() {
    return {
      title: 'Map',
      group: 'basic',
      icon: 'map',
      weight: 70,
      schema: Component.schema(),
    };
  }

  render() {
    return super.render(`
      <div id="mapContainer" style="height:400px; z-index:1;"></div>
    `);
  }

  attach(element: HTMLElement) {
    const superAttach = super.attach(element);
    this.loadMap();
    return superAttach;
  }

  loadMap() {
    const mapContainer = document.getElementById('mapContainer') as HTMLElement;
    const drawOptions = {
      circlemarker: false,
      polygon: false,
      polyline: false,
      rectangle: false,
    };
    const value = this.getValue(); // Get the initial value if set
    MapService({
      mapContainer,
      drawOptions,
      center: CENTER,
      component: this,
      value,
    });
  }

  getValue() {
    return this.dataValue || { markers: [] }; // Default to empty markers array if no value is set
  }

  setValue(
    value: { markers: Array<{ lat: number; lng: number }> },
    flags?: any
  ) {
    this.dataValue = value;
    if (this.map) {
      // If the map is already initialized, update the marker positions
      const drawnItems = this.map.drawnItems;
      drawnItems.clearLayers();
      value.markers.forEach((markerData) => {
        const marker = L.marker([markerData.lat, markerData.lng], {
          draggable: true,
        }).addTo(this.map);
        drawnItems.addLayer(marker);
        marker.on('dragend', () => {
          this.updateComponentValue(drawnItems);
        });
      });
    }
  }

  updateComponentValue(drawnItems: L.FeatureGroup) {
    const markers = [];
    drawnItems.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const latLng = layer.getLatLng();
        markers.push({ lat: latLng.lat, lng: latLng.lng });
      }
    });
    this.setValue({ markers });
  }
}

// Components.addComponent('map', Component);
export {};
