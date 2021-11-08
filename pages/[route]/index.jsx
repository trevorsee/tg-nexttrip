import { useRouter } from "next/router";

import Layout from "@/components/Layout/Layout";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

export const RoutePage = ({ data }) => {
  const router = useRouter();
  const { route } = router.query;

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full max-w-2xl">
          {data.map(({ direction_id, direction_name }) => (
            <ButtonLink
              key={direction_id}
              href={`/${route}/${direction_id}`}
              label={direction_name}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const api = "https://svc.metrotransittest.org/nextripv2";
  const routes = await fetch(`${api}/routes`).then((res) => res.json());

  return {
    paths: routes.map(({ route_id }) => ({ params: { route: route_id } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const api = "https://svc.metrotransittest.org/nextripv2";
  const data = await fetch(`${api}/directions/${params.route}`).then((res) =>
    res.json()
  );

  if (!data) {
    return {
      notFound: true,
    };
  }

  const day = 60 * 60 * 24;

  return {
    props: { data },
    revalidate: day,
  };
};

export default RoutePage;
