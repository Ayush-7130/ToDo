import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { MoreHorizontal, MessageSquare, Plus } from 'lucide-react';

import { ReactComponent as AddIcon } from '../icons/add.svg';
import { ReactComponent as ThreeDotIcon } from '../icons/3dotmenu.svg';
import { ReactComponent as NoPriority } from '../icons/No-priority.svg';
import { ReactComponent as LowPriority } from '../icons/Img - Low Priority.svg';
import { ReactComponent as MediumPriority } from '../icons/Img - Medium Priority.svg';
import { ReactComponent as HighPriority } from '../icons/Img - High Priority.svg';
import { ReactComponent as Urgent } from '../icons/SVG - Urgent Priority colour.svg';

import { API_URL } from '../config' // Adjust the path based on the file location

const FeatureBoard = ({ sortingOrder }) => {
    // eslint-disable-next-line
    const [features, setFeatures] = useState([]);
    // eslint-disable-next-line
    const [users, setUsers] = useState([]);
    const [groupedFeatures, setGroupedFeatures] = useState({});

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                setFeatures(data.tickets);
                setUsers(data.users);

                // Group features by assignee (userId)
                const grouped = data.tickets.reduce((acc, feature) => {
                    const user = data.users.find(user => user.id === feature.userId)?.name || 'Unassigned';
                    if (!acc[user]) {
                        acc[user] = [];
                    }
                    acc[user].push(feature);
                    return acc;
                }, {});
                setGroupedFeatures(grouped);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Sort features based on sortingOrder prop
    const getSortedFeatures = (features) => {
        if (sortingOrder === 'title-asc') {
            return [...features].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortingOrder === 'priority-desc') {
            return [...features].sort((a, b) => b.priority - a.priority); // Assuming features have a priority field
        }
        return features; // Default order if no sortingOrder provided
    };

    const TaskCard = ({ feature }) => (
        <div className="task-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 gappp-2">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">{feature.id}</span>
            </div>
            <div className="task-header">
                <input type="checkbox" id="huey" name="drone" value="huey" className="task-radio" />
                <h3 className="font-medium mb-2">{feature.title}</h3>
            </div>
            <div className="flex items-center gap-2 gappp-4">
                <div className='priority-based-icon-show border-rectangle'>
                    {feature.priority === 0 && <NoPriority />}
                    {feature.priority === 1 && <LowPriority />}
                    {feature.priority === 2 && <MediumPriority />}
                    {feature.priority === 3 && <HighPriority />}
                    {feature.priority === 4 && <Urgent />}
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border-rectangle">
                    {feature.tag.join(', ')}
                </span>
            </div>
        </div>
    );

    return (
        <div className="feature-board-container padd-up">
            <div className="flex gap-6 overflow-x-auto pb-4">
                {Object.entries(groupedFeatures).map(([assignee, userFeatures]) => (
                    <div key={assignee} className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="avatar">
                                    <span className="avatar-text">
                                        {assignee.split(' ').map((name) => name[0]).join('')}
                                    </span>
                                </div>
                                <div className="name-container">
                                    <span className="user-name">{assignee}</span>
                                    <span className="task-count">{userFeatures.length}</span>
                                </div>
                            </div>
                            <div className="left-align-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <AddIcon />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ThreeDotIcon />
                                </button>
                            </div>
                        </div>

                        {/* Tasks Stack */}
                        <div className="space-y-3">
                            {getSortedFeatures(userFeatures).map((feature) => (
                                <TaskCard key={feature.id} feature={feature} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureBoard;
