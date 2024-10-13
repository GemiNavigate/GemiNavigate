import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
    backgroundColor: '#fafafa', 
    borderRadius: 25,
    paddingHorizontal: 15,
    width: '90%',
    marginBottom: 20,
    fontSize: 16, 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30, 
    right: 20,
    zIndex: 2,
    backgroundColor: '#fff', 
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#007BFF', 
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF', 
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20, 
    left: 120,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

function SearchScreen({ navigation }) {
  const [query, setQuery] = useState(''); 

  const handleInputChange = (text) => {
    setQuery(text); 
  };

  const handleSubmit = () => {
    if (query.trim()) {
      // sending the query to a backend service
      console.log("Submitted query:", query);
      Alert.alert("Query Submitted", `You entered: ${query}`);
      // reset the input field
      setQuery('');
    } else {
      Alert.alert("Input Error", "Please enter a query.");
    }
  };

  return (
    <View style={styles.container}>
      {/* input box  */}
      <TextInput
        style={styles.input}
        placeholder="Enter your query here"
        placeholderTextColor="#b0b0b0" 
        value={query}
        onChangeText={handleInputChange} // Update state when text changes
      />
      {/* submit button  */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit} // Call the function to handle submission
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      {/* back to map  */}
      <TouchableOpacity
        style={[styles.buttonContainer, {left: 20, width: 80}]} // Adjust position
        onPress={() => navigation.navigate('GoogleMaps')}
      >
        <Text style={styles.buttonText}>Map</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SearchScreen;


