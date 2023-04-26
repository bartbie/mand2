import { Title } from "@mantine/core";
import { ReactElement } from "react";


export default function PageTitle({ children }: { children?: ReactElement | string | number | string[]} ) {
  return (
    <Title
      order={2}
      size="h1"
      sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily ?? ''}` })}
      weight={900}
      align="center"
    >
        {children}
    </Title>
  );
}
