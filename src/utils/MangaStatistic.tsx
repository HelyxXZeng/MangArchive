import axios from "axios";

const getStatsApi = async (slug: any) => {
  const baseUrl = "https://mangapi.alse.workers.dev/api/";

  const resp = await axios({
    method: "GET",
    url: `${baseUrl}/statistics/manga/${slug}`,
  });

  // const { rating, follows } = resp.data.statistics[slug];

  // console.log(
  //     'Mean Rating:', rating.average, '\n' +
  //     'Bayesian Rating:', rating.bayesian, '\n' +
  //     'Follows:', follows
  // );
  return resp.data.statistics[slug];
};

export { getStatsApi };
