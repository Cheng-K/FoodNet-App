import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import AppSplashScreen from "./app/screens/AppSplashScreen";
import AppStateProvider from "./app/contexts/AppStateProvider";
import HomeScreen from "./app/screens/HomeScreen";
import ImagePickerModal from "./app/screens/ImagePickerModal";
import NavigationBar from "./app/components/NavigationBar";
import ResultsScreen from "./app/screens/ResultsScreen";
import StatsScreen from "./app/screens/StatsScreen";
import useAppState from "./app/hooks/useAppState";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabStack() {
  const { appIsReady } = useAppState();
  if (!appIsReady) return <AppSplashScreen />;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
        const selected = state.index;
        return (
          <NavigationBar
            isHomeSelected={selected === 0}
            isStatsSelected={selected === 1}
            onHomeSelect={() => navigation.navigate("Home")}
            onCameraSelect={() => navigation.navigate("ImagePicker")}
            onStatsSelect={() => navigation.navigate("Stats")}
          />
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppStateProvider>
        <RootStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="HomeStack"
        >
          <RootStack.Screen name="HomeStack" component={HomeTabStack} />
          <RootStack.Screen
            name="ImagePicker"
            component={ImagePickerModal}
            options={{ presentation: "transparentModal" }}
          />
          <RootStack.Screen name="Results" component={ResultsScreen} />
        </RootStack.Navigator>
      </AppStateProvider>
    </NavigationContainer>
  );
}
