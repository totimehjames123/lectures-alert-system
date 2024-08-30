import Onboarding from "react-native-onboarding-swiper";


import { View, Text, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from "react-native";
import {OnboardingScreenContent} from "../utils/constants";
import CheckLoginAndNavigate from "../utils/CheckLoginAndNavigate";

const OnboardingScreen = ({ navigation }) => {

  const Next = ({ ...props }) => (
    <TouchableOpacity style={{paddingRight: 15, fontFamily: 'Poppins-Regular'}} {...props}>
      <Text style={{color: '#F59E0B', fontFamily: 'Poppins-Regular'}}>Next</Text>
    </TouchableOpacity>
  )

  const Done = ({ ...props }) => (
    <TouchableOpacity style={{paddingRight: 15}} {...props}>
      <Text style={{color: '#F59E0B', fontFamily: 'Poppins-Regular'}}>Get Started</Text>
    </TouchableOpacity>
  )

  const Skip = ({ ...props }) => (
    <TouchableOpacity style={{paddingLeft: 15}} {...props}>
      <Text style={{color: 'gray', fontFamily: 'Poppins-Regular'}} >Skip</Text>
    </TouchableOpacity>
  )

  const Dot = ({ isLight, selected }) => (
      <View
        style={{
          width: selected ? 30 : 7,
          height: 7,
          marginHorizontal: 3,
          borderRadius: 12,
          backgroundColor: selected ? 'black' : 'gray',
        }}
      />

  )


  return (
    <>
      <CheckLoginAndNavigate passedPath={"BottomTabNavigation"} failedPath={"OnboardingScreen"}/>
      <Onboarding 
        pages = { OnboardingScreenContent.map((data) => ({
          title: data.title,
          titleStyles: {color: 'black',  fontFamily: 'Poppins-Regular'},
          subtitle: data.subtitle,
          subTitleStyles: {color: 'gray', fontFamily: 'Poppins-Regular'},
          image: <Image source={data.image} style={{height: 190, width: 300}} resizeMode="cover"/>,
          backgroundColor: "#fff"
        }))}

        bottomBarColor="white"

        onSkip={() => navigation.navigate("Login")}
        onDone={() => navigation.navigate("Login")}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DotComponent={Dot}
        DoneButtonComponent={Done}
      />
    </>
  )
}

export default OnboardingScreen