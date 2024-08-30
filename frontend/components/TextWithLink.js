import { View, Text, TouchableOpacity } from "react-native"

const TextWithLink = ({moreClass, title, buttonTitle, onPress}) => {
    return (
      <View className={`flex-row justify-between ${moreClass}`}>
        <Text style={{fontFamily: 'Poppins-Regular'}} className="text-gray-500 text-xs">{title}</Text>
        <TouchableOpacity onPress={() => onPress()}>
          <Text style={{fontFamily: 'Poppins-Regular'}}  className="text-yellow-500 text-[11px]">{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    )
}

export default TextWithLink