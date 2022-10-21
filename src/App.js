import { useEffect, useState, useRef } from "react";
import './App.css';
import logo from './mlh-prep.png'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);
  const [activeHour, setActiveHour] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const ref = useRef(); 
  

  const formatDate = (date) => {
    date = date.dt_txt.slice(5, 10)
    let num = 2; 
    date = "2022-10-21" 
    return date.replace("-", "/")
  } 

  const formatTime = (time) => {
    console.log(time)
    let returnedTime = parseInt(time.dt_txt.slice(10, 13), 10);
    // let returnedTime = 13 
    return (returnedTime > 12) ? `${returnedTime - 12}PM` : `${returnedTime}AM`
  } 

  // let activeDate;
  let dateArray = [];

  const pullDates = (listObject) => {
    let date = listObject.dt_txt.slice(0, 10);
    if (!dateArray.includes(date)) { 
      dateArray.push(date);
    }
}

let arr = [];

const pullHours = (listObject) => {
  let hourlyItem = listObject.dt_txt.slice(0, 10)
  if (hourlyItem.includes(activeDate)) {
    arr.push(listObject);
  }
  return arr;
}

  const showDates = (object) => {
    for (let i = 0; i < object.length - 1; i++) {
      pullDates(object[i])
      pullHours(object[i]) 
    }
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
            // console.log(result);
            setResults(result);
            for (let i = 0; i < result.list.length - 1; i++) {
              pullDates(result.list[i]);
            }
            setActiveDate(dateArray[0]);
            for (let i = 0; i < result.list.length - 1; i++) {
              pullHours(result.list[i]);
            } 
            console.log(arr)   
            console.log(arr[0])
            setActiveHour(arr[0]);
            console.log(activeDate)
            // console.log(activeHour)
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      ).catch((err)=>{
        console.log("Error fetch")
        console.log(err)
      }) 
  }, [city])

  const handleDateClick = (event) => {
    setActiveDate(dateArray[event.target.value])
    arr = [];
    for (let i = 0; i < results.list.length - 1; i++) {
      pullHours(results.list[i]);
    }
    setActiveHour(arr[0]);
  }

  const handleHourClick = (event) => {
    setActiveHour(arr[event.target.value])
  }

  if (error) {
    return <div>Error: {error.message}</div>;   
  } else {
    if(results && activeHour) {
    showDates(results.list);
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
          {/* {console.log(results)} */}
          {isLoaded && results && <>
            <h3>{activeHour.weather[0].main}</h3>
            <p>Feels like {activeHour.main.feels_like}°C</p>
            <i><p>{results.city.name}, {results.city.country}</p></i>
            <i><p>{formatDate(activeHour)} | {formatTime(activeHour)}</p></i>
            <div>
              <div onChange={(event) => handleDateClick(event)}>
                {dateArray.map((dateItem, i) => <button ref={ref} value={i} >{formatDate(dateItem)}</button>)}
              </div>

              <select onChange={(event) => handleHourClick(event)} >
                {arr.map((hourItem, i) => <option ref={ref} value={i} >{formatTime(hourItem)}</option>)}
              </select>
            </div>
          </>}
        </div>
      </div>
    </>
  }else return <>Loading ...</>
}
}

export default App;
