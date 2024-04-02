import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert
} from "react-native";
import { dark, light } from './Colors'
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config/Firebase";
import { auth } from "./config/Firebase";
import * as Localization from 'expo-localization';
const LoginScreen = ({route}) => {
  const {colorTheme} = route.params;
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [locale, setLocale] = useState(Localization.locale);
  const backgroundColor = colorTheme === 'dark' ? dark.BACKGROUND : light.BACKGROUND;
  const textColor = colorTheme === 'dark' ? dark.TEXT : light.TEXT;
  const navigation = useNavigation();

  useEffect(() => {
    if(locale === "en-LB"  ){
      setLocale("en-US")
    }else if(locale == "en-US"){
      setLocale("en-US")
    }
    else{
      setLocale("ar-AE")
    }
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(!authUser){
        setLoading(false);
        navigation.navigate('SignUpScreen', {colorTheme})
      }
      if(authUser){
        navigation.replace("MovieList");
      }
    });
    return unsubscribe;
  },[])
  
  const login = async () => {
    if (email === "" || password === "") {
      Alert.alert(
        "Invalid Details",
        "Please fill in all the details",
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
    } else {
      setLoading(true);
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user.email);
        await AsyncStorage.setItem("email", user.email);
        await AsyncStorage.setItem("password", password);
        const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        userData.isActive = true;
        await setDoc(userDocRef, userData);
      }
        navigation.navigate('MovieList', { colorTheme });
        setLoading(false);
      } catch (error) {
        console.error("Login Error:", error);
        Alert.alert('Invalid Credentials');
        setLoading(false);
      }
      
    }
  };

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
               placeholder={locale == "en-US" ? 'Email'  :'  بريد إلكتروني' }
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
              placeholder={locale == "en-US" ? 'Password'  : 'كلمة المرور '}
              placeholderTextColor={textColor}
              style={{
                fontSize: password ? 16 : 16,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
                marginLeft:  13,
                width: 300,
                marginVertical: 20,
                color:colorTheme === 'dark' ? "#ffff" : "#000",
              }}
            />
          </View>
          <Pressable
            onPress={login}
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
            {locale === "en-US" ? "Login" : "تسجيل"}
          </Text>
        )}
      </Pressable>
          <Pressable onPress={() => navigation.navigate("SignUpScreen", {colorTheme})} style={{ marginTop: 20 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                color: textColor,
                fontWeight: "500",
              }}
            >
               {locale === 'en-US' ? ' Dont have a account? Sign Up' : 'ليس لديك حساب؟ اشتراك'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default LoginScreen;
