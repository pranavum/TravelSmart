// Filename - App.js

// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import Plotly from 'plotly.js-dist-min';
import Plot from 'react-plotly.js';
import CountrySelect from "./components/CountrySelect.jsx";


const apiUrl = 'http://127.0.0.1:5000';

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://localhost:5000');

function App() {

	// usestate for setting a javascript
	// object for storing and using data
	const [data, setdata] = useState({
		name: "",
		age: 0,
		date: "",
		programming: "",
	});

	// Using useEffect for single rendering
	useEffect(() => {
		// Using fetch to fetch the api from 
		// flask server it will be redirected to proxy
		fetch(`${apiUrl}/data`)
  .then(response => response.json())
  .then(data => {
    setdata({
      name: data.Name,
      age: data.Age,
      date: data.Date,
      programming: data.programming,
  });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
	}, []);

  var selectedCurrency = "AUD";

  const [selectedPlot, setSelectedPlot] = useState(0);
  const [plot, setPlot] = useState(0);

  useEffect(() => {
    fetch(`${apiUrl}/${selectedCurrency}`).then(res => res.json()).then(data => {
    setSelectedPlot(data); // Assuming the API returns the correct structure
  });}, []);

  const [selectedPlot2, setSelectedPlot2] = useState(0);
  const [plot2, setPlot2] = useState(0);

  useEffect(() => {
    fetch(`${apiUrl}/pred_${selectedCurrency}`).then(res => res.json()).then(data => {
      setSelectedPlot2(data);
      //Plotly.newPlot("graph-div", plot, {})
    });}, []);

  const [selectedCountry, setSelectedCountry] = useState("🇦🇩 EUR - Andorra");

  useEffect(() => {
    const currencies = ['AUD','BWP','BRL','BND','CAD','CLP','CNY','DKK','EUR','INR','JPY','KRW','KWD','MYR','MTL','NZD','NOK','OMR','QAR','SAR','SGD','ZAR','SEK','CHF','THB','TTD','AED','GBP','USD']
    if (typeof selectedCountry === 'string') {
      var newSelectedCurrency = selectedCountry.match(/[A-Z]{3}/)[0];
      if (currencies.includes(newSelectedCurrency)) {
        console.log(newSelectedCurrency);
        selectedCurrency = newSelectedCurrency;
        fetch(`${apiUrl}/${selectedCurrency}`).then(res => res.json()).then(data => {
          setSelectedPlot(data); // Assuming the API returns the correct structure
        });
        fetch(`${apiUrl}/pred_${selectedCurrency}`).then(res => res.json()).then(data => {
          setSelectedPlot2(data); // Assuming the API returns the correct structure
        });
      }
    }
  }, [selectedCountry]);

	return (
		<div className="App">
			<header className="App-header">
				<h1>TravelSmart</h1>
        <CountrySelect value={selectedCountry} setValue={setSelectedCountry} />
        <div id="graph-div" className="graph-div">
        </div>
        <Plot data={selectedPlot.data} layout={selectedPlot.layout} />
        <br></br>
        <Plot data={selectedPlot2.data} layout={selectedPlot2.layout} />
			</header>
		</div>
	);
}

export default App;
