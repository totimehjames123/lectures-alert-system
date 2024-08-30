import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const SearchablePicker = ({ label, options, selectedValue, onSelect, moreClass }) => {
  const defaultOption = options.find(option => option.key === selectedValue);

  return (
    <View className={`${moreClass}`}>
      <SelectList
        setSelected={onSelect}
        data={options}
        defaultOption={defaultOption}
        search={true}
        searchPlaceholder={`Search for a ${label.toLowerCase()}`}
        placeholder={
          <View className="flex-row items-center gap-x-1">
            <Ionicons name="grid-outline" size={20} style={{color: "#6B7280"}}/>
            <Text className="text-gray-400" style={{fontFamily: "Poppins-Regular"}}>  Select {label}</Text>
        </View>

        }
        fontFamily='Poppins-Regular'
        inputStyles={{color: '#6B7280'}}
        boxStyles={styles.dropdownBox}
        dropdownStyles={styles.dropdown}
        notFoundText={`No such ${label.toLowerCase()} found.`}
        dropdownTextStyles={styles.dropdownText}
        searchInputStyles={styles.searchInput}
        renderItem={({ key, value, icon }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {value}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
 
  dropdownBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 14, // Increased from 13 to 15
    paddingHorizontal: 12, // Increased from 10 to 12
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'gray',

  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#333',
    marginRight: 8, // Adjust spacing as needed
  },
  itemText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default SearchablePicker;
