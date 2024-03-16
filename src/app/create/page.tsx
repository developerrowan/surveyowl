'use client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Paper, Text } from '@mantine/core';
import { useId, useState } from 'react';

export default function Create() {
    const MY_DATA = {
        group: {
            operator: 'and',
            conditions: [
                {
                    id: useId(),
                    source: 'program',
                    sourceIds: ['{{program_id}}'],
                    data: 'cpp',
                    operator: 'lte',
                    target: 10,
                },
                {
                    id: useId(),
                    group: {
                        operator: 'or',
                        conditions: [
                            {
                                id: useId(),
                                source: 'knowledge',
                                sourceIds: ['math', 'history'],
                                data: 'cpc',
                                operator: 'gte',
                                target: 5,
                            },
                        ],
                    },
                },
            ],
        },
    };

    const [data, setData] = useState(MY_DATA);

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        const newData = [...data.group.conditions];
        const [removed] = newData.splice(source.index, 1);
        newData.splice(destination.index, 0, removed);
        setData({ group: { ...data.group, conditions: newData } });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='myDroppableId'>
                {(provided, snapshot) => (
                    <Paper
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        p="md"
                        shadow="md"
                        radius="md"
                        withBorder
                    >
                        <Text><b>Question title</b></Text>
                        {data.group.conditions.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <Paper
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        p="xs"
                                        radius="sm"
                                        shadow="md"
                                        withBorder
                                    >
                                        <Text>RuleCondition</Text>
                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Paper>
                )}
            </Droppable>
        </DragDropContext>
    );
}
