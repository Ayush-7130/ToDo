import React, { useState, useEffect } from 'react';

import { ReactComponent as AddIcon } from '../icons/add.svg';
import { ReactComponent as ThreeDotIcon } from '../icons/3dotmenu.svg';
import { ReactComponent as NoPriority } from '../icons/No-priority.svg';
import { ReactComponent as LowPriority } from '../icons/Img - Low Priority.svg';
import { ReactComponent as MediumPriority } from '../icons/Img - Medium Priority.svg';
import { ReactComponent as HighPriority } from '../icons/Img - High Priority.svg';
import { ReactComponent as Urgent } from '../icons/SVG - Urgent Priority colour.svg';

import { ReactComponent as Backlog } from '../icons/Backlog.svg';
import { ReactComponent as inprogress } from '../icons/in-progress.svg';
import { ReactComponent as Todo } from '../icons/To-do.svg';
import { ReactComponent as Done } from '../icons/Done.svg';
import { ReactComponent as Cancelled } from '../icons/Cancelled.svg';

import { API_URL } from '../config' // Adjust the path based on the file location

const iconMap = {
    Undo2: Backlog,
    Circle: Todo,
    LoaderCircle: inprogress,
    CircleCheck: Done,
    CircleX: Cancelled,
};

const HomeScreen = ({ sortingOrder }) => {
    const [tasks, setTasks] = useState({
        Backlog: [],
        Todo: [],
        InProgress: [],
        Done: [],
        Canceled: [],
    });

    // Fetch data from the API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Process API data into columns
                const columnData = {
                    Backlog: data.tickets.filter(task => task.status === 'Backlog'),
                    Todo: data.tickets.filter(task => task.status === 'Todo'),
                    InProgress: data.tickets.filter(task => task.status === 'In progress'),
                    Done: data.tickets.filter(task => task.status === 'Done'),
                    Canceled: data.tickets.filter(task => task.status === 'Canceled'),
                };

                setTasks(columnData);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    // Function to sort tasks based on sortingOrder prop
    const getSortedTasks = (tasks) => {
        if (sortingOrder === 'title-asc') {
            return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortingOrder === 'priority-desc') {
            return [...tasks].sort((a, b) => b.priority - a.priority); // Assuming tasks have a `priority` field
        }
        return tasks; // Default order if no sortingOrder is provided
    };

    const Column = ({ title, tasks, count, icolor, icon }) => {
        const IconComponent = iconMap[icon]; // Map string to actual icon component

        return (
            <div className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 gap-6">
                        {IconComponent && <IconComponent color={icolor} size={16} />}
                        <h3 className="font-medium">{title}</h3>
                        <span className="bg-gray-200 px-2 rounded-full text-sm">{count}</span>
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
                    {getSortedTasks(tasks).map(task => (
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
            <h4 className="font-medium mb-2">{task.title}</h4>
            <div className="flex items-center gap-2 gappp-4">
                <div className='priority-based-icon-show border-rectangle'>
                    {task.priority === 0 && <NoPriority />}
                    {task.priority === 1 && <LowPriority />}
                    {task.priority === 2 && <MediumPriority />}
                    {task.priority === 3 && <HighPriority />}
                    {task.priority === 4 && <Urgent />}
                </div>
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
                    title="Backlog"
                    tasks={tasks.Backlog}
                    count={tasks.Backlog.length}
                    icolor="#FF0000"
                    icon="Undo2"
                />
                <Column
                    title="Todo"
                    tasks={tasks.Todo}
                    count={tasks.Todo.length}
                    icolor="#808080"
                    icon="Circle"
                />
                <Column
                    title="In Progress"
                    tasks={tasks.InProgress}
                    count={tasks.InProgress.length}
                    icolor="#D5BD3B"
                    icon="LoaderCircle"
                />
                <Column
                    title="Done"
                    tasks={tasks.Done}
                    count={tasks.Done.length}
                    icolor="#0000FF"
                    icon="CircleCheck"
                />
                <Column
                    title="Canceled"
                    tasks={tasks.Canceled}
                    count={tasks.Canceled.length}
                    icolor="#808080"
                    icon="CircleX"
                />
            </div>
        </div>
    );
};

export default HomeScreen;
