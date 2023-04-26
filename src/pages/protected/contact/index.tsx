import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  Notification,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import PageContainer from "~/components/PageContainer";
import PageTitle from "~/components/PageTitle";
import { IconCheck } from "@tabler/icons-react";
import LoggedInHeader from "~/components/LoggedInHeader";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const showNotif = () => {
  // TODO
  notifications.show({
    icon: <IconCheck />,
    message: "We will contact you.",
    color: "teal",
  });
};

export default function Contact() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  return (
    <>
      <LoggedInHeader />
      <PageContainer>
        <PageTitle> Get in touch </PageTitle>
        <form onSubmit={form.onSubmit(showNotif)}>
          <SimpleGrid
            cols={2}
            mt="xl"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <TextInput
              label="Name"
              placeholder="Your name"
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              name="email"
              variant="filled"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <TextInput
            label="Subject"
            placeholder="Subject"
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps("subject")}
          />
          <Textarea
            mt="md"
            label="Message"
            placeholder="Your message"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps("message")}
          />

          <Group position="center" mt="xl">
            <Button type="submit" size="md">
              Send message
            </Button>
          </Group>
        </form>
      </PageContainer>
    </>
  );
}
