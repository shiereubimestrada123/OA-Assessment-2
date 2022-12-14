import React, { useEffect, useState } from 'react';

import {
  Box,
  InputLabel,
  FormControl,
  NativeSelect,
  Grid,
} from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import {
  fetchAllPlayers,
  fetchAllTeams,
  fetchSeasonAverages,
} from '../src/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [team, selectedTeam] = useState('');
  const [teams, setTeams] = useState(null);

  const [players, setPlayers] = useState(null);
  const [playersPerTeam, setPlayersPerTeam] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const [seasonAverages, setSeasonAverages] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [season, setSeason] = useState(null);
  console.log({ selectedPlayerId });
  console.log({ team });
  console.log({ season });

  const handleSelectedTeam = (e) => {
    selectedTeam(e.target.value);
    setPlayersPerTeam([]);
  };

  const handleSelectedPlayer = async (e) => {
    setSelectedPlayerId(e.target.value);
  };

  const handleSelectedSeason = async (e) => {
    setSeason(e.target.value);
    const playerSeasonAverages = await fetchSeasonAverages(
      e.target.value,
      selectedPlayerId
    );
    setSeasonAverages(playerSeasonAverages);
  };

  useEffect(() => {
    const getAllPlayers = async () => {
      const players = await fetchAllPlayers();
      setPlayers(players);
    };

    const getAllTeams = async () => {
      const teams = await fetchAllTeams();
      setTeams(teams);
    };

    const getSeasons = () => {
      let currentYear = new Date().getFullYear();
      let minYear = currentYear - 12;
      let years = [];

      while (minYear < currentYear) {
        years.push(minYear++);
      }

      return setSeasons(years.reverse());
    };

    getAllPlayers();
    getAllTeams();
    getSeasons();
  }, []);

  useEffect(() => {
    let tempArr = [];

    const setPlayers = () =>
      players?.map((p) => {
        if (p.team.abbreviation === team) {
          tempArr.push(p);
          setPlayersPerTeam(tempArr);
        }
      });

    setPlayers();
  }, [team]);

  const avg = seasonAverages && Object.assign({}, ...seasonAverages);

  return (
    <div>
      <Grid
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 50,
          marginTop: 50,
        }}
      >
        <Box>
          <FormControl sx={{ width: 300 }}>
            <InputLabel htmlFor='teams'>Teams</InputLabel>
            <NativeSelect
              id='teams'
              defaultValue=''
              onChange={handleSelectedTeam}
            >
              <option value=''></option>
              {teams?.map((team, i) => (
                <option key={team.id} value={team.abbreviation}>
                  {team.abbreviation}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
        <Box>
          <FormControl sx={{ width: 300 }}>
            <InputLabel htmlFor='players'>Players</InputLabel>
            <NativeSelect
              id='players'
              defaultValue=''
              onChange={handleSelectedPlayer}
              disabled={!team}
            >
              <option value=''></option>
              {playersPerTeam?.map((player, i) => (
                <option key={player.id} value={player.id}>
                  {`${player.first_name} ${player.last_name}`}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
        <Box>
          <FormControl sx={{ width: 300 }}>
            <InputLabel htmlFor='seasons'>Seasons</InputLabel>
            <NativeSelect
              id='seasons'
              defaultValue=''
              onChange={handleSelectedSeason}
              disabled={!selectedPlayerId}
            >
              <option value=''></option>
              {seasons?.map((season, i) => (
                <option key={i} value={season}>
                  {season}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
      </Grid>

      <Box sx={{ width: '70%', margin: '0 auto', marginTop: 10 }}>
        {seasonAverages ? (
          <Bar
            data={{
              labels: ['Pts', 'Reb', 'Ast', 'Stl', 'Blk'],
              datasets: [
                {
                  label: 'Season Stats',
                  backgroundColor: [
                    '#76BA99',
                    '#876445',
                    '#CA955C',
                    '#EDDFB3',
                    '#ECB390',
                  ],
                  data: [avg.pts, avg.reb, avg.ast, avg.stl, avg.blk],
                  // data: [30, 10, 12, 5, 3],
                },
              ],
            }}
            options={{
              legend: { display: false },
              title: {
                display: true,
                text: playersPerTeam.map(
                  (player, i) =>
                    `${player.first_name} ${player.last_name} season averages`
                ),
              },
            }}
          />
        ) : null}
      </Box>
    </div>
  );
};

export default App;
