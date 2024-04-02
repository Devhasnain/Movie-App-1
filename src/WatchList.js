import React, { useEffect, useState } from 'react';
import { useColorScheme, View, Linking, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import { dark, light } from './Colors'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization';


const {width} = Dimensions.get("screen");

const WatchList = ({ route }) => {
  const [ colorTheme  ]=useState("dark") 
  const [popularMovies, setPopularMovies] = useState([]);
  const textColor = colorTheme === 'dark' ? dark.TEXT : light.TEXT;
  const backgroundColor = colorTheme === 'dark' ? dark.BACKGROUND : light.BACKGROUND;
  const ButtonsColor = colorTheme === 'dark' ? dark.BUTTON : light.BUTTON;
  const ContainerColor = colorTheme === 'dark' ? dark.CONTAINER : light.CONTAINER;
  const navigation = useNavigation();
  const apiKey = '5687eb97cfae2d5641269e1c0c74eefc';
  const [locale, setLocale] = useState(Localization.locale);

  const styles = StyleSheet.create({
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
      marginTop: 70,
      alignContent: 'center',
      marginLeft: '31%',
      color: 'orange'
    },
    headerContainer: {
      flexDirection: 'row',
      display: 'flex'
    },
    backButton: {
      marginTop: 70,
      marginLeft: 17,
      color: 'orange'
    },
    movieContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // padding: 9,
      borderRadius: 20,
      // marginTop: 15,
      width: width,
      height:300,
      // marginLeft: 10
    },
    movieContainer2: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      // padding: 9,
      borderRadius: 20,
      // marginTop: 15,
      width: width,
      height:300,
      // marginRight: 10
    },
    poster: {
      width: "100%",
      height: "100%",
      resizeMode: 'cover',
      // marginRight: 10,
      borderRadius: 20
    },
    title: {
      fontSize: 15,
      // marginBottom: 10,
      fontWeight: 'bold',
      color: textColor,
      width: '100%'
    },
    genre: {
      fontSize: 13,
      color: '#666',
      marginBottom: 25,
      color: textColor,
      width: '70%'
    },
    rating: {
      fontSize: 10,
      marginTop: 20,
      color: textColor,

    },
    clearButton: {
      color: 'grey',
      fontWeight: 'bold',
      marginLeft: -40,
      marginBottom: 80,
    },
    clearButton2: {
      color: 'grey',
      fontWeight: 'bold',
      marginBottom: 100,
      marginRight: -200
    },
    title2: {
      fontSize: 15,
      marginBottom: 10,
      fontWeight: 'bold',
      color: textColor,
      marginLeft: 20,
      marginTop: 5,
      width: '100%',
    },
    genre2: {
      fontSize: 10,
      color: '#666',
      marginBottom: 25,
      color: textColor,
      display: 'flex',
      marginLeft: 30
    },
    rating2: {
      fontSize: 10,
      marginTop: 20,
      color: textColor,
      marginLeft: 200
    },

    AddToFavorites: {
      backgroundColor: "orange",
      width: "32%",
      borderRadius: "10",
      padding: 5,
      marginLeft: "50%",
      height: 25
    },
    AddToFavorites2: {
      backgroundColor: "orange",
      width: "32%",
      borderRadius: "10",
      padding: 5,
      marginLeft: 10,
    },
    categoryButton: {
      padding: 8,
      backgroundColor: ButtonsColor,
      borderRadius: 15,
      width: 95,
      marginLeft: 10,
      height: 33
    },
    buttonText: {
      color: 'white',
      alignContent: 'center',
      marginLeft: 5,
      fontWeight: 'bold',
      alignItems: 'center'
    },
    PopularList: {
      marginTop: 10,
      marginLeft: 5
    },
    LatestList: {
      marginTop: 10,
      marginLeft: 5,
    },
    selectedCategoryButton: {
      backgroundColor: 'orange',
    },
    categoryText: {
      marginTop: 10,
      marginLeft: 10,
      marginBottom: -15,
      fontWeight: 'bold',
      color: '#fff'
    },
    playIconContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      padding:10,
      borderRadius:70,
     backgroundColor:'lightgrey',
      transform: [{ translateX: -15 }, { translateY: -15 }],
    },
  });

  useEffect(() => {
    if (locale === "en-LB") {
      setLocale("en-US")
    } else if (locale == "en-US") {
      setLocale("en-US")
    }
    else {
      setLocale("ar-AE")
    }
   getPopularMovies();
  }, []);

  const getVideo = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: apiKey,
          language: locale,
        },
      })
      .then((response) => {
        const videos = response.data.results;
        if (videos.length > 0) {
          const videoKey = videos[0].key;
          const videoUrl = `https://www.youtube.com/watch?v=${videoKey}`;
          console.log(videoUrl);
          Linking.openURL(videoUrl).catch((error) => {
              console.error('Error opening URL:', error);
            });
        } else {
          console.log(`No video trailers available for movie with ID ${movieId}.`);
        }
      })
      .catch((error) => {
        console.error('Error fetching movie videos:', error);
      });
  };

  const handleImageClick = (movieId) => {
    getVideo(movieId);
  };

  const getPopularMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          language: locale,
          sort_by: 'popularity.desc',
          page: 1,
        },
      })
      .then((response) => {
        const firstTenMovies = response.data.results.slice(0, 10);
        setPopularMovies(firstTenMovies);
      })
      .catch((error) => {
        console.error('Error fetching popular movies:', error);
      });
  };
  return (
    <View style={{ backgroundColor: "black" }}>
      <ScrollView style={{paddingHorizontal:12}}>
        {popularMovies.map((item) => (
          // <View key={item?.id} style={locale == "en-US" || "en-LB" ? styles.movieContainer : styles.movieContainer2}>
            <TouchableOpacity key={item?.id} style={styles.movieContainer2} onPress={() => handleImageClick(item?.id)}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item?.poster_path}` }}
                style={styles.poster}
              />
              <View style={styles.playIconContainer}>
                <FontAwesomeIcon icon={faPlay} size={30} color="white" />
              </View>
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );}
export default WatchList;
