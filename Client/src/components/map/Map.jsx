import { useEffect, useRef } from 'react';
   import { useSelector, useDispatch } from 'react-redux';
   import L from 'leaflet';
   import 'leaflet/dist/leaflet.css';
   import { setUserPosition } from '../../redux/slices/routeSlice';
   import socket from '../../services/socket';
   import Marker from './Marker';
   import Polyline from './Polyline';
   import UserMarker from '../navigation/UserMarker';

   // Fix Leaflet icon issue
   delete L.Icon.Default.prototype._getIconUrl;
   L.Icon.Default.mergeOptions({
     iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
   });

   const Map = ({ onNodeSelect }) => {
     const dispatch = useDispatch();
     const mapRef = useRef(null);
     const { nodes } = useSelector((state) => state.node);
     const { route, userPosition } = useSelector((state) => state.route);
     const { currentFloor } = useSelector((state) => state.floor);

     // Initialize map
     useEffect(() => {
       if (!mapRef.current) {
         mapRef.current = L.map('map', {
           crs: L.CRS.Simple,
           minZoom: -2,
           maxZoom: 2,
         }).setView([0, 0], 0);

         // Use a simple tile layer or custom image
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '© OpenStreetMap',
         }).addTo(mapRef.current);
       }
     }, []);

     // Render route
     const routeCoords = route
       .filter((step) => step.floor === currentFloor)
       .map((step) => [step.y, step.x]);

     // Fit bounds
     useEffect(() => {
       if (!mapRef.current || !nodes.length) return;
       const bounds = nodes
         .filter((node) => node.coordinates.floor === currentFloor)
         .map((node) => [node.coordinates.y, node.coordinates.x]);
       if (bounds.length > 0) {
         mapRef.current.fitBounds(bounds);
       }
     }, [nodes, currentFloor]);

     // Listen for userPosition
     useEffect(() => {
       socket.on('userPosition', (data) => {
         if (data.floor === currentFloor) {
           dispatch(setUserPosition(data.coordinates));
         }
       });
       return () => socket.off('userPosition');
     }, [currentFloor, dispatch]);

     return (
       <div id="map" className="h-full w-full">
         {nodes
           .filter((node) => node.coordinates.floor === currentFloor)
           .map((node) => (
             <Marker key={node.nodeId} map={mapRef.current} node={node} onClick={onNodeSelect} />
           ))}
         {routeCoords.length > 0 && (
           <Polyline map={mapRef.current} coordinates={routeCoords} />
         )}
         {userPosition && (
           <UserMarker map={mapRef.current} position={userPosition} />
         )}
       </div>
     );
   };

   export default Map;