import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MovieList from "../src/MovieList";
import Search from "../src/Search";
import WatchList from "../src/WatchList";
import Favorites from "../src/Favorites";
import { dark, light } from "../src/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faFilm,
  faHeart,
  faHouseUser,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Localization from "expo-localization";
const Tab = createBottomTabNavigator();

const ActiveTabStyles = {
  height: 50,
  width: 50,
  backgroundColor: "#FF5524",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 100,
};

const unActiveTabStyles = {
  height: 50,
  width: 50,
  backgroundColor: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 100,
};

const headerStyle = {
  backgroundColor: "black",
};

const headerTitleStyle = {
  color: "white",
};

const BottomTabNavigations = () => {
  const getThemeValue = (theme) => {
    setColorScheme(theme);
  };

  const [locale, setLocale] = useState(Localization.locale.slice(0, 2));

  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="MovieList"
      screenOptions={{
        tabBarStyle: {
          height: 85,
          backgroundColor: "black",
          borderTopWidth: 0,
          paddingBottom: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="MovieList"
        component={MovieList}
        initialParams={{ getThemeValue }}
        options={{
          headerShown: true,
          headerTitle: "Popular Movies",
          headerStyle,
          headerTitleStyle,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? ActiveTabStyles : unActiveTabStyles}>
              <FontAwesomeIcon icon={faHouseUser} size={28} color="white" />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? ActiveTabStyles : unActiveTabStyles}>
              <FontAwesomeIcon icon={faSearch} size={25} color="white" />
            </View>
          ),
          title: locale === "ar" ? "أنا" : "",
          headerStyle,
          headerShadowVisible: false,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{
                  color: "#FF5524",
                  fontSize: 40,
                  marginLeft: 10,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="WatchList"
        component={WatchList}
        options={{
          headerStyle,
          headerShadowVisible: false,
          headerTitle:"Watch List",
          headerTitleStyle:{color:"white"},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{
                  color: "#FF5524",
                  fontSize: 40,
                  marginLeft: 20,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={focused ? ActiveTabStyles : unActiveTabStyles}>
              <FontAwesomeIcon icon={faFilm} size={27} color="white" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? ActiveTabStyles : unActiveTabStyles}>
              <FontAwesomeIcon icon={faHeart} size={27} color="white" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MovieList}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? ActiveTabStyles : unActiveTabStyles}>
              <FontAwesomeIcon icon={faUser} size={27} color="white" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigations;
