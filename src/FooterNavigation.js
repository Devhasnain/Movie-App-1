
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dark, light } from './Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouseUser, faSearch, faFilm,faHeart,faUser } from '@fortawesome/free-solid-svg-icons';
import * as Localization from 'expo-localization'

const translations = {
  en: {
    home: 'Home',
    search: 'Search',
    watchlist: 'Trailer',
    favorites: 'My Movies',
    me: 'Me',
  },
  ar: {
    home: 'الرئيسية',
    search: 'بحث',
    watchlist: 'تريلر',
    favorites: 'أفلامي',
    me: 'أنا',
  },
};

const FooterNavigation = ({ marginTop, height , colorTheme}) => {

  const navigation = useNavigation();
  const backgroundColor = colorTheme === 'dark' ? dark.FOOTER : light.FOOTER;
  const [locale, setLocale] = useState('');
  const [translatedText, setTranslatedText] = useState(translations.en); 

  useEffect(() => {
    setLocale(Localization.locale);
    if (Localization.locale.startsWith('ar')) {
      setTranslatedText(translations.ar);
    } else {
      setTranslatedText(translations.en);
    }
  }, []);

  const footerStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: backgroundColor,
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    marginTop: marginTop,
    padding: 12,
    height: height,
  };

  const showSaved = () => {
    navigation.navigate('WatchList', {colorTheme});
  };
  const showFavorites = () => {
    navigation.navigate('Favorites', {colorTheme});
  };
  const searchMovies = () => {
    navigation.navigate('Search', {colorTheme});
  };
  const profileScreen = () => {
    navigation.navigate('Profile', {colorTheme});
  };

  const styles = StyleSheet.create({
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#333',
      borderTopWidth: 1,
      borderColor: 'lightgray',
      paddingVertical: 10,
      marginTop: -80,
      padding: 10,
      height: 80,
    },
    footerItem: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#fff',
    },
  });

  return (
    <View style={[footerStyle]}>
      <TouchableOpacity style={styles.footerItem}>
        <FontAwesomeIcon icon={faHouseUser} style={{ color: "#ffffff", fontSize: 40 , marginBottom:5 }} />
        <Text style={[styles.footerText, { fontSize: 16 }]}>{translatedText.home}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={searchMovies}>
        <FontAwesomeIcon icon={faSearch} style={{ color: "#ffffff", fontSize: 40 , marginBottom:5 }} />
        <Text style={[styles.footerText, { fontSize: 16 }]}>{translatedText.search}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showSaved} style={styles.footerItem}>
        <FontAwesomeIcon icon={faFilm} style={{ color: "#ffffff", fontSize: 40, marginBottom:5 }} />
        <Text style={[styles.footerText, { fontSize: 16 }]}>{translatedText.watchlist}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showFavorites} style={styles.footerItem}>
        <FontAwesomeIcon icon={faHeart} style={{ color: "#ffffff", fontSize: 40 , marginBottom:5}} />
        <Text style={[styles.footerText, { fontSize: 16 }]}>{translatedText.favorites}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={profileScreen}>
        <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", fontSize: 40, marginBottom:5 }} />
        <Text style={[styles.footerText, { fontSize: 16 }]}>{translatedText.me}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterNavigation;