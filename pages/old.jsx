import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useQueryString from "use-query-string";
import {
  merge,
  keyBy,
  groupBy,
  values,
  flatten,
  map,
  find,
  trimStart,
} from "lodash";

export const Home = ({ data }) => {
  const router = useRouter();
  const updateQuery = (path) => {
    router.push(path, undefined, { shallow: true });
  };

  const [{ route, direction, stop }, setQuery] = useQueryString(
    {
      pathname: router.pathname,
      search: trimStart(router.asPath, router.pathname),
    },
    updateQuery
  );

  useEffect(() => {
    setQuery({ direction: "", stop: "" });
  }, [route, setQuery]);

  useEffect(() => {
    setQuery({ stop: "" });
  }, [direction, setQuery]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Bus Routes:</h1>

        <div>
          <label htmlFor="route">
            Pick a route:
            <select
              id="route"
              value={route}
              onChange={(e) => setQuery({ route: e.currentTarget.value })}
            >
              <option disabled selected value="">
                select an option
              </option>
              {data.map(({ route_id, route_label }) => (
                <option key={route_id} value={route_id}>
                  {route_label}
                </option>
              ))}
            </select>
          </label>

          {/* TODO: disable state instead of no-render */}
          {route && (
            <label htmlFor="direction">
              Pick a direction:
              <select
                id="direction"
                value={direction}
                onChange={(e) => setQuery({ direction: e.currentTarget.value })}
              >
                <option disabled selected value="">
                  select an option
                </option>
                {find(data, ["route_id", route]).directions.map(
                  ({ direction_id, direction_name }) => (
                    <option key={direction_id} value={direction_id}>
                      {direction_name}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          {/* TODO: disable state instead of no-render */}
          {route && direction && (
            <label htmlFor="stop">
              Pick a stop:
              <select
                id="stop"
                value={stop}
                onChange={(e) => setQuery({ stop: e.currentTarget.value })}
              >
                <option disabled selected value="">
                  select an option
                </option>
                {keyBy(
                  find(data, ["route_id", route]).directions,
                  "direction_id"
                )[direction].stops.map(({ place_code, description }) => (
                  <option key={place_code} value={place_code}>
                    {description}
                  </option>
                ))}
              </select>
            </label>
          )}

          {route && direction && stop && (
            <Link href={`/${route}/${direction}/${stop}`}>
              <a>Go</a>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  const api = "https://svc.metrotransittest.org/nextripv2";

  const routes = await fetch(`${api}/routes`).then((res) => res.json());

  const directions = routes.map(({ route_id }) =>
    fetch(`${api}/directions/${route_id}`)
      .then((res) => res.json())
      .then((json) => ({ route_id, directions: json }))
  );
  const directionsData = await Promise.all(directions);

  const stops = flatten(
    directionsData.map(({ route_id, directions }) =>
      directions.map(({ direction_id }) =>
        fetch(`${api}/stops/${route_id}/${direction_id}`)
          .then((res) => res.json())
          .then((json) => ({ route_id, direction_id, stops: json }))
      )
    )
  );
  const stopsData = await Promise.all(stops);

  const groupedStops = groupBy(stopsData, "route_id");
  const mergedDirections = map(directionsData, ({ route_id, directions }) => {
    const stops = groupedStops[route_id];
    const merged = merge(
      keyBy(stops, "direction_id"),
      keyBy(directions, "direction_id")
    );
    return { route_id, directions: values(merged) };
  });

  const data = values(
    merge(keyBy(routes, "route_id"), keyBy(mergedDirections, "route_id"))
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

export default Home;
