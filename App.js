import {Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import {useState , useEffect} from 'react';
import React from 'react';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default function App() {
  const [initialLocation, setInitialLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude,setLatitude] = useState(null);


  useEffect(() => {
    const getPermissions = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
        console.log("No Permissions");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      //grab latitude and longitude values with {latitude} and {longitude} respectively
    };
    getPermissions();
  },[]);

  

  return (
    <View style={styles.container}>
        <Text>
        
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
