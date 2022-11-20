import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./app/screens/HomeScreen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  return <HomeScreen />;
}
