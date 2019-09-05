/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import DatePicker from 'react-native-light-date-picker';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '点击选择日期',
      changedText: '',
      pickedText: ''
    }
  }
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <TouchableOpacity style={styles.button} onPress={()=>{
            this.datePicker.show();
          }}
          >
            <Text>{ this.state.text }</Text>
          </TouchableOpacity>
          {
            Platform.OS === 'ios' && <Text style={styles.text} >日期变化:<Text>{ this.state.changedText }</Text></Text>
          }
          <Text style={styles.text} >确认选择:<Text>{ this.state.pickedText }</Text></Text>
          <DatePicker ref={(ref)=>{ this.datePicker = ref; }}
            dateFormat={'yyyy/MM/dd'}
            date={new Date(2018, 7, 8)}
            minimumDate={new Date(2008, 7, 8)}
            maximumDate={new Date(2020, 7, 8)}
            onDatePicked={(selectedDate, selectedDateFormat)=>{
              this.setState({
                pickedText: selectedDateFormat
              })
            }}
            onCanceled={()=>{

            }}
            // iOS only
            onDateChanged={(date, dateFormat)=>{
              this.setState({
                changedText: dateFormat
              })
            }}
            title={'选择日期'}
            // Android only
            onError={(error)=>{
              const { message } = error;
            }}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
} 

const styles = StyleSheet.create({
  button: {
    margin: 20,
    padding: 15,
    borderWidth: 0.5,
    borderColor: '#999'
  },
  text: {
    margin: 20
  }
});
