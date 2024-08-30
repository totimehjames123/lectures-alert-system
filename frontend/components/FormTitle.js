import { View, Text } from 'react-native'
import React from 'react'

const FormTitle = ({title, subTitle, moreClass}) => {
  return (
    <View className={moreClass}>
      <Text style={{fontFamily: 'Poppins-Regular'}} className="text-3xl" >{title}</Text>
      <Text style={{fontFamily: 'Poppins-Regular'}} className='text-xs text-gray-500'>{subTitle}</Text>
    </View>
  )
}

export default FormTitle