// // App.tsx

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { StyleSheet, View } from 'react-native';
// import Svg, { Path, Polyline } from 'react-native-svg';
// import TabBar from './components/TabBar';
// import MetodePembayaran from './app/metodePembayaran';

// const Tab = createBottomTabNavigator();

// function HomeScreen() {
//   return (
//     <View style={styles.screen}>
//       <MetodePembayaran />
//     </View>
//   );
// }

// // function WalletScreen() {
// //   return (
// //     <View style={styles.screen}>
// //       <OtherScreen />
// //     </View>
// //   );
// // }

// // function BookScreen() {
// //   return (
// //     <View style={styles.screen}>
// //       <OtherScreen />
// //     </View>
// //   );
// // }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         tabBar={props => <TabBar {...props} />}
//         screenOptions={{ headerShown: false }}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         {/* <Tab.Screen name="Wallet" component={WalletScreen} /> */}
//         {/* <Tab.Screen name="Book" component={BookScreen} /> */}
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
