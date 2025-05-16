import PropTypes from 'prop-types';

const SearchResult = ({ node, onSelect }) => {
  return (
    <li
      onClick={() => onSelect(node)}
      className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between"
    >
      <span>{node.name}</span>
      <span className="text-gray-500">Floor {node.coordinates.floor}</span>
    </li>
  );
};

SearchResult.propTypes = {
  node: PropTypes.shape({
    nodeId: PropTypes.string,
    name: PropTypes.string,
    coordinates: PropTypes.shape({
      floor: PropTypes.number,
    }),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SearchResult;