import { Title } from "@mantine/core";
import { ReactNode } from "react";


export default function PageTitle({ children }: { children: string | number }) {
  return (
    <Title
      order={2}
      size="h1"
      sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}` })}
      weight={900}
      align="center"
    >
        {children}
    </Title>
  );
}
