import { TouchableOpacity, Text } from 'react-native'

const FormButton = ({title, onPress, disabled}) => {
  return (
      <TouchableOpacity disabled={disabled} className={`${disabled ? "bg-orange-200 " : "bg-orange-300"} rounded-md w-full p-4`} onPress={() => onPress()}>
        <Text style={{fontFamily: 'Poppins-Regular'}} className={`${disabled ? "text-gray-400" : "text-gray-600"} text-center`}>{title}</Text>
      </TouchableOpacity> 
  )
}

export default FormButton