import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Linking,
    View,
    Text,
    Alert,
    Image,
    Share
} from 'react-native';

import colors from "../constants/colors";
import WebView from 'react-native-webview';
import Button from "../components/Button";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { GetStoreData } from '../helpers/General';

class ExportScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    onShare = async () => {
        try {
            const locationArray = await GetStoreData('LOCATION_DATA');
            var locationData;

            if (locationArray !== null) {
                locationData = JSON.parse(locationArray);
            } else {
                locationData = [];
            }

            const result = await Share.share({
                message: JSON.stringify(locationData)
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
    }

    backToMain() {
        this.props.navigation.navigate('LocationTrackingScreen', {})
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text onPress={() => this.backToMain()} style={styles.backArrow}> &#8249; </Text>
                    <Text style={styles.sectionDescription}>Export</Text>
                </View>


                <View style={styles.main}>
                    <Text style={styles.mainText}>You can share you location trail with anyone using the Share button below.  Once you press the button it will ask you with whom and how you want to share it.</Text>
                    <Text style={styles.mainText}>Location is shared as a simple list of times and coordinates, no other identifying information.</Text>
                    <View style={styles.block}>
                        <Button onPress={this.onShare} title="Share" />
                    </View>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // Container covers the entire screen
    container: {
        flex: 1,
        flexDirection: 'column',
        color: colors.PRIMARY_TEXT,
        backgroundColor: colors.APP_BACKGROUND,
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 38,

        padding: 0
    },
    subHeaderTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 22,
        padding: 5
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        textAlignVertical: 'top',
        alignItems: 'center',
        width: "95%"
    },
    block: {
        margin: 20,
        width: "75%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainText: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '400',
        textAlignVertical: 'center',
        padding: 20,
    },

    headerContainer: {
        flexDirection: 'row',
    },
    backArrow: {
        fontSize: 60,
        lineHeight: 60,
        fontWeight: '400',
        marginRight: 5,
        textAlignVertical: 'center'
    },
    sectionDescription: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: '800',
        textAlignVertical: 'center'
    },
});

export default ExportScreen;
