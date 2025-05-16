import { useEffect } from 'react';
   import { useSelector, useDispatch } from 'react-redux';
   import { nextStep, exitNavigation, setUserPosition } from '../../redux/slices/routeSlice';
   import socket from '../../services/socket';
   import useGeolocation from '../../hooks/useGeolocation';
   import RouteStep from './RouteStep';
   import Button from '../common/Button';

   const Navigation = () => {
     const dispatch = useDispatch();
     const { route, currentStep, isNavigating, userPosition } = useSelector((state) => state.route);
     const { currentFloor } = useSelector((state) => state.floor);
     const { position, error } = useGeolocation();

     // Handle geolocation updates
     useEffect(() => {
       if (position) {
         dispatch(setUserPosition(position));
         socket.emit('userPosition', { coordinates: position, floor: currentFloor });

         if (route[currentStep]) {
           const stepNode = route[currentStep];
           const distance = Math.hypot(
             position[0] - stepNode.y,
             position[1] - stepNode.x
           );
           if (distance < 5 && stepNode.floor === currentFloor) {
             dispatch(nextStep());
           }
         }
       }
     }, [position, currentStep, route, currentFloor, dispatch]);

     // Listen for userPosition
     useEffect(() => {
       socket.on('userPosition', (data) => {
         if (data.floor === currentFloor) {
           dispatch(setUserPosition(data.coordinates));
         }
       });
       return () => socket.off('userPosition');
     }, [currentFloor, dispatch]);

     // Exit navigation
     useEffect(() => {
       if (isNavigating && currentStep >= route.length) {
         dispatch(exitNavigation());
       }
     }, [currentStep, route, isNavigating, dispatch]);

     if (!isNavigating || !route[currentStep]) {
       return null;
     }

     const progress = ((currentStep + 1) / route.length) * 100;

     return (
       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-20">
         <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-bold">Navigation</h3>
           <Button variant="danger" onClick={() => dispatch(exitNavigation())}>
             End Navigation
           </Button>
         </div>
         <RouteStep
           step={route[currentStep]}
           index={currentStep}
           isActive={true}
           totalSteps={route.length}
         />
         <div className="mt-2">
           <div className="w-full bg-gray-200 rounded-full h-2.5">
             <div
               className="bg-blue-500 h-2.5 rounded-full"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
           <p className="text-sm text-gray-600 mt-1">
             Step {currentStep + 1} of {route.length}
           </p>
         </div>
         {error && (
           <p className="text-red-500 text-sm mt-2">Geolocation error: {error}</p>
         )}
       </div>
     );
   };

   export default Navigation;