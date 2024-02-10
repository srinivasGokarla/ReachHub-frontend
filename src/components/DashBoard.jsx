import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const Dashboard = () => {
  const [token, setToken] = useState('');
  const navigation = useNavigate();
  const [topPlayers, setTopPlayers] = useState([]);

  const handleLogout = async () => {
    if (localStorage.getItem('authToken') !== null) {
      try {
        const response = await fetch('https://backend-uvlx.onrender.com/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          localStorage.removeItem('authToken');
          localStorage.clear();
          console.log('Successfully logged out');
          navigation('/');
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error.message);
      }
    }
  };

  useEffect(() => {
    const checkToken = () => {
      let homeCheck = window.location.href.split("/");
      if (localStorage.getItem('authToken') === null && homeCheck[3] === "dashboard") {
        navigation('/');
      } else if (localStorage.getItem("authToken")) {
        const decodedToken = jwtDecode(localStorage.getItem("authToken"));
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          console.log('Token has expired');
          localStorage.removeItem('authToken');
          navigation('/');
        } else {
          setToken(localStorage.getItem("authToken"));
        }
      }
    };

    checkToken();
  }, [navigation]);

  const fetchTopPlayers = async () => {
    try {
      const response = await axios.get('https://backend-uvlx.onrender.com/top-players', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      setTopPlayers(response.data);
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  const handleDownloadCsv = async () => {
    try {
      const response = await axios.get('https://backend-uvlx.onrender.com/players/rating-history-csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rating_history.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

 
  


  return (
    <div className="container" >
      <h1>Welcome to DashBoard</h1>
      <button onClick={handleLogout}>Logout</button>
      

      <h3>Top 50 Chess Players</h3>
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Username</th>
            <th>Rating</th>
            <th>Rating History</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={index}>
              <tr>{index}</tr>
              <td>{player.username}</td>
              <td>{player.perfs.classical.rating}</td>
              <td>{player.perfs.classical.progress}</td>
            </tr>
          ))}
        </tbody>
      </table>
   
      <button onClick={handleDownloadCsv}>Download Rating History CSV</button>
    </div>
  );
};

export default Dashboard;
