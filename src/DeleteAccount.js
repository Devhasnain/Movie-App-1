import React, { useEffect, useState } from 'react';
import {SafeAreaView} from 'react-native';
import * as Localization from 'expo-localization';
import { WebView } from 'react-native-webview';

const DeleteAccount = () =>{
  const [locale, setLocale] = useState(Localization.locale);
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScaqpJ4y8dtcLYq81_c3fs7qNWc6bk5wXXCmRwzsWLSvGChgA/viewform?usp=sf_link';
  
  useEffect(() => {
    if (locale === 'en-LB') {
      setLocale('en-US');
    } else if (locale == 'en-US') {
      setLocale('en-US');
    } else {
      setLocale('ar-AE');
    }
  }, [ locale]);

    return(
        <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: formUrl }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    )
}

export default DeleteAccount;