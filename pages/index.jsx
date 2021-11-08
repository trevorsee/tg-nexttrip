import { useRouter } from "next/router";
import { trimStart } from "lodash";
import useQueryString from "use-query-string";

import Layout from "@/components/Layout/Layout";
import ButtonLink from "@/components/ButtonLink/ButtonLink";
import { filterByQuery } from "@/utils/filterByQuery";

export const Home = ({ data }) => {
  const router = useRouter();
  const updateQuery = (path) => {
    router.replace(path, undefined, { shallow: true });
  };
  const [{ search }, setQuery] = useQueryString(
    {
      pathname: router?.pathname,
      search: trimStart(router?.asPath, router?.pathname),
    },
    updateQuery
  );

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <label>
          Search:
          <input
            value={search}
            onChange={(e) => setQuery({ search: e.target.value })}
            type="search"
          />
        </label>

        <div className="flex flex-col w-full max-w-2xl">
          {filterByQuery(data, search, "route_label")?.map(
            ({ route_id, route_label }) => (
              <ButtonLink
                key={route_id}
                href={`/${route_id}`}
                label={route_label}
              />
            )
          )}
        </div>
      </main>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const api = "https://svc.metrotransittest.org/nextripv2";
  const data = await fetch(`${api}/routes`).then((res) => res.json());

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

export default Home;
