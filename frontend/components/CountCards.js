import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const CountCards = ({title, value, textColor, iconColor, bgColor, onPress}) => {
  return (
    <View className={`${bgColor} rounded-md w-[160px] h-[85px] p-3 pb-0 mr-2`}>
      <Text className="text-xs text-gray-500" style={{fontFamily: 'Poppins-Regular'}}>{title}</Text>
      <Text className="text-3xl" style={{fontFamily: 'Poppins-Regular'}}>{value}</Text>
      <TouchableOpacity className="flex-1 flex-row-reverse gap-x-1 " onPress={() => onPress()} style={{width: 'auto'}}>
        <Ionicons name='arrow-forward' color={iconColor}/>
        <Text className={`text-[10px] ${textColor}`} style={{fontFamily: 'Poppins-Regular'}}>Check Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CountCards