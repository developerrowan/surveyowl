import { Button, Center, Stack, Title } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center style={{ width: "100%", height: "100vh" }}>
      <Stack justify="center" align="center">
        <Title order={1}>404: Not Found</Title>
        <Link href={"/"}>
          <Button size="lg">Go home</Button>
        </Link>
      </Stack>
    </Center>
  );
}
