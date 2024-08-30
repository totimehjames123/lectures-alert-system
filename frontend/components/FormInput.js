import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

function FormInput({ 
  moreClass, 
  secureTextEntry = false, 
  label, 
  icon, 
  disabled = false,
  onChangeText,  // Added prop for handling text changes
  value = ''     // Added prop for controlled input value
}) {
  const [showPassword, setShowPassword] = useState(false)

  // Determine if the input is a password field
  const isPassword = secureTextEntry

  return (
    <View className={`px-3 flex-row items-center bg-white border rounded-md border-gray-300 ${moreClass}`}>
      {icon && (
        <Ionicons name={icon} size={20} color="gray" className="mr-2" />
      )}
      <View className="flex-1">
        <View className="relative">
          <TextInput
            className={`p-3 bg-white text-gray-500 border-none rounded-md pl-${icon ? '10' : '2'}`}
            placeholder={`Enter your ${label.toLowerCase()}`}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChangeText}   // Attach the onChangeText handler
            value={value}                // Attach the value prop for controlled input
            style={{fontFamily: 'Poppins-Regular'}}
            editable={!disabled}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-3"
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="gray"
                
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default FormInput
