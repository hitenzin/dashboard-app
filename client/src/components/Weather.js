import React, { Component } from 'react';
import '../stylesheets/Weather.css';
import axios from 'axios';
import {Button, Glyphicon} from 'react-bootstrap';
import apiKeys from '../config.js';
import {Popover, OverlayTrigger} from 'react-bootstrap';

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      currentCity: null,
      currentIcon: null,
      currentTemp: null,
      currentTempMin: null,
      currentTempMax: null,
      currentSummary: null,
      currentTime: null,
      currentHumidity: null
    }
    this.addZipcode = this.addZipcode.bind(this);
    this.kelvinToFarenheit = this.kelvinToFarenheit.bind(this);
    this.weatherInfo = this.weatherInfo.bind(this);
    this.moreInfo = this.moreInfo.bind(this);
  }

  componentDidMount() {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=10013&key=${apiKeys.googleMapsAPI}`)
    .then((response) => {
      var lng = response.data.results[0].geometry.location.lng;
      var lat = response.data.results[0].geometry.location.lat;
      var city = response.data.results[0].address_components[1].long_name;
      axios.get(`http://api.openweathermap.org/data/2.5/forecast?zip=10013,us&appid=${apiKeys.openWeatherAPI}`)
      .then((res) => {
        this.setState({
          currentCity: city,
          currentTemp: this.kelvinToFarenheit(res.data.list[0].main.temp),
          currentTempMin: this.kelvinToFarenheit(res.data.list[0].main.temp_min),
          currentTempMax: this.kelvinToFarenheit(res.data.list[0].main.temp_max),
          currentSummary: res.data.list[0].weather[0].description,
          currentTime: res.data.list[0].dt,
          currentHumidity: res.data.list[0].main.humidity
        })
        // console.log(this.state);
      })
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  kelvinToFarenheit(kelvin) {
     // T(K) × 9/5 - 459.67
     return (kelvin * 9/5 - 459.67).toFixed(2);
  }

  addZipcode(e) {
    // when Enter is press from input, then exectue
    if (e.key === 'Enter') {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.zipCode.value}&key=${apiKeys.googleMapsAPI}`)
      .then((response) => {
        var lng = response.data.results[0].geometry.location.lng;
        var lat = response.data.results[0].geometry.location.lat;
        var city = response.data.results[0].address_components[1].long_name;
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?zip=${this.zipCode.value},us&appid=${apiKeys.openWeatherAPI}`)
        .then((res) => {
          this.zipCode.value = null;
          this.setState({
            currentCity: city,
            currentTemp: this.kelvinToFarenheit(res.data.list[0].main.temp),
            currentTempMin: this.kelvinToFarenheit(res.data.list[0].main.temp_min),
            currentTempMax: this.kelvinToFarenheit(res.data.list[0].main.temp_max),
            currentSummary: res.data.list[0].weather[0].description,
            currentTime: res.data.list[0].dt,
            currentHumidity: res.data.list[0].main.humidity
          })
          // console.log(this.state);
        })
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }

  weatherInfo() {
    if (this.state.currentCity !== null) {
      const weatherIcons = ['cloud', 'sun', 'clear', 'rain', 'snow', 'thunder' ];
      var iconClass = null;
      weatherIcons.map((desc, idx) => {
        if (this.state.currentSummary.match(`${desc}`) !== null) {
          iconClass = weatherIcons[idx];
        }
      })
      return (
        <ul>
          <div className={iconClass + " iconClass"} />
          <h3><span className="cityName">{this.state.currentCity}</span></h3>
          <div className="currentTemp">{this.state.currentTemp} &#8457;</div>
          <div className="details">
            <li>{this.state.currentTempMin} &#8457;/{this.state.currentTempMax} &#8457;</li>
            <li>{this.state.currentSummary}</li>
            <li>Humidity: {this.state.currentHumidity}%</li>
          </div>
        </ul>
      )
    }
  }

 moreInfo() {
    return (
      <Popover className="aboutNewsWidget" title="About 'Weather'">
        <p>
          This widget gives you the current weather and short summary.
          You can just enter your zipcode and press Enter.
        </p>
        <p>
          This widget is powered by Open Weather API.
        </p>
      </Popover>
    );
  }

  render() {
    return (
      <div className="main_Weather text-center">
        <h2 className="pull-left">
          <OverlayTrigger trigger="hover" placement="bottom" overlay={this.moreInfo()}>
            <i className="fa fa-info-circle moreInfoBtn" aria-hidden="true"></i>
          </OverlayTrigger>
          &nbsp;
          Weather</h2>
        <span className="pull-right">
          <input
            className="weather-input text-center"
            type="text"
            placeholder="Enter Your Zipcode"
            ref={(input) => { this.zipCode = input; }}
            onKeyPress={this.addZipcode}
          />
        </span>
        <br />
        {this.weatherInfo()}
    </div>
    );
  }
}

export default Weather;
