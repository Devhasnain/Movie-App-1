import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config/Firebase";
import { light , dark} from './Colors';
import * as Localization from 'expo-localization';

  const ProfileScreen = ({ route }) => {
  const { colorTheme } = route.params;
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const BackgroundColor = colorTheme === 'dark' ? dark.BACKGROUND : light.BACKGROUND;
  const textColor = colorTheme === 'dark' ? dark.TEXT : light.TEXT;
  const [locale, setLocale] = useState(Localization.locale);
  const auth = getAuth();

  useEffect(() => {
    if (locale === 'en-LB') {
      setLocale('en-US');
    } else if (locale == 'en-US') {
      setLocale('en-US');
    } else {
      setLocale('ar-AE');
    }
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      navigation.replace('LoginScreen',{colorTheme});
    }
  }, [auth, locale, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: BackgroundColor,
    },
    emailText: {
      fontSize: 18,
      marginBottom: 20,
      color: textColor,
    },
    logoutButton: {
      backgroundColor: 'orange',
      padding: 10,
      borderRadius: 5,
      width:120
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    deleteText:{
      color:'#0096FF',
      fontSize:16,
      marginTop:'5%',
      textDecorationLine:'underline'
    }
  });
    const handleLogout = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email
    try {
      const userDocRef = doc(db, "users", email);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
          userData.isActive = false;
          await setDoc(userDocRef, userData);
      }
        await signOut(auth);
        navigation.replace('MovieList', { colorTheme });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  const navigateDeleteAccount = () =>{
  navigation.navigate('DeleteAccount',{colorTheme});
}
  return (
    <View style={styles.container}>
      <Text style={styles.emailText}>Email: {userEmail}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>
          {locale === 'en-US' ? 'Logout' : 'تسجيل الخروج'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateDeleteAccount}>
      <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
