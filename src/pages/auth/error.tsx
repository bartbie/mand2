import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
  rem,
} from "@mantine/core";
import PageTitle from "~/components/PageTitle";
import Link from "next/link";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return { props: { query: ctx.query } };
}

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export default function Error({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  const error_msg =
    ("error" in query && (query["error"] as string[]).join()) || undefined;

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <PageTitle>{error_msg && `Error: ${error_msg}`}</PageTitle>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        Unfortunately, this is only a 404 page. There may be an error with
        Github authentication services if they are unused for too long. Try to
        sign in again.
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md">
          <Link href={"/"}>Take me back to home page</Link>
        </Button>
      </Group>
    </Container>
  );
}
