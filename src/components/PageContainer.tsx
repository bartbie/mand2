import { Container } from "@mantine/core";
import { ReactNode } from "react";

export default function PageContainer({
  children,
  size = 420,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <Container size={size} my={40}>
      {children}
    </Container>
  );
}
