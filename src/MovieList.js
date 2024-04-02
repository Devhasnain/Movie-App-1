import React, { useEffect, useState } from "react";
import {
  Switch,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { dark, light } from "./Colors";
import * as Localization from "expo-localization";

const { width } = Dimensions.get("screen");

const MovieList = ({ route }) => {
  const { getThemeValue } = route.params;
  const [colorTheme, setColorTheme] = useState("dark");
  const [isEnabled, setIsEnabled] = useState(true);
  const backgroundColor =
    colorTheme === "dark" ? dark.BACKGROUND : light.BACKGROUND;
  const ButtonsColor = colorTheme === "dark" ? dark.BUTTON : light.BUTTON;
  const textColor = colorTheme === "dark" ? dark.TEXT : light.TEXT;
  const [locale, setLocale] = useState(Localization.locale);

  const toggleTheme = async () => {
    if (colorTheme === "dark") {
      setColorTheme("light");
      setIsEnabled(false);
      getThemeValue("light");
    } else {
      setColorTheme("dark");
      setIsEnabled(true);
      getThemeValue("dark");
    }
  };

  const styles = StyleSheet.create({
    categoryContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: 20,
    },
    categoryContainerAR: {
      display: "flex",
      flexDirection: "row-reverse",
      marginTop: 25,
    },
    categoryButton: {
      padding: 8,
      backgroundColor: ButtonsColor,
      borderRadius: 15,
      width: 95,
      marginLeft: 10,
      height: 33,
    },
    buttonText: {
      color: "#fff",
      alignContent: "center",
      marginLeft: 5,
      fontWeight: "bold",
    },
    PopularList: {
      marginTop: 10,
      marginLeft: 5,
      flexDirection: "row",
    },
    LatestList: {
      marginTop: 10,
      marginLeft: 5,
      flexDirection: "row",
      marginBottom: 10,
    },
    selectedCategoryButton: {
      backgroundColor: "orange",
    },
    categoryText: {
      marginTop: 10,
      marginLeft: 10,
      marginBottom: 2,
      fontSize: 20,
      fontWeight: "bold",
      color: "red",
      flexDirection: "row",
    },
    categoryTextAR: {
      marginTop: 14,
      marginRight: 10,
      fontWeight: "bold",
      color: textColor,
      fontSize: 30,
      flexDirection: "row",
      textAlign: "right",
      marginBottom: 4,
    },
    Text: {
      marginTop: 10,
      marginLeft: 10,
      marginBottom: 10,
      fontWeight: "bold",
      color: textColor,
      flexDirection: "row",
    },
    TextAR: {
      marginTop: 15,
      marginRight: 10,
      fontWeight: "bold",
      color: textColor,
      flexDirection: "row",
      textAlign: "right",
      marginBottom: 10,
    },
    categoryFlatlist: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    categoryFlatListAr: {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "center",
    },
    toggler: {
      display: "flex",
      flexDirection: "row",
      marginTop: 10,
      marginRight: -80,
    },
    toggleEn: {
      marginLeft: 420,
    },
    toggleAr: {
      marginLeft: 10,
    },
    copyRights: {
      display: "flex",
      flexDirection: "row-reverse",
      width: "100%",
      marginTop: locale == "en-US" ? 15 : "3%",
      marginLeft: locale == "en-US" ? 110 : -200,
    },
    tmdb: {
      color: "orange",
      width: 300,
      fontSize: 20,
    },
    rowContainer: {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },
  });

  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [limitedMovies, setAllMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genreMapping, setGenreMapping] = useState({});
  const [categoryText, setCategoryText] = useState("");
  const [latestText, setLatestText] = useState("");
  const [popularText, setPopularText] = useState("");
  const textStyle =
    locale === "en-US"
      ? [styles.categoryText, { color: textColor }]
      : [styles.categoryTextAR, { color: textColor }];
  const toggleStyle =
    locale === "en-US" ? [styles.toggleEn] : [styles.toggleAr];
  const apiKey = "5687eb97cfae2d5641269e1c0c74eefc";
  const navigation = useNavigation();

  useEffect(() => {
    if (locale === "en-LB") {
      setLocale("en-US");
      setCategoryText("Categories");
      setLatestText("Latest Movies");
      setPopularText("Most Popular");
    } else if (locale == "en-US") {
      setLocale("en-US");
      setCategoryText("Categories");
      setLatestText("Latest Movies");
      setPopularText("Most Popular");
    } else {
      setLocale(locale + "-AE");
      setCategoryText("فئات");
      setLatestText("اخر الافلام");
      setPopularText("الأكثر شعبية");
    }
    getPopularMovies();
    getLatestMovies();
    getAllMovies();
    getGenre();
  }, []);

  const getPopularMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          language: locale,
          sort_by: "popularity.desc",
          page: 1,
        },
      })
      .then((response) => {
        setPopularMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching popular movies:", error);
      });
  };

  const getLatestMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          language: locale,
          sort_by: "release_date.desc",
          page: 1,
        },
      })
      .then((response) => {
        setLatestMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching latest movies:", error);
      });
  };

  const getAllMovies = async () => {
    const totalPages = 10;
    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie`,
          {
            params: {
              api_key: apiKey,
              language: locale,
              page: page,
              include_adult: false,
            },
          }
        );
        const limitedMovies = response.data.results;
        allMovies = [...allMovies, ...limitedMovies];
      } catch (error) {
        console.error("Error fetching movies for page", page, ":", error);
      }
    }
    setAllMovies(allMovies);
  };

  const getGenre = () => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list`, {
        params: {
          api_key: apiKey,
          language: locale,
          page: 1,
          include_adult: false,
        },
      })
      .then((response) => {
        const genres = response.data.genres;
        setCategories(genres.map((genre) => genre.name));
        const newGenreMapping = {};
        genres.forEach((genre) => {
          newGenreMapping[genre.name] = genre.id;
        });

        setGenreMapping(newGenreMapping);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    navigation.navigate("Category", {
      category,
      limitedMovies,
      genreMapping,
      colorTheme,
    });
  };

  const handleSingleVideoPage = (id) => {
    navigation.navigate("VideoCard", { id, colorTheme });
  };
  return (
    <View style={{ backgroundColor: "black" }}>
      <ScrollView>
        <View>
          {/* dots working */}
          <Swiper
            style={{ height: 400 }}
            showsPagination={true}
            dotStyle={{ backgroundColor: "gray", width: 10, height: 10 }}
            activeDotStyle={{
              backgroundColor: "orange",
              width: 20,
              height: 10,
            }}
          >
            {popularMovies.slice(0, 5).map((movie) => (
              <View key={movie.id} style={{ flex: 1 }}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                  }}
                  style={{ flex: 1 }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>

          <TouchableOpacity style={toggleStyle} onPress={toggleTheme}>
            <View style={styles.rowContainer}>
              <View style={styles.copyRights}>
                <Text style={styles.tmdb}>By TMDB</Text>
              </View>
              <View style={styles.toggler}>
                <Switch
                  value={isEnabled}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "", true: "orange" }}
                  style={{ marginRight: "10%" }}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* <Text style={textStyle}>{categoryText}</Text>
          <ScrollView
            vertical
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            <FlatList
              data={categories}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.categoryFlatlist}>
                  <TouchableOpacity
                    style={
                      selectedCategory === item
                        ? [styles.categoryButton, styles.selectedCategoryButton]
                        : styles.categoryButton
                    }
                    onPress={() => handleCategoryClick(item)}
                  >
                    <Text
                      style={
                        selectedCategory === item
                          ? [styles.buttonText, styles.selectedButtonText]
                          : styles.buttonText
                      }
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item}
            />
          </ScrollView> */}
          <View style={{ display: "flex", flexDirection: "column", gap: 25 }}>
            <View>
              <Text style={textStyle}>{popularText}</Text>
              <FlatList
                style={styles.PopularList}
                data={popularMovies}
                contentContainerStyle={{ gap: 15 }}
                horizontal
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      onPress={() => handleSingleVideoPage(item.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: width / 2.5,
                          height: 200,
                          backgroundColor: "gray",
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="cover"
                        />
                      </View>

                      <View style={{ paddingHorizontal: 2 }}>
                        <Text
                          numberOfLines={1}
                          style={{ color: "#FFFFFF", fontSize: 17 }}
                        >
                          {item?.title?.length > 12
                            ? `${item?.title?.slice(0, 12)}...`
                            : item?.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>

            <View>
              <Text style={textStyle}>{latestText}</Text>
              <FlatList
                style={styles.LatestList}
                data={latestMovies.filter((movie) => movie.poster_path)}
                horizontal
                contentContainerStyle={{ gap: 15 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      onPress={() => handleSingleVideoPage(item.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: width / 2.5,
                          height: 200,
                          backgroundColor: "gray",
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="cover"
                        />
                      </View>

                      <View style={{ paddingHorizontal: 2 }}>
                        <Text
                          numberOfLines={1}
                          style={{ color: "#FFFFFF", fontSize: 17 }}
                        >
                          {item?.title?.length > 12
                            ? `${item?.title?.slice(0, 12)}...`
                            : item?.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieList;
