import './App.css';
import HomeScreen from './Component/HomeScreen';
import FeatureBoard from './Component/FeatureBoard';
import PriorityBoard from './Component/PriorityBoard';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { ReactComponent as DisplayIcon } from './icons/Display.svg';

// Example components for routing
const StatusComponent = ({ sortingOrder }) => <HomeScreen sortingOrder={sortingOrder} />;
const UserComponent = ({ sortingOrder }) => <FeatureBoard sortingOrder={sortingOrder} />;
const PriorityComponent = ({ sortingOrder }) => <PriorityBoard sortingOrder={sortingOrder} />;

function Navbar({ sortingOrder, setSortingOrder, selectedGroup, setSelectedGroup }) {
    const [isDisplayOpen, setIsDisplayOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDisplayOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGroupingChange = (e) => {
        const value = e.target.value;
        setSelectedGroup(value); // Update the selected group state
        if (value) {
            navigate(`/${value}`); // Navigate to the corresponding route
        }
    };

    const handleOrderingChange = (e) => {
        const value = e.target.value;
        if (value) {
            setSortingOrder(value); // Update the sorting order state
        }
    };

    return (
        <div className="kanban-container">
            <div className="board-controls" ref={dropdownRef}>
                <div className="display-dropdown border-rectangle">
                    <button
                        className={`display-button ${isDisplayOpen ? 'active' : ''}`}
                        onClick={() => setIsDisplayOpen(!isDisplayOpen)}
                    >
                        <DisplayIcon />
                        <span>Display</span>
                        <ChevronDown className={`chevron ${isDisplayOpen ? 'rotate' : ''}`} />
                    </button>

                    {isDisplayOpen && (
                        <div className="display-dropdown-content">
                            <div className="dropdown-item">
                                <span className="dropdown-label">Grouping</span>
                                <select
                                    className="custom-select"
                                    value={selectedGroup} // Bind the value to the selectedGroup state
                                    onChange={handleGroupingChange}
                                >
                                    <option value="user">User</option>
                                    <option value="status">Status</option>
                                    <option value="priority">Priority</option>
                                </select>
                            </div>

                            <div className="dropdown-item">
                                <span className="dropdown-label">Ordering</span>
                                <select
                                    className="custom-select"
                                    value={sortingOrder} // Bind the value to the sortingOrder state
                                    onChange={handleOrderingChange}
                                >
                                    <option value="title-asc">Title</option>
                                    <option value="priority-desc">Priority</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const App = () => {
    const [sortingOrder, setSortingOrder] = useState('title-asc'); // Default sorting order
    const [selectedGroup, setSelectedGroup] = useState('user'); // Default grouping

    return (
        <Router>
            <Navbar
                sortingOrder={sortingOrder}
                setSortingOrder={setSortingOrder}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
            />
            <Routes>
                <Route path="/" element={<UserComponent sortingOrder={sortingOrder} />} />
                <Route path="/user" element={<UserComponent sortingOrder={sortingOrder} />} />
                <Route path="/status" element={<StatusComponent sortingOrder={sortingOrder} />} />
                <Route path="/priority" element={<PriorityComponent sortingOrder={sortingOrder} />} />
            </Routes>
        </Router>
    );
};

export default App;
