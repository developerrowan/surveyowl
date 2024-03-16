import Image from "next/image";
import styles from "./page.module.css";
import prisma from '@/lib/prisma';
import { Center, Container, Button, Divider } from '@mantine/core';

export default function Home() {
  return (
    <Container>
      <Center>
        <Button variant="filled">Create Survey</Button>
      </Center>
      <Center>
      <Divider my="xs" size="lg" label="OR" labelPosition="center" />
      </Center>
    </Container>
  );
}
