"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Checkbox,
  Input,
  Paper,
  Text,
  Textarea,
  Radio,
  TextInput,
  Button,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  Icon123,
  IconBlockquote,
  IconCursorText,
  IconListCheck,
  IconListDetails,
  IconMail,
  IconNumber123,
  IconPhone,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { ReactNode, RefObject, useEffect, useId, useState } from "react";

export interface Question {
  title: string;
  type: string;
  required: boolean;
  id: string;
  responses?: string[];
}

interface EditableQuestionProps {
  data: Question;
  updateQuestion: Function;
  index: number;
}

function getIcon(type: string): ReactNode {
  switch (type) {
    case "text":
      return <IconCursorText />;
    case "textarea":
      return <IconBlockquote />;
    case "email":
      return <IconMail />;
    case "phone":
      return <IconPhone />;
    case "number":
      return <IconNumber123 />;
    case "radio":
      return <IconListCheck />;
    case "multiselect":
      return <IconListDetails />;
  }
}

function Response() {
  const id: string = useId();
  const [value, setValue] = useState("Type your response here");

  return (
    <TextInput
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}

export default function EditableQuestion(props: EditableQuestionProps) {
  const id: string = useId();
  const questionId: string = props.data.id;
  const [responses, setResponses] = useState(props.data.responses || []);
  const [title, setTitle] = useState(props.data.title);
  const [required, setRequired] = useState(props.data.required);
  const [question, setQuestion] = useState(props.data);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const newData = [...responses];
    const [removed] = newData.splice(source.index, 1);
    newData.splice(destination.index, 0, removed);
    setResponses(newData);
  };

  useEffect(() => {
    setResponses(props.data.responses || []);
    setTitle(props.data.title);
    setQuestion(props.data);
  }, []);

  useEffect(() => {
    props.updateQuestion(questionId, question);
  }, [question]);

  useEffect(() => {
    setQuestion(getQuestionObject());
  }, [title]);

  useEffect(() => {
    setQuestion(getQuestionObject());
  }, [required]);

  useEffect(() => {
    setQuestion(getQuestionObject());
  }, [responses]);

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);

    setQuestion(getQuestionObject());
  };

  const deleteQuestion = () => {
    props.updateQuestion(questionId, undefined);
  };

  const updateResponse = (responseIndex: number, newResponse: string) => {
    const newData = [...responses];
    newData[responseIndex] = newResponse;
    setResponses(newData);
  };

  const deleteResponse = (responseIndex: number) => {
    const newData = [...responses];
    newData.splice(responseIndex, 1);
    setResponses(newData);
  };

  const addItem = () => {
    const newData = [...responses];
    newData.push("");

    setResponses(newData);
  };

  const getQuestionObject = () => {
    return {
      title,
      type: props.data.type,
      id: questionId,
      required,
      responses,
    } as Question;
  };

  return (
    <Draggable
      key={`${props.data.id}-${props.index}`}
      draggableId={id}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`${id}-droppable`}>
              {(provided, snapshot) => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  p="md"
                  shadow="md"
                  radius="md"
                  withBorder
                >
                  <Group>
                    <TextInput
                      value={title}
                      onChange={(e) => updateTitle(e.currentTarget.value)}
                      leftSectionPointerEvents="none"
                      leftSection={getIcon(props.data.type)}
                    ></TextInput>
                    <Checkbox
                      label="Required"
                      checked={required}
                      onChange={(e) => setRequired(e.currentTarget.checked)}
                    ></Checkbox>
                    <ActionIcon
                      tabIndex={-1}
                      variant="transparent"
                      color="red"
                      onClick={deleteQuestion}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                  {(props.data.type === "radio" ||
                    props.data.type === "multiselect") && (
                    <>
                      {responses.map((item, index) => (
                        <Draggable
                          key={`${id}-${index}`}
                          draggableId={`${id}-${index}`}
                          index={index}
                        >
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
                              <Group>
                                <TextInput
                                  placeholder="Type your response here"
                                  value={item}
                                  onChange={(e) =>
                                    updateResponse(index, e.currentTarget.value)
                                  }
                                />
                                {responses.length > 2 && (
                                  <ActionIcon
                                    tabIndex={-1}
                                    variant="transparent"
                                    color="red"
                                    onClick={() => deleteResponse(index)}
                                  >
                                    <IconTrash />
                                  </ActionIcon>
                                )}
                                {responses.length <= 2 && (
                                  <Tooltip
                                    label="Question must have at least two responses"
                                    openDelay={500}
                                  >
                                    <ActionIcon
                                      tabIndex={-1}
                                      variant="transparent"
                                      color="red"
                                      disabled
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <IconTrash />
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </Group>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                    </>
                  )}
                  {props.data.type !== "radio" &&
                    props.data.type !== "multiselect" && (
                      <>
                        {props.data.type === "text" && (
                          <Input type="text"></Input>
                        )}
                        {props.data.type === "email" && (
                          <Input type="email"></Input>
                        )}
                        {props.data.type === "phone" && (
                          <Input type="tel"></Input>
                        )}
                        {props.data.type === "number" && (
                          <Input type="number"></Input>
                        )}
                        {props.data.type === "textarea" && (
                          <Textarea></Textarea>
                        )}
                      </>
                    )}
                  {provided.placeholder}
                  {(props.data.type === "radio" ||
                    props.data.type === "multiselect") && (
                    <Button onClick={addItem}>
                      <IconPlus />
                    </Button>
                  )}
                </Paper>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </Draggable>
  );
}
