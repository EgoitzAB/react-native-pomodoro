import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, Text, View, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from 'expo-av';


const colors = ["#F7DC6F", "#A2D9CE", "#D7DB5E"]


export default function App() {
  const [time, setTime] = useState(25*60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);
  const optionsTimes = {
    0: 25,  
    1: 5,  
    2: 15,  
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 10);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setTime(optionsTimes[currentTime] * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);    
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/opening-beer-can-6336.mp3")
    )
    await sound.playAsync();
  }
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
    <View 
    style={{ 
      flex: 1,
      paddingHorizontal:15, 
      paddingTop: Platform.OS === "android" && 50,
   }}>
      <Header 
        currentTime={currentTime} 
        setCurrentTime={setCurrentTime} 
        setTime={setTime}
      />
        <Timer time={time}/>
      <StatusBar style="auto" />
      <TouchableOpacity style={styles.button} onPress={handleStartStop}>
        <Text style={{color: "white", fontWeight: "bold"}}>{isActive ? "STOP": "START"}</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 32, 
    fontWeight: 'bold',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  }
});
