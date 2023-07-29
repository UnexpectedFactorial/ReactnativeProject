import { Text, View, StyleSheet, AcivityIndicator, Alert, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import  * as Location from 'expo-location';
import {useState, useEffect} from 'react';

export default function App() {
  //variables, store data here
  const [rGeocode, setRGeo] = useState();
  const [location, setLocation] = useState();
  const [currentLatitude, setLatitude] = useState();
  const [currentLongitude, setLongitude] = useState();
  const [currentCity, setCity] = useState();
  const [forecast, setForecast] = useState(null);
  const [response, setResponse] = useState(false);
  const Weather_API = 'e4526a4bfd4f09fe6ff15be0585a6e41';
  const openWeatherBase = 'https://api.openweathermap.org/data/2.5/weather?';
  let url = 'http://api.weatherapi.com/v1/forecast/json?key=${Weather_API}&q=${location}&days=1&aqi=no&alerts=no';

  useEffect (() => {
    loadWeather(); //call this function if a weather reload is needed
  },[]);
  
  async function loadWeather(){
    setLatitude(null);
    setCity(null);
    const getPermissions = async () =>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log(currentLocation);

      setLatitude(currentLocation.coords.latitude);
      setLongitude(currentLocation.coords.longitude);

      let reverseGeocoding = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      })
      setCity(reverseGeocoding[0].city);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        You are currently at:
      </Text>
      <Text style={styles.paragraph}> {currentLatitude} {"\n"} {currentLongitude} {"\n"} {currentCity}
      </Text>
    </View>
    );
}

const current = forecast.current.weather[0];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
