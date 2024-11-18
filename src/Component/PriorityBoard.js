import React, { useState, useEffect } from 'react';

import { ReactComponent as AddIcon } from '../icons/add.svg';
import { ReactComponent as ThreeDotIcon } from '../icons/3dotmenu.svg';
import { ReactComponent as NoPriority } from '../icons/No-priority.svg';
import { ReactComponent as LowPriority } from '../icons/Img - Low Priority.svg';
import { ReactComponent as MediumPriority } from '../icons/Img - Medium Priority.svg';
import { ReactComponent as HighPriority } from '../icons/Img - High Priority.svg';
import { ReactComponent as Urgent } from '../icons/SVG - Urgent Priority colour.svg';

import { API_URL } from '../config' // Adjust the path based on the file location

const iconMap = {
    CircleAlert: Urgent,
    Ellipsis: NoPriority,
    SignalHigh: HighPriority,
    SignalMedium: MediumPriority,
    SignalLow: LowPriority,
};

const PriorityBoard = ({ sortingOrder }) => {
    // eslint-disable-next-line
    const [tasks, setTasks] = useState([]);
    const [groupedByPriority, setGroupedByPriority] = useState({
        'No priority': [],
        Urgent: [],
        High: [],
        Medium: [],
        Low: [],
    });

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Group tasks by priority
                const grouped = {
                    'No priority': data.tickets.filter(task => task.priority === 0),
                    Urgent: data.tickets.filter(task => task.priority === 1),
                    High: data.tickets.filter(task => task.priority === 2),
                    Medium: data.tickets.filter(task => task.priority === 3),
                    Low: data.tickets.filter(task => task.priority === 4),
                };
                setTasks(data.tickets);
                setGroupedByPriority(grouped);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    // Function to sort tasks dynamically
    const getSortedTasks = (tasks) => {
        if (sortingOrder === 'title-asc') {
            return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortingOrder === 'priority-desc') {
            return [...tasks].sort((a, b) => b.priority - a.priority); // Assuming tasks have a `priority` field
        }
        return tasks; // Default order if no sortingOrder provided
    };

    const Column = ({ title, tasks, icolor, icon }) => {
        const IconComponent = iconMap[icon]; // Resolve icon dynamically

        return (
            <div className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent color={icolor} size={16} />}
                        <h3 className="font-medium">{title}</h3>
                        <span className="bg-gray-200 px-2 rounded-full text-sm">{tasks.length}</span>
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
                <div className="space-y-3">
                    {getSortedTasks(tasks).map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </div>
        );
    };

    const TaskCard = ({ task }) => (
        <div className="task-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 gappp-2">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">{task.id}</span>
            </div>
            <div className="task-header">
                <input type="checkbox" id="huey" name="drone" value="huey" className="task-radio" />
                <h3 className="font-medium mb-2">{task.title}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border-rectangle">
                    {task.tag.join(', ')}
                </span>
            </div>
        </div>
    );

    return (
        <div className="feature-board-container">
            <div className="flex gap-6 overflow-x-auto pb-4">
                <Column
                    title="No priority"
                    tasks={groupedByPriority['No priority']}
                    icolor="gray"
                    icon="Ellipsis"
                />
                <Column
                    title="Urgent"
                    tasks={groupedByPriority.Urgent}
                    icolor="red"
                    icon="CircleAlert"
                />
                <Column
                    title="High"
                    tasks={groupedByPriority.High}
                    icolor="#808080"
                    icon="SignalHigh"
                />
                <Column
                    title="Medium"
                    tasks={groupedByPriority.Medium}
                    icolor="#808080"
                    icon="SignalMedium"
                />
                <Column
                    title="Low"
                    tasks={groupedByPriority.Low}
                    icolor="#808080"
                    icon="SignalLow"
                />
            </div>
        </div>
    );
};

export default PriorityBoard;