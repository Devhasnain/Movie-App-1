import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { dark, light } from "./Colors";
import { db } from "./config/Firebase";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faBookmark,
  faClock,
  faHeart,
  faPlay,
  faStar,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as Localization from "expo-localization";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("screen");

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch";
const VideoCard = ({ route }) => {
  const { id, colorTheme } = route.params;
  const [movie, setMovie] = useState({});
  const [trailerUrl, setTrailerUrl] = useState("");
  const [more, setMore] = useState(false);
  const [text, setText] = useState([]);
  const [fullText, setFullText] = useState([]);
  const navigation = useNavigation();
  const [similarMovies, setSimilarMovies] = useState([]);
  const textColor = colorTheme === "dark" ? dark.TEXT : light.TEXT;
  const backgroundColor =
    colorTheme === "dark" ? dark.BACKGROUND : light.BACKGROUND;
  const ButtonsColor = colorTheme === "dark" ? dark.BUTTON : light.BUTTON;
  const [locale, setLocale] = useState(Localization.locale);

  useEffect(() => {
    if (locale === "en-LB") {
      setLocale("en-US");
    } else if (locale == "en-US") {
      setLocale("en-US");
    } else {
      setLocale("ar-AE");
    }
    getMovieDetails(id);
    getVideo(id);
    getSimilarMovies(id);
    console.log("id retieved" + id);
    // Alert.alert('coming from categories,' + colorTheme)
  }, [id]);

  toggleShowText = (value) => {
    return !value;
  };

  const handleSingleVideoPage = (id) => {
    // console.log(id);
    navigation.navigate("VideoCard", { id, colorTheme });
  };

  const getMovieDetails = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: "5687eb97cfae2d5641269e1c0c74eefc",
          language: locale,
        },
      })
      .then((response) => {
        setMovie(response.data);
        setText(response.data.overview.slice(0, 100));
        setFullText(response.data.overview);
        // console.log("\n" + response.data.overview.slice(0, 100));
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  };

  const getSimilarMovies = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: "5687eb97cfae2d5641269e1c0c74eefc",
          language: locale,
        },
      })
      .then((response) => {
        const selectedMovie = response.data;
        const genreIds = selectedMovie.genres.map((genre) => genre.id);

        axios
          .get("https://api.themoviedb.org/3/discover/movie", {
            params: {
              api_key: "5687eb97cfae2d5641269e1c0c74eefc",
              language: locale,
              with_genres: genreIds.join(","),
            },
          })
          .then((response) => {
            const similarMovies = response.data.results.filter(
              (movie) => movie.id !== selectedMovie.id
            );

            setSimilarMovies(similarMovies);
          })
          .catch((error) => {
            console.error("Error fetching similar movies:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  };

  const getVideo = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: "5687eb97cfae2d5641269e1c0c74eefc",
          language: locale,
        },
      })
      .then((response) => {
        const videos = response.data.results;
        if (videos.length > 0) {
          const videoKey = videos[0].key;
          const videoUrl = getVideoUrl(videoKey);
          console.log(videoUrl);
          setTrailerUrl(videoUrl);
        } else {
          console.log("No video trailers available for this movie.");
        }
      })
      .catch((error) => {
        console.error("Error fetching movie videos:", error);
      });
  };

  const formatReleaseDate = (date) => {
    const year = new Date(date).getFullYear();
    return year.toString();
  };

  const showFullText = (value) => {
    setMore(!value);
  };
  const getVideoUrl = (key) => `${YOUTUBE_BASE_URL}?v=${key}`;

  const handlePlayClick = () => {
    if (trailerUrl) {
      Linking.openURL(trailerUrl).catch((error) => {
        console.error("Error opening URL:", error);
      });
    } else {
      const alertMessage =
        locale === "ar-AE"
          ? "لا يوجد مقطع فيديو متاح لهذا الفيلم."
          : "There is no trailer available for this movie.";
      Alert.alert(alertMessage, undefined, [
        {
          text: locale == "en-US" ? "OK" : "موافق",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    }
  };

  const handleBackClick = () => {
    navigation.goBack();
  };

  const addToWatchlist = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;

      try {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const currentWatchlistMovies = Array.isArray(userData.watchlistMovies)
            ? userData.watchlistMovies
            : [userData.watchlistMovies];

          const currentFavoriteMovies = Array.isArray(userData.favoriteMovies)
            ? userData.favoriteMovies
            : [userData.favoriteMovies];
          const movieId = movie?.id;

          if (
            movieId &&
            !currentWatchlistMovies.some((movie) => movie.id === movieId)
          ) {
            const updatedWatchlistMovies = [...currentWatchlistMovies, movie];

            await setDoc(doc(db, "users", userEmail), {
              email: userEmail,
              watchlistMovies: updatedWatchlistMovies,
              favoriteMovies: currentFavoriteMovies,
            });

            const alertMessage =
              locale === "ar-AE"
                ? "تمت إضافة الفيلم إلى قائمة المشاهدة"
                : "Movie added to watchlist";
            Alert.alert(alertMessage, undefined, [
              {
                text: locale == "en-US" ? "OK" : "موافق",
                onPress: () => console.log("OK Pressed"),
              },
            ]);
          } else {
            const alertMessage =
              locale === "ar-AE"
                ? "الفيلم كان موجود بالفعل في قائمة المشاهدة"
                : "Movie was already in watchlist";
            Alert.alert(alertMessage, undefined, [
              {
                text: locale == "en-US" ? "OK" : "موافق",
                onPress: () => console.log("OK Pressed"),
              },
            ]);
          }
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
      }
    } else {
      navigation.navigate("LoginScreen", { colorTheme });
      console.log("User not authenticated");
    }
  };

  const AddToFavorites = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;

      try {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const currentWatchlistMovies = Array.isArray(userData.watchlistMovies)
            ? userData.watchlistMovies
            : [userData.watchlistMovies];

          const currentFavoriteMovies = Array.isArray(userData.favoriteMovies)
            ? userData.favoriteMovies
            : [userData.favoriteMovies];
          const movieId = movie?.id;

          if (
            movieId &&
            !currentFavoriteMovies.some((movie) => movie.id === movieId)
          ) {
            const updatedFavoriteMovies = [...currentFavoriteMovies, movie];

            await setDoc(doc(db, "users", userEmail), {
              email: userEmail,
              watchlistMovies: currentWatchlistMovies,
              favoriteMovies: updatedFavoriteMovies,
            });

            const alertMessage =
              locale === "ar-AE"
                ? "تمت إضافة الفيلم إلى قائمة المشاهدة"
                : "Movie added to favorites";
            Alert.alert(alertMessage, undefined, [
              {
                text: locale == "en-US" ? "OK" : "موافق",
                onPress: () => console.log("OK Pressed"),
              },
            ]);
          } else {
            const alertMessage =
              locale === "ar-AE"
                ? "الفيلم كان موجود بالفعل في قائمة المشاهدة"
                : "Movie was already in favorites";
            Alert.alert(alertMessage, undefined, [
              {
                text: locale == "en-US" ? "OK" : "موافق",
                onPress: () => console.log("OK Pressed"),
              },
            ]);
          }
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
      }
    } else {
      navigation.navigate("LoginScreen", { colorTheme });
      console.log("User not authenticated");
    }
  };

  // const AddToFavorites = async () => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (auth.currentUser != null) {
  //     const userEmail = user.email;
  //     try {
  //       const docRef = doc(db, "users", userEmail);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         const currentFavoriteMovies = Array.isArray(userData.favoriteMovies)
  //           ? userData.favoriteMovies
  //           : [userData.favoriteMovies];
  //         const currentWatchlistMovies = Array.isArray(userData.watchlistMovies)
  //           ? userData.watchlistMovies
  //           : [userData.watchlistMovies];
  //         const movieId = movie?.id;

  //         if (movieId) {
  //           if (!currentFavoriteMovies.some((movie) => movie.id === movieId)) {
  //             const updatedFavoriteMovies = [...currentFavoriteMovies, movie];

  //             await setDoc(docRef, {
  //               email: userEmail,
  //               favoriteMovies: updatedFavoriteMovies,
  //               watchlistMovies: currentWatchlistMovies
  //             });

  //             const alertMessage = locale === 'ar-AE' ? 'تمت إضافته إلى المفضلة' : 'The movie was added to favorites.';
  //             Alert.alert(
  //               alertMessage,
  //               undefined,
  //               [{ text: locale == "en-US" ? 'OK' : 'موافق', onPress: () => console.log('OK Pressed') }]
  //             );
  //           } else {
  //             const alertMessage = (locale === 'ar-AE' ? `${movie.original_title} تمت إضافته إلى المفضلة.` : `${movie.original_title} has been already added to favorites.`);

  //             Alert.alert(
  //               alertMessage,
  //               undefined,
  //               [{ text: locale == "en-US" ? 'OK' : 'موافق', onPress: () => console.log('OK Pressed') }]
  //             );
  //           }
  //         } else {
  //           console.error('Movie object or id is undefined');
  //         }
  //       } else {

  //         const initialData = {
  //           email: userEmail,
  //           favoriteMovies: movie ? [movie] : [],
  //         };

  //         await setDoc(docRef, initialData);

  //         Alert.alert("User document initialized with movie added to favorites");
  //       }
  //     } catch (error) {
  //       console.error('Error adding movie to favorites:', error);
  //     }
  //   } else {
  //     // Alert.alert('SignUpfirst');
  //     navigation.navigate('LoginScreen',{colorTheme})
  //     console.log('User not authenticated');
  //   }
  // };

  return (
    <ScrollView style={{ backgroundColor: "black", position: "relative" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: 55,
          left: 0,
          width: "100%",
          paddingHorizontal: 15,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FF5524",
            borderRadius: 100,
          }}
          onPress={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={17} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FF5524",
            borderRadius: 100,
          }}
          onPress={addToWatchlist}
        >
          <FontAwesomeIcon icon={faHeart} size={17} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ position: "relative", overflow: "visible" }}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
          }}
          style={{
            width: 440,
            height: 450,
            resizeMode: "cover",
            display: "block",
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 5,
            left: 0,
            zIndex: 100,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 220,
              height: 330,
              elevation: 10,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                display: "block",
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 15,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <FontAwesomeIcon icon={faClock} size={17} color="white" />
          <Text style={{ color: "white" }}>2h</Text>
        </View>

        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginHorizontal: 20,
            fontSize: 23,
          }}
        >
          {movie?.title}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
            }}
          >
            <FontAwesomeIcon icon={faStar} color="yellow" size={17} />
            <Text style={{ color: "white" }}>({movie?.vote_average})</Text>
          </View>
          <Text style={{ color: "white" }}>
            {movie?.release_date?.split("-").reverse().join("-")}
          </Text>
        </View>
        <Text style={{ color: "white", fontSize: 16 }}>{movie?.overview}</Text>
      </View>

      <View style={{ paddingHorizontal: 12, paddingTop: 15 }}>
        <Text style={{ color: "white", fontSize: 25 }}>Similar Movies</Text>
        <FlatList
          data={similarMovies.filter((movie) => movie.poster_path)}
          horizontal
          contentContainerStyle={{ gap: 15, paddingTop: 8, paddingBottom: 10 }}
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
    </ScrollView>
  );
};

export default VideoCard;
