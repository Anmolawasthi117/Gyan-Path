  import { useState, useEffect } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { searchNodes } from '../../redux/slices/nodeSlice';
  import Spinner from '../common/Spinner';
  import SearchResult from './SearchResult';
  import useDebounce from '../../hooks/useDebounce';
  import InputBox from '../common/InputBox';

   const SearchBar = ({ onSelectNode }) => {
     const [query, setQuery] = useState('');
     const debouncedQuery = useDebounce(query, 500);
     const [suggestions, setSuggestions] = useState([]);
     const dispatch = useDispatch();
     const { nodes, status } = useSelector((state) => state.node);

     useEffect(() => {
       if (debouncedQuery.length > 2) {
         dispatch(searchNodes(debouncedQuery));
       } else {
         setSuggestions([]);
       }
     }, [debouncedQuery, dispatch]);

     useEffect(() => {
       if (status === 'succeeded') {
         setSuggestions(nodes);
       }
     }, [nodes, status]);

     const handleSelect = (node) => {
       setQuery(node.name);
       setSuggestions([]);
       onSelectNode(node);
     };

     return (
       <div className="relative">
         <InputBox
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Search for a room..."
         />
         {status === 'loading' && (
           <div className="absolute right-2 top-2">
             <Spinner />
           </div>
         )}
         {suggestions.length > 0 && (
           <ul className="absolute z-30 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
             {suggestions.map((node) => (
               <SearchResult key={node.nodeId} node={node} onSelect={handleSelect} />
             ))}
           </ul>
         )}
       </div>
     );
   };

   export default SearchBar;