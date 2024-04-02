import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { dark, light } from "./Colors";
import * as Localization from "expo-localization";
import { useEffect } from "react";

const Search = ({ route }) => {
  const [colorTheme, setColorTheme] = useState("dark");

  const apiKey = "5687eb97cfae2d5641269e1c0c74eefc";
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const textColor = colorTheme === "dark" ? dark.TEXT : light.TEXT;
  const backgroundColor =
    colorTheme === "dark" ? dark.BACKGROUND : light.BACKGROUND;
  const ContainerColor =
    colorTheme === "dark" ? dark.CONTAINER : light.CONTAINER;

  const [locale, setLocale] = useState(Localization.locale);

  useEffect(() => {
    if (locale === "en-LB") {
      setLocale("en-US");
    } else if (locale == "en-US") {
      setLocale("en-US");
    } else {
      setLocale("ar-AE");
    }
    console.log(colorTheme);
  });

  const styles = StyleSheet.create({
    input: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: "lightgrey",
      padding: 10,
      borderRadius: 15,
      backgroundColor: "white",
      width: "90%",
      marginLeft: 20,
      color: "grey",
    },
    movieContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 7,
      backgroundColor: ContainerColor,
      borderRadius: 20,
      marginTop: 15,
      width: "95%",
      marginLeft: 10,
    },
    poster: {
      width: 110,
      height: 120,
      resizeMode: "cover",
      marginLeft: 5,
      borderRadius: 20,
    },
    poster2: {
      width: 110,
      height: 120,
      resizeMode: "cover",
      marginRight: 10,
      borderRadius: 20,
    },
    movieInfo: {
      flex: 1,
      marginLeft: 10,
    },
    title: {
      fontSize: 15,
      marginBottom: 10,
      fontWeight: "bold",
      color: textColor,
    },
    genre: {
      fontSize: 13,
      color: "#666",
      marginBottom: 25,
      color: textColor,
    },
    rating: {
      fontSize: 10,
      marginTop: 20,
      color: textColor,
    },
    clearButton: {
      color: "grey",
      fontWeight: "bold",
      marginLeft: 4,
      marginBottom: 80,
    },
    AddToFavorites: {
      backgroundColor: "orange",
      width: "55%",
      borderRadius: "10",
      padding: 5,
      marginLeft: "50%",
    },
    categoryButton: {
      padding: 8,
      backgroundColor: "#333",
      borderRadius: 15,
      width: 95,
      marginLeft: 10,
      height: 33,
    },
    buttonText: {
      color: "white",
      alignContent: "center",
      marginLeft: 5,
    },
    PopularList: {
      marginTop: 10,
      marginLeft: 5,
    },
    LatestList: {
      marginTop: 10,
      marginLeft: 5,
    },
    selectedCategoryButton: {
      backgroundColor: "orange",
    },
    categoryText: {
      marginTop: 10,
      marginLeft: 10,
      marginBottom: -15,
      fontWeight: "bold",
      color: "#fff",
    },
  });

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text) {
      axios
        .get(`https://api.themoviedb.org/3/search/movie`, {
          params: {
            api_key: apiKey,
            language: locale,
            query: text,
            page: 1,
          },
        })
        .then((response) => {
          setSearchResults(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleSingleVideoPage = (id) => {
    // console.log(id);
    navigation.navigate("VideoCard", { id, colorTheme });
  };

  return (
    <View style={{ backgroundColor: "black" }}>
      <TextInput
        style={styles.input}
        placeholder={locale == "ar-AE" ? "ابحث عن فيلم" : "Search a movie"}
        value={searchValue}
        onChangeText={handleSearch}
        placeholderTextColor="grey"
      />
      {locale == "en-US" ? (
        <ScrollView style={{ marginTop: 20, marginBottom: 0, height: 750 }}>
          {searchResults.map((item) => (
            <View key={item.id} style={styles.movieContainer}>
              <TouchableOpacity onPress={() => handleSingleVideoPage(item.id)}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                  }}
                  style={styles.poster}
                />
              </TouchableOpacity>
              <View style={styles.movieInfo}>
                <Text style={styles.title}>{item.original_title}</Text>
                <Text style={styles.genre}>
                  {item.genres?.map((genre) => genre.name).join(", ")}
                </Text>
                <Text style={styles.rating}>{item.vote_average}/10</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={{ marginTop: 20, marginBottom: 0, height: 750 }}>
          {searchResults.map((item) => (
            <View key={item.id} style={styles.movieContainer}>
              <View style={styles.movieInfo}>
                <Text style={styles.title2}>{item.original_title}</Text>
                <Text style={styles.genre2}>
                  {item.genres?.map((genre) => genre.name).join(", ")}
                </Text>
                <Text style={styles.rating2}>{item.vote_average}/10</Text>
              </View>
              <TouchableOpacity onPress={() => handleSingleVideoPage(item.id)}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                  }}
                  style={styles.poster2}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Search;
