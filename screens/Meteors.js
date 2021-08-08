import React, { Component } from "react";
import { Text, View,FlatList,ImageBackground,Image,StyleSheet, SafeAreaView, Dimensions,Platform } from "react-native";
import axios from "axios";

//1mVSBJm0wZgclHk33NbZ7Alxdh5xqGDMQMM4nuYj

export default class MeteorScreen extends Component {
  constructor() {
    super();
    this.state = {
      meteors: {},
    };
  }

  getMeteors = () => {
    axios
      .get(
        "https://api.nasa.gov/neo/rest/v1/feed?api_key=1mVSBJm0wZgclHk33NbZ7Alxdh5xqGDMQMM4nuYj"
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  componentDidMount() {
    this.getMeteors();
  }

  keyExtractor = (item,index)=> index.toString()
  
  renderItem = ({item})=>{
    let meteor = item
    let bg_image, speed, size;

    if(meteor.threatScore <= 30){
      bg_image = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed3.gif");
      size = 100;

    }else if(meteor.threatScore<=75){
      bg_image = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed2.gif");
      size = 150;

    }else{
      bg_image = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed1.gif");
      size = 200;
    }
    return (
      <View>
      <ImageBackground 
      source={bg_image}
      style={styles.backgroundImage}
      >
              <View>
        <Text style={{color:'white',fontSize:40}}>{item.name}</Text>
        <Text style={{color:'white',fontSize:20}}>Closest to Earth - {item.close_approach_data[0].close_approach_date_full}</Text>
      </View>
      </ImageBackground>

      </View>
    )
  }

  render() {
    if (Object.keys(this.state.meteors).length == 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      );
    } else {
      let meteorArray = Object.keys(this.state.meteors).map((meteorDate) => {
        return this.state.meteors[meteorDate];
      });
      let meteors = [].concat.apply([], meteorArray);

      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatScore;
        console.log(threatScore);
      });
      
      meteors.sort(function(a,b){
        return b.threatScore - a.threatScore
      })
      meteors = meteors.slice(0,4)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SafeAreaView style={styles.droidSafeArea}/>
          <FlatList
          keyExtractor = {this.keyExtractor}
          data = {meteors}
          renderItem = {this.renderItem}
          horizontal = {true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  droidSafeArea:{
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  backgroundImage:{
    flex: 1,
    resizeMode : 'cover',
    width:Dimensions.get("window").width,
    height:Dimensions.get("window").height
  }

})
