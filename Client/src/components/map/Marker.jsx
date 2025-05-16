import { useEffect } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

const Marker = ({ map, node, onClick }) => {
  useEffect(() => {
    if (!map || !node) return;

    const marker = L.marker([node.coordinates.y, node.coordinates.x], {
      icon: L.divIcon({
        className: 'rounded-full w-3 h-3',
        html: `<div style="background-color: ${node.type === 'room' ? 'blue' : node.type === 'stair' ? 'red' : 'green'};" class="rounded-full w-3 h-3"></div>`,
      }),
    }).addTo(map);

    marker.bindPopup(node.name);

    if (onClick) {
      marker.on('click', () => onClick(node));
    }

    return () => {
      map.removeLayer(marker);
    };
  }, [map, node, onClick]);

  return null;
};

Marker.propTypes = {
  map: PropTypes.object.isRequired,
  node: PropTypes.shape({
    nodeId: PropTypes.string,
    name: PropTypes.string,
    coordinates: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      floor: PropTypes.number,
    }),
    type: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default Marker;