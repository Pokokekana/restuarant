import React, { useState } from 'react';
import { SafeAreaView, View, Text , Pressable ,FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//   Create Stack Navigator       //
const Stack = createNativeStackNavigator();

//      HOME SCREEN        //
const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Chicken Salad', description: 'Fresh greens with grilled chicken', price: 80, course: 'Starters' },
    { id: '2', name: 'Beef Steak', description: 'Juicy and tender', price: 150, course: 'Mains' },
  ]);

  return (
    <ImageBackground source={require("./assets/chef_logo.png.jpg")} style={{flex: 1}}>
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Restaurant Menu</Text>
      <Text style={{fontSize:16, color:'#000', marginBottom:10}}> Welcome To my App!{menuItems.length}</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>R{item.price}</Text>
            <Text style={styles.itemText}>Course: {item.course}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddItem', { setMenuItems, menuItems })}
      >
        <Text style={styles.buttonText}>Add Menu Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Filter', { menuItems })}
      >
        <Text style={styles.buttonText}>Filter by Course</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </View>
    </ImageBackground>
  );
};

//         ADD ITEM SCREEN        //
const AddItemScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { menuItems, setMenuItems } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState('');

  const addItem = () => {
    // ✅ IF STATEMENTS FOR INPUT VALIDATION
    if (!name || !description || !price || !course) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price greater than 0.');
      return;
    }

    const newItem = {
      id: (menuItems.length + 1).toString(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      course: course.trim(),
    };

    setMenuItems([...menuItems, newItem]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Menu Item</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Price (R)"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        placeholder="Course (e.g. Starters, Mains, Desserts)"
        style={styles.input}
        value={course}
        onChangeText={setCourse}
      />

      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Save Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ---------- FILTER SCREEN ----------
const FilterScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { menuItems } = route.params;
  const [filter, setFilter] = useState('');

  const filteredItems = filter
    ? menuItems.filter((item: any) =>
        item.course.toLowerCase().includes(filter.toLowerCase())
      )
    : menuItems;

  // ✅ IF STATEMENT TO HANDLE NO MATCHES
  const noResults = filteredItems.length === 0;

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Filter by Course</Text>

      <TextInput
        placeholder="Enter course name (e.g. Mains)"
        style={styles.input}
        value={filter}
        onChangeText={setFilter}
      />

      {noResults ? (
        <Text style={styles.noResultText}>No items found for this course.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemText}>Course: {item.course}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ---------- MAIN APP ----------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  card: { backgroundColor: '#ADD8E6', padding: 10, borderRadius: 10, marginBottom: 10 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  itemText: { fontSize: 16, color: '#000' },
  noResultText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: { backgroundColor: '#000', padding: 12, borderRadius: 10, marginBottom: 10 },
  cancelButton: { backgroundColor: '#808080', padding: 12, borderRadius: 10, marginBottom: 10 },
  buttonText: { color: '#FFF', fontSize: 18, textAlign: 'center', fontWeight: '600' },
});
