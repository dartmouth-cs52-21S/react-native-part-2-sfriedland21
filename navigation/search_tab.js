/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
// import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UploadHeader from '../components/header';
import Upload from '../components/upload';
import VideoList from '../components/video_list';
import VideoDetail from '../components/video_detail';

const Stack = createStackNavigator();

const SearchUploadNavigator = () => {
  return (
    <Stack.Navigator mode="modal" initialRouteName="SearchScreen">
      <Stack.Screen name="SearchScreen"
        component={VideoList}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitle: (props) => <UploadHeader {...props} title="YouTube Search" />,
        }}
      />
      <Stack.Screen name="Upload"
        component={Upload}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitle: (props) => <UploadHeader {...props} title="Upload a Video" />,
        }}
      />
    </Stack.Navigator>
  );
};

// nest stack navigator to handle two internal views
// "name" prop is the name of the route
const SearchTab = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search"
        component={SearchUploadNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Detail" component={VideoDetail} />
    </Stack.Navigator>
  );
};

export default SearchTab;
