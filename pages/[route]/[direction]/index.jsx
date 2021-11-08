import { useRouter } from "next/router";

import Layout from "@/components/Layout/Layout";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

const DirectionPage = ({ data }) => {
  const router = useRouter();
  const { direction, route } = router.query;

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full max-w-2xl">
          {data.map(({ place_code, description }) => (
            <ButtonLink
              href={`/${route}/${direction}/${place_code}`}
              label={description}
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

  const directions = routes.map(({ route_id }) =>
    fetch(`${api}/directions/${route_id}`)
      .then((res) => res.json())
      .then((json) => ({ route_id, directions: json }))
  );
  const directionsData = await Promise.all(directions);

  return {
    paths: directionsData.reduce((total, current) => {
      current.directions.forEach((dir) =>
        total.push({
          params: {
            route: current.route_id,
            direction: String(dir.direction_id),
          },
        })
      );
      return total;
    }, []),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const api = "https://svc.metrotransittest.org/nextripv2";
  const data = await fetch(
    `${api}/stops/${params.route}/${params.direction}`
  ).then((res) => res.json());

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

export default DirectionPage;
