import { useEffect, useState } from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import Map from '../components/map/Map';
   import SearchBar from '../components/search/SearchBar';
   import Sidebar from '../components/sidebar/Sidebar';
   import FloorSelector from '../components/sidebar/FloorSelector';
   import Navigation from '../components/navigation/Navigation';
   import { fetchNodes, updateNode } from '../redux/slices/nodeSlice';
   import socket from '../services/socket';

   const Home = () => {
     const dispatch = useDispatch();
     const { isNavigating } = useSelector((state) => state.route);
     const [sidebarOpen, setSidebarOpen] = useState(false);

     useEffect(() => {
       dispatch(fetchNodes());
       socket.on('nodeUpdate', (updatedNode) => {
         dispatch(updateNode(updatedNode));
       });
       return () => socket.off('nodeUpdate');
     }, [dispatch]);

     const handleNodeSelect = (node) => {
       // Placeholder for setting start/end node
     };

     return (
       <div className="relative h-screen w-full">
         {!isNavigating && (
           <div className="absolute top-4 left-4 right-4 z-10 flex items-center space-x-4">
             <div className="flex-1">
               <SearchBar onSelectNode={handleNodeSelect} />
             </div>
             <FloorSelector />
           </div>
         )}
         <Sidebar onToggle={setSidebarOpen} />
         <div
           className={`h-full transition-all duration-300 ${
             sidebarOpen ? 'ml-80' : 'ml-12'
           }`}
         >
           <Map onNodeSelect={handleNodeSelect} />
         </div>
         <Navigation />
       </div>
     );
   };

   export default Home;