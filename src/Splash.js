
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './config/Firebase';
const Splash = () => {

  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      retrieve();
      // navigation.navigate('MovieList')
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  const retrieve = async () => {
    console.log("hii")
    const userEmail = await AsyncStorage.getItem('email');
    const userPass = await AsyncStorage.getItem('password');
    if (userEmail && userPass) {
      try {
        const userDocRef = doc(db, 'users', userEmail);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.isActive) {
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPass);
            navigation.navigate('Recomindings');
          } else {
            navigation.navigate('Recomindings');
          }
        }
      } catch (error) {
        console.error('Login Error:', error);
        navigation.navigate('LoginScreen', { colorTheme: 'dark' });
      }
    } else {
      navigation.navigate('MovieList',{ colorTheme: 'dark' } );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <Image source={require('./images/splash.jpeg')} style={styles.image} />
      </View>
    </View>
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
  }
});

export default Splash;
