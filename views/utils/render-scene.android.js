import React from "react-native";

const {
    StyleSheet,
    BackAndroid
} = React;

const styles = StyleSheet.create({
    scene: {
        flex: 1
    }
});

let _navigator;

BackAndroid.addEventListener("hardwareBackPress", () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();

        return true;
    }

    return false;
});

export default (route, navigator) => {
    _navigator = navigator;

    return (
        <route.component
            {...route.passProps}
            navigator={navigator}
            style={styles.scene}
        />
    );
};
