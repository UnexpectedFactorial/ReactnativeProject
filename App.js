import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';

export default function App() {

  const [unit,setUnit] = useState('metric');
  const [unitLetter, setLetter] = useState('C');
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date().getDay();

  const [day1, setDay1] = useState();
  const [day2, setDay2] = useState();
  const [day3, setDay3] = useState();

  // current weather variables
  const [weather, setWeather] = useState();
  const [region, setRegion] = useState();
  const [temperature, setTemp] = useState();
  const [weatherIcon, setIcon] = useState();
  const [country, setCountry] = useState();

  // forecast weather variables
  const [Weather1, setWeather1] = useState();
  const [Temp1, setTemp1] = useState();
  const [icon1, setIcon1] = useState();
  const [Weather2, setWeather2] = useState();
  const [Temp2, setTemp2] = useState();
  const [icon2, setIcon2] = useState();
  const [Weather3, setWeather3] = useState();
  const [Temp3, setTemp3] = useState();
  const [icon3, setIcon3] = useState();

  const [weatherDetails, setWeatherDetails] = useState(null);

  const Weather_API = '253682c0bd759acfb4255d4aa08c3dd7';

  useEffect(() => {
    getWeather();
  }, [unit]);

  const handleForecastPress = async (day) => {
    try {
      const location = await Location.getCurrentPositionAsync();
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&units=${unit}&appid=${Weather_API}`;
      const response = await fetch(forecastURL);
      const data = await response.json();

      const selectedDayData = data.daily[day];

      setWeatherDetails({
        day: days[(today + day) % 7],
        weather: selectedDayData.weather[0].main,
        temperature: selectedDayData.temp.day,
        icon: `https://openweathermap.org/img/wn/${selectedDayData.weather[0].icon}@4x.png`,
        windSpeed: selectedDayData.wind_speed,
        humidity: selectedDayData.humidity,
        uvi: selectedDayData.uvi,
        highestTemp: selectedDayData.temp.max,
        lowestTemp: selectedDayData.temp.min,
        airPressure: selectedDayData.pressure
      });
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  const handleReturnPress = () => {
    setWeatherDetails(null);
  };

  async function getWeather() {
    //clear existing values in case of refresh
    setWeather(null);
    setTemp(null);
    setRegion(null);
    setWeather1(null);
    setTemp1(null);
    setWeather2(null);
    setTemp2(null);
    setWeather3(null);
    setTemp3(null);
    setIcon1(null);
    setIcon2(null);
    setIcon3(null);
    setDay1(null);
    setDay2(null);
    setDay3(null);

    setDay1(days[(today + 1) % 7]);
    setDay2(days[(today + 2) % 7]);
    setDay3(days[(today + 3) % 7]);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permissions were denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync();

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    //current weather info
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${Weather_API}`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    const icon = data.weather[0].icon;
    setRegion(data.name);
    setWeather(data.weather[0].main);
    setTemp(data.main.temp);
    setCountry(data.sys.country);
    setIcon(`https://openweathermap.org/img/wn/${icon}@4x.png`);

    //weather forecast data
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=4&appid=${Weather_API}&units=${unit}`;
    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    setWeather1(forecastData.list[1].weather[0].main);
    setTemp1(forecastData.list[1].temp.day);
    setIcon1(`https://openweathermap.org/img/wn/${forecastData.list[1].weather[0].icon}@4x.png`);

    setWeather2(forecastData.list[2].weather[0].main);
    setTemp2(forecastData.list[2].temp.day);
    setIcon2(`https://openweathermap.org/img/wn/${forecastData.list[2].weather[0].icon}@4x.png`);

    setWeather3(forecastData.list[3].weather[0].main);
    setTemp3(forecastData.list[3].temp.day);
    setIcon3(`https://openweathermap.org/img/wn/${forecastData.list[3].weather[0].icon}@4x.png`);
  }

  const getBackgroundImage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour < 6) {
      return 'http://si.imgur.com/IGlBYaC.jpg'; // Nighttime background
    } else if (currentHour >= 6 && currentHour < 18) {
      return 'https://wallpapercave.com/wp/wp6981159.jpg'; // Daytime background
    } else {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTLdxaJTY19qy6IiFjQw8QY_iMiIOkvzJ37g&usqp=CAU'; // Dawn background
    }
  };

  const switchUnits = () => {
    if (unit === 'metric') {
      setUnit('imperial');
      setLetter('F');
    } else {
      setUnit('metric');
      setLetter('C');
    }
  };

  return (
    <ImageBackground source={{ uri: getBackgroundImage() }} style={styles.background} blurRadius={Platform.OS === 'Web' ? 0 : 70}>
      {weatherDetails ? (
        // Display Weather Details Screen
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={handleReturnPress} style={styles.returnButton}>
            <Text style={styles.returnButtonText}>&#8592; Return</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {weatherDetails.day}
          </Text>
          <View>
            <Image style={styles.largeIcon} source={{ uri: weatherDetails.icon }} />
          </View>
          <Text style={styles.info}>
            {weatherDetails.weather} {"\n"}
          </Text>
          <Text style={styles.info}>
            {weatherDetails.temperature} °{unitLetter}
          </Text>
          {/* Additional Weather Information */}
          <View style={styles.weatherDetailsContainer}>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                Wind Speed: {"\n"}{weatherDetails.windSpeed} m/s
              </Text>
            </View>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                Humidity: {"\n"}{weatherDetails.humidity}%
              </Text>
            </View>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                UV Level: {"\n"}{weatherDetails.uvi}
              </Text>
            </View>
          </View>
          <View style={styles.weatherDetailsContainer}>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                Highest Temp: {weatherDetails.highestTemp}°{unitLetter}
              </Text>
            </View>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                Lowest Temp: {weatherDetails.lowestTemp}°{unitLetter}
              </Text>
            </View>
            <View style={styles.weatherDetailsBox}>
              <Text style={styles.weatherDetailsText}>
                Air Pressure: {weatherDetails.airPressure} Pa
              </Text>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        // Display Default Screen
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>
            {region}, {country}
          </Text>
          <TouchableOpacity onPress={() => handleForecastPress(0)}>
            <View>
              <Image style={styles.largeIcon} source={{ uri: weatherIcon }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={switchUnits} style={styles.testingButton}>
            <Text style={styles.testingButtonText}>Swap Units</Text>
          </TouchableOpacity>
          <Text style={styles.info}>
            {weather} {"\n"}
          </Text>
          <Text style={styles.info}>
            {temperature} °{unitLetter}
          </Text>
          <View>
            <Text style={styles.subtitle}>Daily Forecast</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.scrollViewTouchable}>
            <ScrollView
              horizontal={true}
              style={styles.days}
            >
              <TouchableOpacity onPress={() => handleForecastPress(1)}>
                <View style={styles.list}>
                  <Text style={styles.day}>
                    {day1} {"\n"}
                    <View>
                      <Image style={styles.smallIcon} source={{ uri: icon1 }} />
                    </View>
                    {"\n"}
                    {Weather1} {"\n"}
                    {Temp1} °{unitLetter}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleForecastPress(2)}>
                <View style={styles.list}>
                  <Text style={styles.day}>
                    {day2} {"\n"}
                    <View>
                      <Image style={styles.smallIcon} source={{ uri: icon2 }} />
                    </View>
                    {"\n"}
                    {Weather2} {"\n"}
                    {Temp2} °{unitLetter}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleForecastPress(3)}>
                <View style={styles.list}>
                  <Text style={styles.day}>
                    {day3} {"\n"}
                    <View>
                      <Image style={styles.smallIcon} source={{ uri: icon3 }} />
                    </View>
                    {"\n"}
                    {Weather3} {"\n"}
                    {Temp3} °{unitLetter}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: 'white',
  },
  info: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  largeIcon: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  smallIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  days: {
    flexDirection: 'row',
  },
  list: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: 7,
    borderRadius: 10,
    height: 170,
    justifyContent: 'center',
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  scrollViewTouchable: {
    flex: 1,
  },
  returnButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
  },
  weatherDetailsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  weatherDetailsBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    marginHorizontal: 7,
    alignItems: 'center',
    padding: 10,
    width: 100,
    marginBottom: 10,
  },
  weatherDetailsText: {
    fontSize: 12,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  // Add the styles for the Testing button
  testingButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  testingButtonText: {
    color: 'white',
    fontSize: 16,
  },
});


