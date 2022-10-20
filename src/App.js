import { useEffect, useState } from "react";
import './App.css';
import logo from './mlh-prep.png'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);

  const formatDate = (date) => {
    date = date.dt_txt.slice(5, 10)
    return date.replace("-", "/")
  } 

  const formatTime = (time) => {
    time = parseInt(time.dt_txt.slice(11,13), 10)
    return (time > 12) ? `${time - 12}PM` : `${time}AM`
  }

  let arr = [];

  const pullDates = (listObject) => {
    let date = listObject.dt_txt.slice(0, 10);
    if (!arr.includes(date)) { 
      arr.push(date);
    }
}

const pullHours = (listObject) => {
  let hourlyItem = listObject.dt_txt.slice(0, 10)
  let selectedDate = arr[3]
  if (hourlyItem.includes(selectedDate)) {
    
  }
}

  const showDates = (object) => {
    for (let i = 0; i < object.length - 1; i++) {
      console.log(object[i])
      pullDates(object[i])
      pullHours(object[i])
      console.log(`Object ${i} is ${pullDates(object[i])}`)
      console.log(`Object ${i} is ${pullHours(object[i])}`)
      // console.log(pullHours(object[i]))
    }
  }

  // console.log(showDates(results.list))

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
            // console.log(showDates(results.list))
            // console.log(arr)
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
    showDates(results.list);
    console.log(arr)
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
            <i><p>{formatDate(results.list[0])} | {formatTime(results.list[0])}</p></i>
            <div>
              <div>
                <button>{arr[0]}</button>
                <button>{arr[1]}</button>
                <button>{arr[2]}</button>
                <button>{arr[3]}</button>
                <button>{arr[4]}</button>
              </div>
              <select>
                <option>{formatTime(results.list[0])}</option>
                <option>{formatTime(results.list[1])}</option>
                <option>{formatTime(results.list[2])}</option>
                <option>{formatTime(results.list[3])}</option>
              </select>
            </div>
          </>}
        </div>
      </div>
    </>
  }
}

export default App;
