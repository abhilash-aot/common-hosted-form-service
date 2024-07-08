import common from '../../Common/Simple.edit.data';
export default {
  key: 'data',
  components: [
    ...common,
    {
      label: 'Marker Type ',
      values: [
        {
          label: 'Point Marker',
          value: 'marker',
        },
        {
          label: 'Circle',
          value: 'circle',
        },
      ],
      defaultValue: 'marker',
      key: 'markerType',
      type: 'simpleradios',
      input: true,
    },
    {
      label: 'Set Default Center',
      tableView: false,
      markerType: 'marker',
      numPoints: 1,
      defaultZoom: 5,
      readOnlyMap: false,
      key: 'map',
      type: 'map',
      input: true,
    },
    {
      label: 'How many Points per Submission?',
      key: 'numPoints',
      type: 'simplenumber',
      defaultValue: 1,
      input: true,
    },

    {
      label: 'Default Zoom Level',
      description:
        'Zoom Levels are from 0 (Most zoomed out) to 18 (most zoomed in).',
      defaultValue: 13,
      delimiter: false,
      requireDecimal: false,
      validate: {
        isUseForCopy: false,
        min: 0,
        max: 18,
      },
      key: 'defaultZoom',
      type: 'simplenumber',
      input: true,
    },
    {
      label: 'Read Only Map',
      description:
        'This allows for the user to view and scroll the map, but not add any input',
      key: 'readOnlyMap',
      type: 'simplecheckbox',
      input: true,
    },
  ],
};
