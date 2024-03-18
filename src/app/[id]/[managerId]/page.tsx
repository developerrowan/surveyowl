'use client';
import { Question } from '@/components/EditableQuestion';
import { Survey } from '@/services/survey.service';
import { ActionIcon, Alert, Box, Button, Center, Checkbox, Container, CopyButton, Divider, Group, Input, Loader, LoadingOverlay, NumberInput, Radio, Stack, Text, TextInput, Textarea, Title, Tooltip, Transition } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import NotFound from '@/components/NotFound';
import { IconCalendar, IconCheck, IconConfetti, IconCopy } from '@tabler/icons-react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

export interface QuestionResponse {
    questionId: string;
    values: string[];
}

export default function SurveyView({ params, searchParams }: { params: { id: string, managerId: string }, searchParams: { fromCreation: boolean } }) {
    const [survey, setSurvey] = useState({ questions: [] as Question[] } as Survey);
    const [loaded, setLoaded] = useState(false);
    const [found, setFound] = useState(true);
    const [success, setSuccess] = useState(false);
    const { width, height } = useWindowSize();
    const [displayConfetti, setDisplayConfetti] = useState(false);

    if (params.id.length > 6) {
        return <p>Survey not found.</p>;
    }

    useEffect(() => {
        console.log(searchParams.fromCreation);

        fetch(`/api/survey/${params.id}/${params.managerId}`, { method: 'GET' }).then((res) => {
            if (res.status === 404) {
                setLoaded(true);
                return setFound(false);
            }

            if (searchParams.fromCreation)
                setDisplayConfetti(true);

            res.json().then(survey => {
                setSurvey(JSON.parse(survey));
                setLoaded(true);
            });
        });
    }, []);

    return (
        <>
            {loaded && found &&
                <Container fluid>
                    <Center>
                        <Stack justify="center" align="center">
                            <Title order={1}>{`"${survey.title}"`}</Title>
                            <Title order={4}><IconCalendar /> CREATED_AT_DATE_TODO</Title>
                        </Stack>
                    </Center>
                    {searchParams.fromCreation &&
                        <>
                            <Confetti
                                width={width}
                                height={height}
                                numberOfPieces={displayConfetti ? 400 : 0}
                                recycle={false}
                                onConfettiComplete={confetti => {
                                    setDisplayConfetti(false);
                                    confetti!.reset();
                                }}
                                />
                            <Center mt="lg" mb="lg">
                                <Alert variant="light" color="green" title="Nice!" withCloseButton icon={<IconConfetti />}>
                                    <Stack justify="center" align="center">
                                        <Text>Your survey has been created!</Text>
                                        <Text>This is where you can manage your survey.</Text>
                                        <Text>Come back here anytime using your <b>manager link</b> to see responses, edit your survey, and generate reports.</Text>
                                    </Stack>
                                </Alert>
                            </Center>
                        </>
                    }

                    <Center>
                        <Stack justify="center" align="center">
                            <Title order={3}>Share your Survey</Title>
                            <Group>
                                <TextInput
                                    disabled
                                    rightSection={
                                        <CopyButton value={`https://surveyowl.xyz/${params.id}`} timeout={3000}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? `URL copied to clipboard!` : `Copy URL`} openDelay={500}>
                                                    <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                        {copied ? <IconCheck /> : <IconCopy />}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    }
                                    value={`https://surveyowl.xyz/${params.id}`} />
                            </Group>
                            <Title order={3} mt="lg">Your Manager Link</Title>
                            <Group>
                                <TextInput
                                    disabled
                                    rightSection={
                                        <CopyButton value={`https://surveyowl.xyz/${params.id}/${params.managerId}`} timeout={3000}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? `URL copied to clipboard!` : `Copy URL`} openDelay={500}>
                                                    <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                        {copied ? <IconCheck /> : <IconCopy />}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    }
                                    value={`https://surveyowl.xyz/${params.id}/${params.managerId}`} />
                            </Group>
                            <Text c="red">Important: <b>DO NOT</b> share this link. This is used to view survey responses and manage your survey.</Text>
                        </Stack>
                    </Center>
                    <Center>
                        <Title order={3} mt="lg">Survey Responses</Title>
                    </Center>
                    <DataTable
                        withTableBorder
                        borderRadius="sm"
                        withColumnBorders
                        striped
                        highlightOnHover
                        // 👇 provide data
                        records={[
                            { id: 1, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
                            // more records...
                        ]}
                        // 👇 define columns
                        columns={[
                            {
                                accessor: 'id',
                                // 👇 this column has a custom title
                                title: '#',
                                // 👇 right-align column
                                textAlign: 'right',
                            },
                            { accessor: 'name' },
                            {
                                accessor: 'party',
                                // 👇 this column has custom cell data rendering
                                render: ({ party }) => (
                                    <Box fw={700} c={party === 'Democratic' ? 'blue' : 'red'}>
                                        {party.slice(0, 3).toUpperCase()}
                                    </Box>
                                ),
                            },
                            { accessor: 'bornIn' },
                        ]}
                        // 👇 execute this callback when a row is clicked
                        onRowClick={({ record: { name, party, bornIn } }) =>
                            showNotification({
                                title: `Clicked on ${name}`,
                                message: `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`,
                                withBorder: true,
                            })
                        }
                    />
                </Container>
            }
            {!found &&
                <NotFound />
            }
            {!loaded &&
                <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "md", blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
            }
        </>
    );
}