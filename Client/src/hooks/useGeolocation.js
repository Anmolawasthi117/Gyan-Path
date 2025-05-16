import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../services/socket';
import { fetchNodes } from '../redux/slices/nodeSlice';

const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { nodes } = useSelector((state) => state.node);
  const { currentFloor } = useSelector((state) => state.floor);

  const snapToNode = (lat, lng) => {
    if (!nodes.length) return null;

    // Map lat/lng to x,y (placeholder calibration for PoC)
    // Replace with actual mapping (e.g., building GPS bounds to x,y)
    const x = lng * 1000; // Example scaling
    const y = lat * 1000;

    return nodes
      .filter((node) => node.coordinates.floor === currentFloor)
      .reduce(
        (closest, node) => {
          const dist = Math.hypot(
            node.coordinates.x - x,
            node.coordinates.y - y
          );
          return dist < closest.dist ? { node, dist } : closest;
        },
        { node: null, dist: Infinity }
      ).node;
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const node = snapToNode(latitude, longitude);
        if (node) {
          const newPosition = [node.coordinates.y, node.coordinates.x];
          setPosition(newPosition);
          socket.emit('userPosition', {
            nodeId: node.nodeId,
            coordinates: newPosition,
            floor: node.coordinates.floor,
          });
        } else {
          setError('No node found for current position');
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  useEffect(() => {
    dispatch(fetchNodes());
    const cleanup = startTracking();
    return cleanup;
  }, [dispatch]);

  return { position, error, startTracking };
};

export default useGeolocation;