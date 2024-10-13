import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from './src/screens/googlemaps/search.js';
import GoogleMapsScreen from './src/screens/googlemaps/index.js';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GoogleMaps" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GoogleMaps" component={GoogleMapsScreen}/>
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// const Tab = createBottomTabNavigator(); 

// function App(): React.JSX.Element {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator initialRouteName="GoogleMaps">
//         <Tab.Screen 
//           name="GoogleMaps" 
//           component={GoogleMapsScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Tab.Screen 
//           name="SearchScreen" 
//           component={SearchScreen} 
//           options={{ headerShown: false }} 
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;