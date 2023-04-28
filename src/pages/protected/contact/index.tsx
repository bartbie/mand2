import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Button,
  LoadingOverlay,
  Box,
  Paper,
  Container,
  Overlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import PageContainer from "~/components/PageContainer";
import PageTitle from "~/components/PageTitle";
import { IconCheck, IconX } from "@tabler/icons-react";
import LoggedInHeader from "~/components/LoggedInHeader";
import { api } from "~/utils/api";
import { z } from "zod";
import { ReactNode } from "react";

// NOTE this needs to be declared either on client-side (meaning here), or possibly in separate folder.
export const ContactMessageSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  subject: z.string().trim().min(1),
  message: z.string(),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

type MessageMutation = ReturnType<typeof api.contact.postMessage.useMutation>;
type State = "success" | "loading" | "initial";

function title(state: State) {
  switch (state) {
    case "success":
      return "Success!";
    case "loading":
      return "Verifying the message...";
    case "initial":
      return "Get in touch";
  }
}

function button(state: State) {
  switch (state) {
    case "success":
      return "Thank you for support";
    case "loading":
      return "loading...";
    case "initial":
      return "Send message";
  }
}

async function notif(mut: MessageMutation) {
// FIXME: notifications in contact page
  if (mut.isSuccess) {
    notifications.show({
      icon: <IconCheck />,
      message: "We will contact you shortly",
      color: "teal",
    });
  }
  if (mut.error) {
    notifications.show({
      icon: <IconX />,
      message: "Something failed!",
      color: "red",
    });
  }
}

function ContactForm() {
  const mut = api.contact.postMessage.useMutation();
  const form = useForm<ContactMessage>({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: zodResolver(ContactMessageSchema),
  });
  const state: State = mut.isLoading
    ? "loading"
    : mut.isSuccess
    ? "success"
    : "initial";
  
  if (mut.isSuccess) console.log(mut.data)
  return (
    <>
      <PageTitle>{title(state)}</PageTitle>
      <form
        onSubmit={form.onSubmit(async (msg) => {
          mut.mutate(msg);
          await notif(mut);
        })}
      >
        <Container pos="relative">
          {mut.isSuccess && <Overlay blur={2} color="#ffffff" />}
          <LoadingOverlay visible={mut.isLoading} overlayBlur={2} />
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
        </Container>

        <Group position="center" mt="xl">
          <Button
            type="submit"
            size="md"
            disabled={mut.isLoading || mut.isSuccess}
          >
            {button(state)}
          </Button>
        </Group>
      </form>
    </>
  );
}

export default function Contact() {
  return (
    <>
      <LoggedInHeader />
      <PageContainer size={800}>
        <Paper pos="relative" withBorder shadow="md" p={50} mt="xl" radius="md">
          <ContactForm />
        </Paper>
      </PageContainer>
    </>
  );
}
