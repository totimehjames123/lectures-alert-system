import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FormInput from './FormInput'; // Adjust path as needed

function SearchableList({ data, searchKey, placeholder, renderItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null); // State to track selected item

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      const filtered = data?.filter(item =>
        item[searchKey]?.toLowerCase()?.includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchQuery(item[searchKey]); // Set the search field value to the selected item
    setFilteredData([]); // Clear the list after selection
  };

  return (
    <View>
      <FormInput
        moreClass="mb-4"
        label={placeholder}
        icon="search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item?._id} // Assuming each item has a unique _id
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            {renderItem({ item })}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No results found.</Text>}
      />
    </View>
  );
}

export default SearchableList;
