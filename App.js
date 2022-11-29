import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";

import colors from "./app/config/colors";
import HomeScreen from "./app/screens/HomeScreen";
import ImagePickerModal from "./app/screens/ImagePickerModal";
import NavigationBar from "./app/components/NavigationBar";
import ResultsScreen from "./app/screens/ResultsScreen";
import StatsScreen from "./app/screens/StatsScreen";
import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabStack() {
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
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Results"
      >
        <RootStack.Screen name="Results" component={ResultsScreen} />
        <RootStack.Screen name="HomeStack" component={HomeTabStack} />
        <RootStack.Screen
          name="ImagePicker"
          component={ImagePickerModal}
          options={{ presentation: "transparentModal" }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary_cinnamon,
    padding: 5,
    marginBottom: 3,
  },
  root: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    color: colors.secondary_grey,
  },
  highlighted: {
    color: colors.secondary_cinnamon,
    fontWeight: "bold",
  },
});
