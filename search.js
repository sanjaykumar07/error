import React from 'react';
import { Text, View,TextInput,TouchableOpacity,FlatList } from 'react-native';
import db from '../config'
export default class Searchscreen extends React.Component {

  constructor(){
    super();
    this.state = {
      searchText:''
    }
  }

  fetchTransactions= async()=>{
    var searchText = this.state.searchText
    var searchText2 = searchText.toUpperCase()
    var letters = searchText2.split("")
    console.log(letters)
    if(letters[0]==="B"){
      console.log("it is book")
      const transactions = await db.collection('transactions').get();
      console.log(transactions)
      transactions.docs.map((doc)=>{
        this.setState({
          transactions : [...this.state.transactions,doc.data()]
        })
      })
    }else if(letters[0]==="S"){
      
    }
  }
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput style={{borderWidth:3,borderColor:'red'}} placeholder="Enter ID" onChangeText={text=>{this.setState({searchText : text})}}/>
          <TouchableOpacity
          style={{backgroundColor:'green'}}
          onPress={this.fetchTransactions}
          >
            <Text>Search</Text>
          </TouchableOpacity>
          <FlatList 
           data = {this.state.transactions}
           keyExtractor = {(item,index)=>{index.toString}}
           renderItem = {({item})=>(
             <view>
               <Text>{item.bookId}</Text>
             </view>
           )}
          />
        </View>
      );
    }
  }
