import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFloor } from '../../store/slices/floorSlice.js';

const FloorSelector = () => {
  const dispatch = useDispatch();
  const { currentFloor, floors } = useSelector((state) => state.floor);

  // Assume floors are derived from nodes (or hardcoded for PoC)
  const availableFloors = floors.length > 0 ? floors : [1, 2, 3]; // Placeholder

  return (
    <div className="bg-white border rounded p-2">
      <select
        value={currentFloor}
        onChange={(e) => dispatch(setCurrentFloor(Number(e.target.value)))}
        className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableFloors.map((floor) => (
          <option key={floor} value={floor}>
            Floor {floor}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FloorSelector;