import { useEffect } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

const UserMarker = ({ map, position }) => {
  useEffect(() => {
    if (!map || !position) return;

    const marker = L.marker(position, {
      icon: L.divIcon({
        className: 'rounded-full w-4 h-4',
        html: '<div class="bg-red-500 rounded-full w-4 h-4"></div>',
      }),
    }).addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position]);

  return null;
};

UserMarker.propTypes = {
  map: PropTypes.object.isRequired,
  position: PropTypes.arrayOf(PropTypes.number),
};

export default UserMarker;