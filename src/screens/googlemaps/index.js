import {View, Text, StyleSheet, Dimensions, Platform, PermissionsAndroid} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../../config/constants';
import 'react-native-get-random-values';
import MapViewDirections from 'react-native-maps-directions';
import GetLocation from 'react-native-get-location'

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0
    },
    autocompleteContainer: {
        zIndex: 1, 
        position: 'absolute', 
        top: 30, 
        width: width * 0.9, 
        // padding: 15, 
        // backgroundColor: 'white', 
        borderRadius: 8,
        flexDirection: 'row',
        // marginHorizontal: 10
    },
});

export default function GoogleMapsScreen() {
    const mapRef = useRef(null);
    const [origin, setOrigin] = useState();
    const [destination, setDestination] = useState();
    const [permissionGranter, setPermissionGranter] = useState();
    const [markersList, setMarkersList] = useState([
        {
            id: 1,
            latitude: 24.787926,
            longitude: 120.997576,
            title: 'NYCU',
            description: 'This is my location'
        },
        {
            id: 2,
            latitude: 24.796669,
            longitude: 120.996665,
            title: 'NTHU',
            description: 'This is your location'
        }
    ]);

    useEffect(() => {
        _getLocationPermission();
    },[])

    async function _getLocationPermission(){
        if(Platform.OS === "android"){
            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                    title: 'Location Permission',
                    message:'Please allow permission to continue...',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  setPermissionGranter(true);
                  _getCurrentLocation();

                } else {
                  console.log('Location permission denied');
                  setPermissionGranter(false);
                }
            } catch (err) {
              console.warn(err);
            }
        }
    }

    function _getCurrentLocation(){
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
        .then(location => {
            console.log('My current location:', location);
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    }

    async function moveToLocation(latitude, longitude){
        mapRef.current.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
            2000,
        );
    }

    if(!permissionGranter) return (
        <View>
            <Text>Please allow permission to continue...</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <MapView
                ref = {mapRef}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 24.787926,
                    longitude: 120.997576,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}>
                {origin !== undefined ? <Marker coordinate={origin}></Marker> : null}
                {destination !== undefined ? <Marker coordinate={destination}></Marker> : null}
                {/* {markersList.map((marker) => {
                    return(
                        <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude, 
                            longitude: marker.longitude
                        }}
                        title={marker.title}
                        description={marker.description}
                        />
                        );
                    })} */}
                {origin != undefined && destination != undefined ? (
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeColor='blue'
                    strokeWidth={4}
                />
                ) : null}
            </MapView>   
            <View style={styles.autocompleteContainer}>
                <View style={{flex:0.5}}>
                    <GooglePlacesAutocomplete
                        fetchDetails={true}
                        placeholder='Origin'
                        onPress={(data, details = null) => {
                            // console.log(JSON.stringify(data));
                            let originCoordinate = {
                                latitude: details?.geometry?.location.lat, 
                                longitude: details?.geometry?.location.lng
                            }
                            // console.log(JSON.stringify(details?.geometry?.location));
                            setOrigin(originCoordinate);
                            moveToLocation(originCoordinate);
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                        onfail={error => console.log(error)}
                    />
                </View>
                <View style={{flex:0.5, marginLeft: 10}}>
                    <GooglePlacesAutocomplete
                        fetchDetails={true}
                        placeholder='Destination'
                        onPress={(data, details = null) => {
                            // console.log(JSON.stringify(data));
                            let desCoordinate = {
                                latitude: details?.geometry?.location.lat, 
                                longitude: details?.geometry?.location.lng
                            }
                            // console.log(JSON.stringify(details?.geometry?.location));
                            setDestination(desCoordinate);
                            moveToLocation(desCoordinate);
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                        onfail={error => console.log(error)}
                    />
                </View>
            </View>     
        </View>
    );
}