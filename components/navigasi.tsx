// import React, { useEffect } from 'react';
// import { useFonts } from 'expo-font';
// import { createStackNavigator } from '@react-navigation/stack';
// import * as SplashScreen from 'expo-splash-screen';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import 'react-native-reanimated';
// import { useColorScheme } from '@/hooks/useColorScheme.web';
// // import { TabBar } from '@/components/TabBar';
// import MetodePembayaran from '@/app/metodePembayaran';
// import PaymentScreen from '@/app/virtualAccount';
// import TabsNavigation from '@/app/(tabs)/navigasi';
// import RootLayout from '@/app/_layout';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function ComponentLayout() {
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const Stack:any = createStackNavigator();
//   const Drawer = createDrawerNavigator();
//   const colorScheme = useColorScheme();

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name='app' component={RootLayout}/>
//         {/* <Stack.Screen name='metodePembayaran' component={MetodePembayaran} /> */}
//         {/* <Stack.Screen name='virtualAccount' component={PaymentScreen} /> */}
//         {/* <Stack.Screen name='(tabs)' component={TabsNavigation}/> */}
//         {/* <Stack.Screen name='TabBar' component={TabBar}/> */}
        
//       </Stack.Navigator>
//     </ThemeProvider>
//   );
// }
