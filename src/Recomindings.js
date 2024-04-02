
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView ,Alert, TouchableOpacity, Linking, Text, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import * as Localization from 'expo-localization';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRemove, faPlay} from '@fortawesome/free-solid-svg-icons';
const Recomindings = () => {
    const navigation = useNavigation();
    const apiKey = '5687eb97cfae2d5641269e1c0c74eefc';
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [locale, setLocale] = useState(Localization.locale);
  
    useEffect(() => {
      if (locale === 'en-LB') {
        setLocale("en-US");
      } else if (locale === "en-US") {
        setLocale("en-US");
      } else {
        setLocale(locale + "-AE");
      }
      getRecommendedMovies();
    }, []);
  
    const getRecommendedMovies = () => {
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
          setRecommendedMovies(response.data.results.slice(0, 4));
        })
        .catch((error) => {
          console.error('Error fetching popular movies:', error);
        });
    };
  
    const handleImageClick = (movieId) => {
      getVideo(movieId);
    };
  
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
    const removeRecommendation = () =>{
        navigation.navigate('MovieList');
    }
    const AddToFavorites = async (newMovie) => {
      console.log("newMovie: " + (newMovie));
      
      navigation.navigate('VideoCard', { id: newMovie, colorTheme: 'dark' });
      // const auth = getAuth();
      // const user = auth.currentUser;
    
      // if (user) {
      //   const userEmail = user.email;
    
      //   try {
      //     const docRef = doc(db, "users", userEmail);
      //     const docSnap = await getDoc(docRef);
    
      //     if (docSnap.exists()) {
      //       const userData = docSnap.data();
    
      //       const currentWatchlistMovies = Array.isArray(userData.watchlistMovies)
      //         ? userData.watchlistMovies
      //         : [userData.watchlistMovies];
    
      //       const currentFavoriteMovies = Array.isArray(userData.favoriteMovies)
      //         ? userData.favoriteMovies
      //         : [userData.favoriteMovies];
      //       console.log("current favs" + JSON.stringify(currentFavoriteMovies));
    
      //       const movieId = JSON.stringify(newMovie?.id);
      //       console.log("movie id " + movieId);
    
      //       if (movieId && !currentFavoriteMovies.some((existingMovie) => String(existingMovie.id) === movieId)) {
      //         const updatedFavoriteMovies = [...currentFavoriteMovies, newMovie];
    
      //         await setDoc(doc(db, "users", userEmail), {
      //           email: userEmail,
      //           watchlistMovies: currentWatchlistMovies,
      //           favoriteMovies: updatedFavoriteMovies,
      //         });
    
      //         const alertMessage = locale === 'ar-AE' ? 'تمت إضافة الفيلم إلى قائمة المشاهدة': 'Movie added to favorites';
      //         Alert.alert(
      //           alertMessage,
      //           undefined,
      //           [{ text: locale == "en-US" ? 'OK' : 'موافق', onPress: () => console.log('OK Pressed') }]
      //         );
      //       } else {
      //         const alertMessage = locale === 'ar-AE' ? 'الفيلم كان موجود بالفعل في قائمة المشاهدة' : 'Movie was already in favorites';
      //         Alert.alert(
      //           alertMessage,
      //           undefined,
      //           [{ text: locale == "en-US" ? 'OK' : 'موافق', onPress: () => console.log('OK Pressed') }]
      //         );
      //       }
      //     } else {
      //       console.log('User document does not exist');
      //     }
      //   } catch (error) {
      //     console.error('Error adding movie to watchlist:', error);
      //   }
      // } else {
      //   Alert.alert("Please login first");
      //   navigation.navigate('LoginScreen', {colorTheme:'dark'});
      //   console.log('User not authenticated');
      // }
    };
    
  
    return (
        <ScrollView>
            <View style={styles.upperHeader}>
          <Text style={styles.recommendedText}>RECOMMENDED </Text>
          <TouchableOpacity  style={{marginTop:'15%', marginLeft:'5%'}} onPress={removeRecommendation}>
          <FontAwesomeIcon icon={faRemove} style={{ color: '#000', fontSize: 40 , marginLeft:7, marginTop:'40%', fontWeight:'bold'}} />
          </TouchableOpacity>
          </View>
          <Swiper style={{ height: 600, marginTop: '4%' }} showsPagination={false} activeDotStyle={{ backgroundColor: 'orange', width: 20, height: 10 }}>
            {recommendedMovies.map((movie) => (
              <View key={movie.id} style={{ flex: 1 }} >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
                  style={{ flex: 1, borderRadius: 20, width: '90%', marginLeft: '5%' }}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.playIconContainer} onPress={() => handleImageClick(movie.id)}>
                <FontAwesomeIcon icon={faPlay} style={{ color: '#ffffff', fontSize: 30 , marginLeft:7}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playIconContainer2} onPress={() => AddToFavorites(movie.id)}>
               <Text style={{color:'#000', fontWeight:'bold', fontSize:17, marginLeft:'15%'}}>Check Movie</Text>
                </TouchableOpacity>
              </View> 
            ))}
          </Swiper>
        </ScrollView>
      );
    };
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 450,
    height: 950,

  },
  text: {
    color: '#ff4d4d',
    position: 'absolute',
    zIndex: 1,
    fontSize: 45,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  ImageContainer: {
    display: 'block'
  },
  recommendedText:{
   fontWeight:'bold',marginTop:60,
   fontSize:30, marginLeft:'18%'
  },
  addToFavoritesButtonText:{
    color:'#ffff',
    zIndex:1
  },
  addToFavoritesButton:{
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginTop: 60,
  
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15, 
    marginTop: -40, 
    zIndex: 1,
    padding:15,
    borderRadius:70,
   backgroundColor:'lightgrey'
  },
  playIconContainer2: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -100, 
    marginTop: -70, 
    zIndex: 1,
    backgroundColor:'white',
    padding:15,
    borderRadius:5,
    width:'50%'
  },
  
  upperHeader:{
    display:'flex', 
    flexDirection:'row'
  }
});

export default Recomindings;
