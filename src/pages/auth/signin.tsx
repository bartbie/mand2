import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Container,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { type ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { BrandGithub } from "tabler-icons-react";
import PageContainer from "~/components/PageContainer";
import PageTitle from "~/components/PageTitle";
import { getServerAuthSession } from "~/server/auth";

type SSP = InferGetServerSidePropsType<typeof getServerSideProps>;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  /* eslint-disable */
  const session = await getServerAuthSession(ctx);
  /* eslint-enable */

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

const logOut = (id: string) => () => void signIn(id, { callbackUrl: "/" });

const ProviderButton = ({ provider }: { provider: ClientSafeProvider }) => (
  <div key={provider.name}>
    {/* eslint-disable @typescript-eslint/no-misused-promises */}
    <Button onClick={logOut(provider.id)}>
      {/* eslint-enable @typescript-eslint/no-misused-promises */}
      {provider.name}
    </Button>
  </div>
);

type Unboxed<T> = T extends (infer U)[] ? U : T;

export function GithubButton({
  provider,
  type,
}: Unboxed<Parameters<typeof ProviderButton>> & {
  type: "login" | "register";
}) {
  return (
    <Button
      leftIcon={<BrandGithub size="1rem" />}
      onClick={logOut(provider.id)}
      sx={(theme) => ({
        backgroundColor:
          theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        color: "#fff",
        "&:hover": {
          backgroundColor:
            theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        },
      })}
    >
    {type} with Github
    </Button>
  );
}

export default function SignIn({ providers }: SSP) {
  const [type, toggle] = useToggle<'login' | 'register'>(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  // we currently only use GH
  const ghProvider = (providers as Record<"github", ClientSafeProvider>)[
    "github"
  ];

  return (
    <PageContainer>
      <PageTitle> Welcome to Mand2! </PageTitle>
      {/* <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text> */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text align="center" size="lg" weight={500}> Use your Github account </Text>
        <Group mb="md" mt="md" position="center">
          <GithubButton provider={ghProvider} type={type} />
          {/* {Object.values(providers).map((p, i) => (
            <ProviderButton provider={p} key={i} />
          ))} */}
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form
          onSubmit={form.onSubmit(() => {
            /*//TODO */
          })}
        >
          <Stack>
            {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </PageContainer>
  );
}
