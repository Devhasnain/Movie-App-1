import { StyleSheet, TouchableOpacity } from "react-native";
import MoviesCategorized from "./src/MoviesCategorized";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VideoCard from "./src/VideoCard";
import { dark, light } from "./src/Colors";
import SignUpScreen from "./src/SignUpScreen";
import LoginScreen from "./src/LoginScreen";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as Localization from "expo-localization";
import DeleteAccount from "./src/DeleteAccount";
import Recomindings from "./src/Recomindings";
import BottomTabNavigations from "./navigations/BottomTabNavigations";

const Stack = createStackNavigator();
export default function App() {

  const [colorScheme, setColorScheme] = useState("dark");

  const backgroundColor =
    colorScheme === "dark" ? dark.BACKGROUND : light.BACKGROUND;

  const [locale, setLocale] = useState(Localization.locale.slice(0, 2));

  // const getThemeValue = (theme) => {
  //   setColorScheme(theme);
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">

        <Stack.Screen name="Main" component={BottomTabNavigations} options={{
          headerShown:false
        }} />

        {/* <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation }) => ({
            title: locale === "ar" ? "أنا" : "Profile",
            headerBackTitle: "",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerTintColor: "orange",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
          })}
        /> */}

        {/* <Stack.Screen name="LoginScreen" component={LoginScreen}  options={(navigation) => ({
        title: locale === 'ar' ? ' تسجيل الدخول' : 'Login ',
        headerBackTitle: ' ',
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ color: 'orange', fontSize: 40, marginLeft: 10, marginTop: 5 }}
              />
          </TouchableOpacity>
        ),
        headerTintColor: 'orange',
        })} /> */}

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={({ route, navigation }) => ({
            title: locale === "ar" ? " تسجيل الدخول" : "Login ",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={({ navigation }) => ({
            title: locale === "ar" ? "  انشاء حساب" : "Sign Up ",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        />
        {/* <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Recomindings"
          component={Recomindings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={MoviesCategorized}
          options={({ route, navigation }) => ({
            title: route.params.category,
            headerBackTitle: "  ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        />
        <Stack.Screen
          name="VideoCard"
          component={VideoCard}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="WatchList"
          component={WatchList}
          options={({ route, navigation }) => ({
            title: locale === "ar" ? "قائمة المشاهدة" : "Trailers",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        /> */}
        {/* <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={({ route, navigation }) => ({
            title: locale === "ar" ? " أفلامي" : "My Movies",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        /> */}

        {/* <Stack.Screen
          name="Search"
          component={Search}
          options={({ navigation }) => ({
            title: locale === "ar" ? "قائمة المشاهدة" : "Search",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    color: "orange",
                    fontSize: 40,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            ),
            headerTintColor: "orange",
          })}
        /> */}

        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
