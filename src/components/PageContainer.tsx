import { Container } from "@mantine/core";
import { ReactNode } from "react";

export default function PageContainer({children}: {children: ReactNode}) {

    return (
    <Container size={420} my={40}>
        {children}
    </Container>);
}