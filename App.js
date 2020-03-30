import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import AudioRecord from 'react-native-audio-record';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      recording: false
    }
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      check(PERMISSIONS.IOS.MICROPHONE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            request(PERMISSIONS.IOS.MICROPHONE).then(result => {
              console.log(result)
            });
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.MICROPHONE).then(result => {
              console.log(result)
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error)
      });
    }
  }

  async componentDidMount() {
    await this._checkPermission();

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav',
      tmpFile: 'test1.wav'
    };

    await AudioRecord.init(options);

    AudioRecord.on('data', data => {
      
    });
  }

  async handleStateChange() {
    if (this.state.recording) {
      console.log('stopped recording')
      await AudioRecord.stop()
      this.setState({
        recording: false
        })
    } else {
      console.log('start recording')
      await AudioRecord.start()
      this.setState({
        recording: true
        })
    }
  }

  render() {

    var _color = 'red';
    if (this.state.recording) {
      _color = 'red'
    } else {
      _color = 'green'
    }

    return (
      <View style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          style={{
            width: 200,
            height: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: _color,
            borderRadius: 10
            }}
          onPress={() => this.handleStateChange()}
        >
          <Text style={{color: '#FFFFFF'}}>
            {this.state.recording? 'STOP RECORDING': 'START RECORDING'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
