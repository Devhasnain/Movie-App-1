import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { dark, light } from './Colors'
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "./config/Firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from "firebase/firestore"
import * as Localization from 'expo-localization';

const SignUpScreen = ({route}) => {
  const {colorTheme} = route.params
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [locale, setLocale] = useState(Localization.locale);
  const backgroundColor = colorTheme === 'dark' ? dark.BACKGROUND : light.BACKGROUND;
  const textColor = colorTheme === 'dark' ? dark.TEXT : light.TEXT;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(locale === "en-LB"  ){
      setLocale("en-US")
    }else if(locale == "en-US"){
      setLocale("en-US")
    }
    else{
      setLocale("ar-AE")
    }
  }, []);
  const register = () => {
    if (email === "" || password === "") {
      Alert.alert(
        "Invalid Details",
        "Please fill all the details",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      setLoading(false);
      return;
    }
    else if(password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
      setLoading(false);
    }else {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("User registered:", user.email);
        Alert.alert("Account Created Successfully!");
        setEmail('');
        setPassword('');
        navigation.navigate('MovieList', {colorTheme});
        await AsyncStorage.setItem("email", user.email);
        setDoc(doc(db, "users", user.email), {
          email: user.email,
          favoriteMovies: [],
          watchlistMovies: [],
          isActive:true
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Registration Error:", error);
      });
    }
  };
  const LoggedIn = () => {
    try {
      navigation.navigate('LoginScreen', {colorTheme});
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: "center",
        padding: 10,
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
          }}
        >
        </View>
        <View style={{ marginTop: 50 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#ccc"
            />
            <TextInput
              placeholder={locale == "en-US" ? 'Email' : '  بريد إلكتروني'}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={textColor}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
                marginLeft: 13,
                width: 300,
                marginVertical: 10,
                color:colorTheme === 'dark' ? "#ffff" : "#000",
              }}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="key-outline" size={24} color="#ccc" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder={locale == "en-US" ? 'Password' : 'كلمة المرور '}
              placeholderTextColor={textColor}
              style={{
                fontSize: password ? 16 : 16,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
                marginLeft: 13,
                width: 300,
                marginVertical: 20,
                color:colorTheme === 'dark' ? "#ffff" : "#000",
              }}
            />
          </View>
          <Pressable
            onPress={register}
            style={{
              width: 200,
              backgroundColor: "orange",
              padding: 15,
              borderRadius: 7,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
         {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
            {locale === "en-US" ? "Register" : "تسجيل"}
          </Text>
        )}
      </Pressable>
          <TouchableOpacity onPress={LoggedIn} style={{ marginTop: 20 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                color:textColor,
                fontWeight: "500",
              }}
            >
              {locale === 'en-US' ? 'Already have an account? Sign in' : 'هل لديك حساب؟ تسجيل الدخول'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default SignUpScreen;
