<<<<<<< Updated upstream
import { useEffect, useState } from "react";
=======
import { useCallback, useEffect, useState } from "react";
>>>>>>> Stashed changes
import './App.css';
import logo from './mlh-prep.png'
import createDebug from 'debug'
const log = createDebug('prep2:app')
createDebug.enable('prep2:*')



function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);
<<<<<<< Updated upstream

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
          }
        },
        (error) => {
=======
  const [activeResult, setActiveResult] = useState(null)
  const [activeDate, setActiveDate] = useState(null)
  const [activeTime, setActiveTime] = useState(null)
  const [map, setMap] = useState(null)

  const formatDate = (date) => {
    const _log = log.extend('format-time')
    _log('Formatting date:', date)

    if(!date.dt_txt) return date
    date = date.dt_txt.slice(5, 10)
    return date.replace("-", "/")
  } 

  const formatTime = (time) => {
    const _log = log.extend('format-time')
    _log(time)
    let returnedTime = parseInt(time.dt_txt.slice(10, 13), 10);
    return (returnedTime > 12) ? `${returnedTime - 12}PM` : `${returnedTime}AM`
  } 



  const loadData = (city) => {
    const _log = log.extend('load-data')

    fetch("https://pro.openweathermap.org/data/2.5/forecast/hourly?q=" + city + "&units=metric" + "&appid=" + process.env.REACT_APP_APIKEY)
    .then(res => res.json())
    .then(
      (result) => {
        if (!result || !result.list || !result.list.length) {
          _log('Result NOT OK') 
          setIsLoaded(false)
        } else { 
          _log('Result OK', result)

          let resultMap = {}

          result.list.forEach(item => {
            let split = item.dt_txt.split(' ')
            let date = split[0]
            let time = split[1]
            if(date in resultMap && !resultMap[date].includes(time)){
              resultMap[date].push(time)
            }else{
              resultMap[date] = [time]
            }
          })
>>>>>>> Stashed changes
          setIsLoaded(true);
          setResults(result)
          setMap(resultMap);
        }
<<<<<<< Updated upstream
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
          </>}
        </div>
      </div>
    </>
  }
=======
      },
      (error) => {
        _log('FETCH ERROR:', error)
        setIsLoaded(true);
        setError(error);
      }
      ).catch((err)=>{
      _log('CAUGHT ERROR:', err)
      setIsLoaded(false)
      setError(err)
    }) 
  }

  useEffect(()=>{
    if(map){
      setActiveDate(Object.entries(map)[0][0])
      setActiveTime(Object.entries(map)[0][1][0])
    }
  },[map])

  useEffect(()=>{
    if(activeDate && activeTime){
      setActiveResult(results.list.find(item => item.dt_txt === `${activeDate} ${activeTime}`))
    }
  },[activeDate, activeTime])


  if(!city || !activeResult){
    return(
      <>
       <input
        type="text"
        value={city}
        onChange={event => setCity(event.target.value)} />
        <button onClick={() => loadData(city)}>Search</button>
      </>
    )
  }

  return <>
    <img className="logo" src={logo} alt="MLH Prep Logo"></img>
    <div>
      <h2>Enter a city below 👇</h2>
      <input
        type="text"
        value={city}
        onChange={event => setCity(event.target.value)} />
        <button onClick={() => loadData(city)}>Search</button>
      <div className="Results">
          <h3>{activeResult.weather[0].main}</h3>
          <p>Feels like {activeResult.main.feels_like}°C</p>
          <i><p>{results.city.name}, {results.city.country}</p></i>
          <i><p>{activeDate} | {activeTime}</p></i>
 
        {Object.keys(map).map((date, i) => <button onClick={()=> setActiveDate(date)} >{date}</button>)}
        <br />
        {map[activeDate].map((time, i) => <button onClick={()=> setActiveTime(time)} >{time}</button>)} 
      </div>
    </div>
  </>
>>>>>>> Stashed changes
}

export default App;
