'use client';
import EditableQuestion, { Question } from '@/components/EditableQuestion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Center, Group, HoverCard, Modal, Paper, Popover, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBlockquote, IconCursorText, IconListCheck, IconListDetails, IconMail, IconNumber123, IconPhone, IconPlus } from '@tabler/icons-react';
import { useEffect, useId, useState } from 'react';
import { modals } from '@mantine/modals';
import { v4 as uuidv4 } from 'uuid';
import { Survey, createSurvey } from '@/services/survey.service';
import { useRouter } from 'next/navigation';

export default function Create() {
    const surveyData: Question[] = [
        {
            title: 'Question title',
            id: uuidv4(),
            type: 'radio',
            required: true,
            responses: [
                'One fish',
                'Two fish',
                'Red fish',
                'Blue fish'
            ]
        }
    ];

    const [questions, setQuestions] = useState(surveyData);
    const [modelOpened, { open, close }] = useDisclosure(false);
    const router = useRouter();

    const confirmDeleteModal = (id: string, data: undefined) => modals.openConfirmModal({
        title: 'Are you sure?',
        children: (
            <Text size="sm">
                Removing this question is irreversible.
            </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onCancel: () => { },
        onConfirm: () => updateQuestion(id, data),
    });

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        const newQuestions: Question[] = [...questions];
        const [removed] = newQuestions.splice(source.index, 1);
        newQuestions.splice(destination.index, 0, removed);
        setQuestions(newQuestions);
    };

    const addQuestion = (type: string) => {
        const newData = [...questions];

        newData.push({
            title: 'Question title',
            type,
            required: true,
            id: uuidv4(),
            responses: [
                '',
                ''
            ]
        });

        close();
        setQuestions(newData);
    }

    const confirmQuestionAction = (id: string, data: Question | undefined) => {
        if (!data) {
            return confirmDeleteModal(id, data);
        }

        updateQuestion(id, data);
    }

    const updateQuestion = (id: string, data: Question | undefined) => {
        const newData = [...questions];

        if (data === undefined) {
            const cleaned = newData.filter(x => x.id !== id);
            setQuestions(cleaned);
            return;
        }

        const questionOfInterest = newData.findIndex(q => q.id === id);
        newData[questionOfInterest] = data;
        setQuestions(newData);
    }

    const submit = () => {
        const survey: Survey = {title: "Survey", questions};

        fetch('/api/survey', { method: 'POST', body: JSON.stringify(survey)}).then(res => {
            if (res.status === 200) {
                res.json().then(json => {
                    router.push(json.redirectUrl);
                });
            }
        });
    };

    return (
        <>
            <Modal opened={modelOpened} onClose={close} title="Add Question" size="auto">
                <ScrollArea>
                    <Text><b>Text</b></Text>
                    <Group justify='flex-end'>
                        <IconCursorText />
                        <Text>Accept a short text answer from your respondent.</Text>
                        <Button onClick={() => addQuestion('text')}>Add</Button>
                    </Group>
                    <Group mt="8" justify='flex-end'>
                        <IconBlockquote />
                        <Text>Accept a long text answer from your respondent.</Text>
                        <Button onClick={() => addQuestion('textarea')}>Add</Button>
                    </Group>
                    <Text><b>Data</b></Text>
                    <Group mt="8" justify='flex-end'>
                        <IconMail />
                        <Text>Accept an email address from your respondent.</Text>
                        <Button onClick={() => addQuestion('email')}>Add</Button>
                    </Group>
                    <Group mt="8" justify='flex-end'>
                        <IconPhone />
                        <Text>Accept a phone number from your respondent.</Text>
                        <Button onClick={() => addQuestion('phone')}>Add</Button>
                    </Group>
                    <Group mt="8" justify='flex-end'>
                        <IconNumber123 />
                        <Text>Accept a number from your respondent.</Text>
                        <Button onClick={() => addQuestion('number')}>Add</Button>
                    </Group>
                    <Text><b>Lists</b></Text>
                    <Group mt="8" justify='flex-end'>
                        <IconListCheck />
                        <Text>Let your respondent choose one answer from a list.</Text>
                        <Button onClick={() => addQuestion('radio')}>Add</Button>
                    </Group>
                    <Group mt="8" justify='flex-end'>
                        <IconListDetails />
                        <Text>Let your respondent choose multiple answers from a list.</Text>
                        <Button onClick={() => addQuestion('multiselect')}>Add</Button>
                    </Group>
                </ScrollArea>
            </Modal>
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
                            <Text><b>Survey</b></Text>
                            <ScrollArea>
                                {questions.map((item, index) => (
                                    <EditableQuestion key={item.id} data={item} updateQuestion={confirmQuestionAction} index={index} />
                                ))}
                                {provided.placeholder}
                                <Center>
                                    <Tooltip label="Add question" openDelay={250}>
                                        <Button fullWidth color='gray' onClick={open}><IconPlus /></Button>
                                    </Tooltip>
                                </Center>
                            </ScrollArea>
                        </Paper>
                    )}
                </Droppable>
                {questions.length > 0 &&
                    <Button onClick={submit}>Create</Button>
                }
                {questions.length == 0 &&
                    <Tooltip label="Survey cannot be created without any questions, silly!" openDelay={500}>
                        <Button disabled onClick={submit}>Create</Button>
                    </Tooltip>
                }
            </DragDropContext>
        </>
    );
}
