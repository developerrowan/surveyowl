"use client";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { IconArrowRight, IconChecklist, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const findSurvey = () => {
    if (searchValue.length < 6 || searchValue.length > 6)
      return setError("Survey ID must be exactly 6 characters.");

    fetch(`/api/survey/${searchValue}`, { method: "GET" }).then((res) => {
      if (res.status === 404)
        setError(`Could not find a survey with ID '${searchValue}'`);
      else if (res.status === 200) router.push(`/${searchValue}`);
      else setError("Something went wrong. Please try again");
    });
  };

  return (
    <Center style={{ width: "100%", height: "100vh" }}>
      <Stack justify="center" align="center">
        <Title mb="lg" order={1}>
          Survey
          <IconChecklist size={30} alignmentBaseline="alphabetic" />
          wl
        </Title>
        <Link href={"/create"}>
          <Button variant="filled" size="md">
            Create survey
          </Button>
        </Link>
        <Text size="xl" fw={400}>
          OR
        </Text>
        <Stack justify="center" align="center">
          <Text>Enter a survey&apos;s ID:</Text>
          <Group>
            <TextInput
              radius="xl"
              size="md"
              placeholder="Enter survey ID"
              value={searchValue}
              error={error}
              onChange={(e) => {
                setError("");
                setSearchValue(e.currentTarget.value);
              }}
              rightSectionWidth={42}
              leftSection={
                <IconSearch
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              }
              rightSection={
                <ActionIcon
                  size={32}
                  radius="xl"
                  color={"blue"}
                  variant="filled"
                  onClick={findSurvey}
                >
                  <IconArrowRight
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              }
            />
          </Group>
        </Stack>
      </Stack>
    </Center>
  );
}
