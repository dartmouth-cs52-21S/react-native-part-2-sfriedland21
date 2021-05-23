/* eslint-disable global-require */
import auth from '@react-native-firebase/auth';
import { stat } from 'react-native-fs';
import { GoogleSignin } from '@react-native-community/google-signin';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, DeviceEventEmitter,
} from 'react-native';
import BackgroundUpload from 'react-native-background-upload';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

GoogleSignin.configure({
  webClientId: '694010251268-0aqui474o4j7v7srjerlc76mlmraqadr.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/youtube.upload'],
});

const Upload = (props) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(0);

  function onAuthStateChanged(newUser) {
    setUser(newUser);
    console.log(newUser);
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  async function signInOnStart() {
    await GoogleSignin.signInSilently();
  }

  async function retrieveVideo() {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.cancelled) {
        return result;
      }
    }
    return status;
  }

  async function upload() {
    const video = await retrieveVideo();
    console.log(video?.uri);

    if (video) {
      const { accessToken } = await GoogleSignin.getTokens();
      const { size } = await stat(video.uri);

      const uploadData = await axios({
        method: 'POST',
        url: 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,contentDetails',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json; charset=UTF-8',
          'x-upload-content-type': 'video/*',
          'x-upload-content-length': size,
        },
        data: {
          snippet: {
            title: 'RN Video Upload',
            categoryId: 24,
          },
          status: {
            privacyStatus: 'private',
          },
        },
      });

      const uploadUrl = uploadData?.headers?.location;
      const uploadOptions = {
        url: uploadUrl,
        path: video.uri,
        method: 'PUT',
        type: 'raw',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'video/*',
          'content-length': size,
        },
      };

      BackgroundUpload.startUpload(uploadOptions).then((uploadId) => {
        BackgroundUpload.addListener('progress', uploadId, (data) => {
          console.log(data.progress);
          setProgress(data.progress);

          if (progress === 100) {
            setProgress(0);
          }
        });
        BackgroundUpload.addListener('error', uploadId, (data) => {
          console.log(`Error: ${data.error}`);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    signInOnStart();

    BackgroundUpload.addListener('progress', null, (data) => {
      console.log(data.progress);
      setProgress(data.progress);

      if (progress === 100) {
        setProgress(0);
      }
    });

    return () => {
      subscriber(); // unsubscribe on unmount
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  if (initializing) return null;

  const signInButton = () => {
    return (
      <Animatable.View animation="fadeInLeft" delay={500}>
        <TouchableOpacity style={styles.button} onPress={onGoogleButtonPress}>
          <Text style={{ color: 'white' }}>Sign in with Google</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const uploadButton = () => {
    return (
      <Animatable.View animation="fadeInLeft" delay={500}>
        <TouchableOpacity style={styles.button} onPress={upload}>
          <Text style={{ color: 'white' }}>Upload Video</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const progressBar = () => {
    return (
      <>
        <LottieView source={require('../assets/196-material-wave-loading.json')} autoPlay loop style={{ marginBottom: 100 }} />
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
        <Text style={{ marginTop: 20 }}>{`${Math.floor(progress)}%`}</Text>
      </>
    );
  };

  return (
    <View style={styles.background}>
      {progress > 0 && progressBar()}
      {progress === 0 && (user ? uploadButton() : signInButton())}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f4511e',
    borderRadius: 5,
  },
  progressBar: {
    width: '80%',
    height: 25,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
  },
  progress: {
    position: 'absolute',
    left: 0,
    height: 25,
    backgroundColor: '#f4511e',
    borderRadius: 5,
  },
});

export default Upload;
