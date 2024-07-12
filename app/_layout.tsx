// import { Stack } from "expo-router";
import React, {useState, useEffect} from "react";
import { StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppIntroSlider from "react-native-app-intro-slider";
import {Slides} from './Slider';

import AppState from "./AppState/AppState";
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
  const [ showHome, setShowHome ] = useState(false);

  const renderSlide = ({item}:any) => {
    return (
      <ThemedView style={{flex:1, backgroundColor: item.backgroundColor}}>
        <Image style={styles.img} source={item.image} />
        <ThemedView style={styles.contenitoreTesti}>
            <ThemedText style={styles.titolo}>{item.titolo}</ThemedText>
            <ThemedText style={styles.titolo}>{item.text}</ThemedText>
            <ThemedText style={styles.titolo}>{item?.textTwo}</ThemedText>
        </ThemedView>
      </ThemedView>
    )
  }

  const onDone = () => {
    AsyncStorage.setItem('hasLaunched', 'true');
    setShowHome(true);
  }

  const checkIsFirstLaunch = async () => {
    console.log('avvio del app e controllo storage')
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');

    console.log('vsalore di hasLaunched ', hasLaunched)

    if(hasLaunched === null) {
      setShowHome(false);
    } else {
      setShowHome(true);
    }
  }

  useEffect(() => {
    checkIsFirstLaunch();
  }, [])


  return showHome ? (
    <>
       <StatusBar backgroundColor="yellow"/>
      <AppState />
    </>
  ) : (
    <AppIntroSlider renderItem={renderSlide} data={Slides} onDone={onDone} />
  )

  // return  (
  //   <>
  //      <StatusBar backgroundColor="yellow"/>
  //     <AppState />
  //   </>
  // );
}

const styles = StyleSheet.create({
  img: {

  },
  contenitoreTesti: {

  },
  titolo: {

  },
  testo: {

  }
})