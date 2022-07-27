import axios from 'axios';

const urlPlayers = 'https://www.balldontlie.io/api/v1/players';
const urlTeams = 'https://www.balldontlie.io/api/v1/teams';
const urlSeasonAverages = 'https://www.balldontlie.io/api/v1/season_averages';

export const fetchAllPlayers = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(urlPlayers);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllTeams = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(urlTeams);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSeasonAverages = async (year, playerId) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `${urlSeasonAverages}/?season=${year}&player_ids[]=${playerId}`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
