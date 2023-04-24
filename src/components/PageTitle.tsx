import { Title } from "@mantine/core";


export default function PageTitle({ children }: { children: string | number }) {
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
