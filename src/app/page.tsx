'use client';
import { Center, Container, Button, Divider, Stack, Text, Group, TextInput, rem, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const findSurvey = () => {
    fetch(`/api/survey/${searchValue}`, { method: 'GET'}).then(res => {
      if (res.status === 404)
        setError(`Could not find a survey with ID '${searchValue}'`);
      else if (res.status === 200)
        router.push(`/${searchValue}`);
      else
        setError('Something went wrong. Please try again');
    });
  };

  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <Stack>
        <Center>
          <Button variant="filled" size="md">Create Survey</Button>
        </Center>
        <Center>
          <Text size="xl" fw={400}>OR</Text>
        </Center>
        <Center>
          <Stack>
            <Center>
              <Text>Enter a survey's ID:</Text>
            </Center>
            <Group>
              <TextInput 
                radius="xl"
                size="md"
                placeholder="Enter survey ID"
                value={searchValue}
                error={error}
                onChange={(e) => {setError('');setSearchValue(e.currentTarget.value)}}
                rightSectionWidth={42}
                leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                rightSection={
                  <ActionIcon size={32} radius="xl" color={"blue"} variant="filled" onClick={findSurvey}>
                    <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                  </ActionIcon>
                } />
            </Group>
          </Stack>
        </Center>
      </Stack>
    </Center>
  );
}
