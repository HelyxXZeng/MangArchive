import axios from 'axios';

const getStatsApi = async (slug: any) => {
    const baseUrl = 'https://api.mangadex.org';

    const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/statistics/manga/${slug}`
    });

    // const { rating, follows } = resp.data.statistics[slug];

    // console.log(
    //     'Mean Rating:', rating.average, '\n' +
    //     'Bayesian Rating:', rating.bayesian, '\n' +
    //     'Follows:', follows
    // );
    return resp.data.statistics[slug];
}

export { getStatsApi };