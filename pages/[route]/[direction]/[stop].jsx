import { useRouter } from "next/router";

import Layout from "@/components/Layout/Layout";

const StopPage = ({ data }) => {
  const router = useRouter();
  const { stop, direction, route } = router.query;

  const { stops, alerts, departures } = data;
  console.log(data);

  return (
    <Layout>
      <h2>{stops[0].description}</h2>
      <hr />
      {alerts && alerts.length > 0 && (
        <>
          <div>
            {alerts.map(({ alert_text, stop_closed }) => (
              <p>
                {stop_closed && <span>STOP CLOSED</span>} {alert_text}
              </p>
            ))}
          </div>
          <hr />
        </>
      )}
      {departures && departures.length > 0 ? (
        <div>
          {departures.map(({ actual, departure_text, description }) => (
            <p>
              {actual && <span>*</span>} {description} {departure_text}
            </p>
          ))}
        </div>
      ) : (
        <div>no departures at this time.</div>
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ params }) => {
  const api = "https://svc.metrotransittest.org/nextripv2";
  const data = await fetch(
    `${api}/${params.route}/${params.direction}/${params.stop}`
  ).then((res) => res.json());

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
};

export default StopPage;
