import React from 'react';
import {
  View, StyleSheet, Text, Dimensions, TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const UploadHeader = ({ title }) => {
  const navigation = useNavigation();
  const isUpload = title === 'Upload a Video';

  return (
    <View style={headerStyles.header}>
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>{title}</Text>
      {!isUpload
        ? (
          <TouchableOpacity style={headerStyles.uploadIcon} onPress={() => { navigation.navigate('Upload'); }}>
            <Ionicons name="upload" size={26} color="#fff" />
          </TouchableOpacity>
        )
        : (
          <TouchableOpacity style={headerStyles.closeIcon} onPress={() => { navigation.goBack(); }}>
            <Ionicons name="times" size={26} color="#fff" />
          </TouchableOpacity>
        )}
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#f4511e',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    width: Dimensions.get('window').width,
  },
  uploadIcon: {
    position: 'absolute',
    right: 15,
  },
  closeIcon: {
    position: 'absolute',
    left: 15,
  },
});

export default UploadHeader;
