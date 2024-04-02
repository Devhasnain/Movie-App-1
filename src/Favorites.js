import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Alert } from 'react-native';
import { dark, light } from './Colors'
import { db } from "./config/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization'
const Favorites = ({route}) => {
  const { colorTheme } = route.params;
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesWatchlist, setCategoriesWatchlist] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredMoviesWatchlist, setFilteredMoviesWatchlist] = useState([]);
  const [favoriteMoviesWatchlist, setFavoriteMoviesWatchlist] = useState([]);
  const [displayMovies, setDisplayMovies] = useState([]);
  const textColor = colorTheme === 'dark' ? dark.TEXT : light.TEXT;
  const backgroundColor = colorTheme === 'dark' ? dark.BACKGROUND : light.BACKGROUND;
  const ButtonsColor = colorTheme === 'dark' ? dark.BUTTON : light.BUTTON;
  const ContainerColor = colorTheme === 'dark' ? dark.CONTAINER : light.CONTAINER;
  const [locale, setLocale] = useState(Localization.locale);
  const [selectedCategory, setSelectedCategory] = useState(locale === 'en-US' || "en-LB" ? 'All' : 'الكل');
  const [activeNav, setActiveNav] = useState(null);
  const navigation = useNavigation();
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
      padding: 9,
      backgroundColor: ContainerColor,
      borderRadius: 20,
      marginTop: 15,
      width: '95%',
      marginLeft: 10,

    },
    movieContainer2: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      padding: 9,
      backgroundColor: ContainerColor,
      borderRadius: 20,
      marginTop: 15,
      width: '95%',
      marginRight:10
    },
    poster: {
      width: 110,
      height: 120,
      resizeMode: 'cover',
      marginRight: 10,
      borderRadius: 20
    },
    movieInfo: {
      flex: 1,

    },
    title: {
      fontSize: 15,
      marginBottom: 10,
      fontWeight: 'bold',
      color: textColor
    },
    genre: {
      fontSize: 13,
      color: '#666',
      marginBottom: 25,
      color: textColor,
      width:'70%'
    },
    rating: {
      fontSize: 10,
      marginTop: 20,
      color: textColor
    },
    clearButton: {
      color: 'grey',
      fontWeight: 'bold',
      marginLeft: 4,
      marginBottom: 80,

    },
    title2: {
      fontSize: 15,
      marginBottom: 10,
      fontWeight: 'bold',
      color: textColor,
      marginLeft: 20,
      marginTop: 5
    },
    genre2: {
      fontSize: 13,
      color: '#666',
      marginBottom: 25,
      color: textColor,
      display: 'flex',
    width:'70%',
    marginLeft:10
    },
    rating2: {
      fontSize: 10,
      marginTop: 20,
      color: textColor,
      marginLeft: 150
    },

    AddToFavorites: {
      backgroundColor: "orange",
      width: "32%",
      borderRadius: "10",
      padding: 5,
      marginLeft: "70%",

    },
    AddToFavorites2: {
      backgroundColor: "orange",
      width: "32%",
      borderRadius: "10",
      padding: 5,

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
    filterView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      borderBottomWidth: 2, 
      borderBottomColor: 'lightgrey',  // Set the borderBottomColor
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 10,
      width: '90%',
      marginLeft: '5%',
      marginTop: '5%',
      marginBottom: '-3%',
   
    },
    
    filterText: {
      fontSize: 16,
      fontWeight: 'bold', 
      color:'#fff'
    },
    filterText2: {
      fontSize: 16, 
      fontWeight: 'bold', 
      color:'#fff'
    },
  });
  useEffect(() => {
    if(locale === "en-LB"  ){
      setLocale("en-US")
    }else if(locale == "en-US"){
      setLocale("en-US")
    }
    else{
      setLocale("ar-AE")
    }
    setActiveNav("Favorites");
    setSelectedCategory('All');
    const fetchFavoriteMovies = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userEmail = user.email;

        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log(userData.email);
          console.log("movieee" + JSON.stringify(userData.favoriteMovies));
          const favoriteMoviesArray = Array.isArray(userData.favoriteMovies)
            ? userData.favoriteMovies
            : [userData.favoriteMovies];

          setFavoriteMovies(favoriteMoviesArray);
          setFilteredMovies(favoriteMoviesArray);
          setDisplayMovies(favoriteMoviesArray);
          const uniqueCategories = new Set();
          favoriteMoviesArray.forEach((item) => {
            item.genres?.forEach((genre) => {
              console.log(genre.name);
              {locale === "en-US" || locale === "en-LB" ?  uniqueCategories.add("All") : uniqueCategories.add("الكل")}
              uniqueCategories.add(genre.name);
            });
          });
          const categoriesArray = Array.from(uniqueCategories);
          console.log("category array" + categoriesArray);
          setDisplayCategories(categoriesArray);
          setCategories(categoriesArray);
          console.log("meee" + JSON.stringify(favoriteMovies));
        } else {
          console.log('User document does not exist');
        }
      } else {
        console.log('User not authenticated');
      }
    };
     const getWatchList = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log(userData.email);
          console.log("movieee" + JSON.stringify(userData.watchlistMovies));
          const favoriteMoviesArray = Array.isArray(userData.watchlistMovies)
            ? userData.watchlistMovies
            : [userData.watchlistMovies];


          setFavoriteMoviesWatchlist(favoriteMoviesArray);
          setFilteredMoviesWatchlist(favoriteMoviesArray);
          const uniqueCategories = new Set();
          favoriteMoviesArray.forEach((item) => {
            item.genres?.forEach((genre) => {
              console.log(genre.name);
              { locale == "en-US" || "en-LB" ? uniqueCategories.add("All") : uniqueCategories.add("الكل") }
              uniqueCategories.add(genre.name);
            });
          });
          const categoriesArray = Array.from(uniqueCategories);
          setCategoriesWatchlist(categoriesArray);
          setDisplayCategories(categoriesArray);
          console.log("meee" + favoriteMovies)
        } else {
          console.log('User document does not exist');
        }
      } else {

        console.log('User not authenticated');
      }

    };

    getWatchList();
    fetchFavoriteMovies();
  }, []);
  const handleSingleVideoPage = (id) => {

    navigation.navigate('VideoCard', { id , colorTheme});
  }
  const removeFromFavorites = async (movieId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        const userEmail = user.email;
  
        // Determine whether it's Favorites or Watchlist based on the activeNav state
        const collectionName = activeNav === "Favorites" ? "favoriteMovies" : "watchlistMovies";
  
        // Get the document reference
        const docRef = doc(db, "users", userEmail);
  
        // Fetch the document
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          // Get the user data
          const userData = docSnap.data();
  
          // Check if the movie exists in the array
          const updatedMoviesArray = userData[collectionName].filter((movie) => movie.id !== movieId);
  
          // Update the document with the new movies array
          await updateDoc(docRef, {
            [collectionName]: updatedMoviesArray,
          });
  
          // Update the state based on the activeNav
          if (activeNav === "Favorites") {
            setFavoriteMovies(updatedMoviesArray);
            setFilteredMovies(updatedMoviesArray);
            setDisplayMovies(updatedMoviesArray);
          } else {
            setFavoriteMoviesWatchlist(updatedMoviesArray);
            setFilteredMoviesWatchlist(updatedMoviesArray);
            setDisplayMovies(updatedMoviesArray);
          }
        } else {
          console.log('User document does not exist');
        }
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error removing movie from favorites:', error.message);
    }
  };
  

  // const removeFromFavorites = async (movieId) => {
  //   try {
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (user) {
  //       const userEmail = user.email;

  //       const docRef = doc(db, "users", userEmail);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         const currentFavoriteMovies =
  //           Array.isArray(userData.favoriteMovies)
  //             ? userData.favoriteMovies
  //             : [userData.favoriteMovies];
  //         const updatedFavoriteMovies = currentFavoriteMovies.filter((item) => item.id !== movieId);
  //         const currentWatchlistMovies = Array.isArray(userData.watchlistMovies)
  //           ? userData.watchlistMovies
  //           : [userData.watchlistMovies];
  //         await setDoc(doc(db, "users", userEmail), {
  //           email: userEmail,
  //           favoriteMovies: updatedFavoriteMovies,
  //           watchlistMovies: currentWatchlistMovies
  //         });

  //         setFavoriteMovies(updatedFavoriteMovies);
  //         setFilteredMovies(updatedFavoriteMovies);
  //         setDisplayMovies(updatedFavoriteMovies);
  //         const uniqueCategories = new Set();
  //         updatedFavoriteMovies.forEach((item) => {
  //           item.genres?.forEach((genre) => {
  //             console.log(genre.name);
  //             {locale == "en-US" || "en-LB" ?  uniqueCategories.add("All") : uniqueCategories.add("الكل") }
  //             uniqueCategories.add(genre.name);
  //           });
  //         });
  //         const categoriesArray = Array.from(uniqueCategories);
  //         setCategories(categoriesArray);
  //       } else {
  //         console.log('User document does not exist');
  //       }
  //     } else {
  //       console.log('User not authenticated');
  //     }
  //   } catch (error) {
  //     console.error('Error removing from favorites:', error);
  //   }
  // };

  const handleCategoryClick = (category) => {
    if(activeNav=="Watchlist"){
      setSelectedCategory(category);
      console.log(category);
      if (category == "All") {
        setFavoriteMoviesWatchlist(favoriteMoviesWatchlist);
        setDisplayMovies(favoriteMoviesWatchlist);
      } else {
        console.log('movies' + favoriteMoviesWatchlist)
        const filteredMovies = favoriteMoviesWatchlist.filter((item) =>
          item.genres.some((genre) => genre.name === category)
        );
        setFilteredMoviesWatchlist(filteredMovies);
        setDisplayMovies(filteredMovies)
      }
    }else{
      setSelectedCategory(category);
      console.log(category);
      if (category == "All") {
        setFavoriteMovies(favoriteMovies);
        setDisplayMovies(favoriteMovies);
      } else {
        const filteredMovies = favoriteMovies.filter((item) =>
          item.genres.some((genre) => genre.name === category)
        );
        setFavoriteMovies(filteredMovies);
        setDisplayMovies(filteredMovies);
    }
   
  }};
  const setActiveFavorites = () =>{
    setActiveNav("Favorites");
    setDisplayMovies(favoriteMovies);
    setDisplayCategories(categories);
  };
  const setActiveWatchlist = () =>{
    setActiveNav("Watchlist");
    setDisplayMovies(favoriteMoviesWatchlist);
    setDisplayCategories(categoriesWatchlist);
  }
  return (
    <View style={{ backgroundColor: backgroundColor }}>
         <View style={styles.filterView}>
        <TouchableOpacity onPress={setActiveFavorites}>
          <Text style={[styles.filterText2, { color: activeNav === "Favorites" ? "orange" : "white" }]}>
            Favorites
          </Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={setActiveWatchlist}>
          <Text style={[styles.filterText2, { color: activeNav === "Watchlist" ? "orange" : "white" }]}>
            Watchlist
          </Text>
        </TouchableOpacity>

        </View>
      <ScrollView vertical showsHorizontalScrollIndicator={false} style={{ marginTop: 40, height: 50, marginLeft:10 }}>
        <FlatList
          data={displayCategories}
          horizontal
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
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
      </ScrollView>

      <ScrollView style={{ marginTop: 20, marginBottom: 0, height: 700 }}>

        {displayMovies.map((item) => (
          <View key={item?.id} style={ locale == "en-US" ? styles.movieContainer : styles.movieContainer2}>
          <TouchableOpacity onPress={() => handleSingleVideoPage(item?.id)}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item?.poster_path}` }}
                style={styles.poster}
              />
            </TouchableOpacity>
            <View style={styles.movieInfo}>
              <Text style={ locale == "en-US" ? styles.title : styles.title2}>{item?.original_title}</Text>
              <Text style={ locale == "en-US" ? styles.genre : styles.genre2}>
                {item?.genres?.map((genre) => genre.name).join(', ')}
              </Text>
              <Text style={ locale == "en-US" ? styles.rating : styles.rating2}>{item?.vote_average}/10</Text>
            
            </View>
            <TouchableOpacity onPress={() => removeFromFavorites(item?.id)}>
              <Text style={styles.clearButton}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};

export default Favorites;
