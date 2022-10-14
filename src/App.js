import { useEffect, useState } from "react";
import './App.css';
import logo from './mlh-prep.png'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);

  const formatDate = (date) => {
    return date.replace("-", "/")
  }

  const formatTime = (time) => {
    // return time
    if (time > 12) {
      return `${time - 12}PM`
    } else {
      return `${time}AM`
    } 
  }

  const showDates = (object) => {
    let arr = [];
    let hoursOfSelectedDay = [];
    for (let i = 0; i < object.length - 1; i++) {
      let date = object[i].dt_txt.slice(0, 10)
      if (!arr.includes(date)) {
        arr.push(date);
      }
    }
    let copyObject = object.slice();
    for (let i = 0; i < copyObject.length - 1; i++) {
      let hourlyItem = copyObject[i].dt_txt.slice(0, 10)
      let selectedDate = arr[1]
      if (hourlyItem.includes(selectedDate)) {
        hoursOfSelectedDay.push(copyObject[i]);
      }
    }
    return console.log(hoursOfSelectedDay);
  }

  useEffect(() => {
    fetch("https://pro.openweathermap.org/data/2.5/forecast/hourly?q=" + city + "&units=metric" + "&appid=" + process.env.REACT_APP_APIKEY)
      .then(res => res.json())
      .then(
        (result) => {
          if (parseInt(result['cod']) !== 200) {
            setIsLoaded(false)
          } else {
            setIsLoaded(true);
            setResults(result);
            console.log(showDates(results.list))
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [city])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return <>
      <img className="logo" src={logo} alt="MLH Prep Logo"></img>
      <div>
        <h2>Enter a city below 👇</h2>
        <input
          type="text"
          value={city}
          onChange={event => setCity(event.target.value)} />
        <div className="Results">
          {!isLoaded && <h2>Loading...</h2>}
          {console.log(results)}
          {isLoaded && results && <>
            <h3>{results.list[0].weather[0].main}</h3>
            <p>Feels like {results.list[0].main.feels_like}°C</p>
            <i><p>{results.city.name}, {results.city.country}</p></i>
            <i><p>{formatDate(results.list[0].dt_txt.slice(5, 10))} | {formatTime(results.list[0].dt_txt.slice(11, 13))}</p></i>
          </>}
        </div>
      </div>
    </>
  }
}

export default App;
