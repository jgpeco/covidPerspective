import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  //api
  const [totalCases, setTotalCases] = useState(0)
  const [totalDeaths, setTotalDeaths] = useState(0)
  const [countryCases, setCountryCases] = useState(0)
  const [countryDeaths, setCountryDeaths] = useState(0)
  const [countryName, setCountryName] = useState('')
  //search form
  const [countrySearch, setCountrySearch] = useState('')

  const fetchTotalCases = async () => {
    const response = await axios.get(`https://api.covid19api.com/summary`, { crossdomain: true })
    const { Global } = response.data
    setTotalCases(Global.TotalConfirmed)
    setTotalDeaths(Global.TotalDeaths)
  }

  const fetchByCountry = async (country) => {
    const response = await axios.get(`https://api.covid19api.com/countries`)
    const slug = response.data.find(c => country === c.Country).Slug

    const todayDate = new Date().toISOString()

    const countryResponse = await axios.get(`https://api.covid19api.com/country/${slug}?from=2020-03-01T00:00:00Z&to=${todayDate}`)
    return countryResponse.data[countryResponse.data.length - 1]
  }

  useEffect(() => {
    fetchTotalCases()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const country = await fetchByCountry(countrySearch)
    setCountryName(country.Country)
    setCountryCases(country.Confirmed)
    setCountryDeaths(country.Deaths)
    setCountrySearch('')
  }

  return (
    <>
      <div>
        <h1>Covid in Perspective</h1>
        <p><strong>Total Cases: </strong> {totalCases}</p>
        <p><strong>Total Deaths: </strong> {totalDeaths}</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <p>Search by country: <input
              id='search-country-main'
              name='search-country'
              placeholder='Type name of country...'
              value={countrySearch}
              onChange={({ target }) => setCountrySearch(target.value)}
          />
          <button type='submit'>Search</button>
          </p>
        </form>
        {countryName
        ? (
          <p>
            <h2>{countryName}</h2>
            <p><strong>Total Cases: </strong> {countryCases}</p>
            <p><strong>Total Deaths: </strong> {countryDeaths}</p>
          </p>
        )
        : null
        }
      </div>
    </>
  )
}

export default App
