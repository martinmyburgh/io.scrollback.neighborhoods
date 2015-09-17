import React from "react-native";

const {
    StyleSheet,
    Text,
    View,
    Image
} = React;

const styles = StyleSheet.create({
    author: {
        flexDirection: "row",
        paddingTop: 8,
        paddingBottom: 8
    },
    name: {
        color: "#999",
        fontSize: 12,
        lineHeight: 21,
        marginLeft: 8
    },
    avatar: {
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: "#673AB7"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 8
    }
});

export default class CardAuthor extends React.Component {
    render() {
        return (
            <View {...this.props} style={[ styles.author, this.props.style ]}>
                <View style={styles.avatar}>
                    <Image source={{ uri: this.props.user.picture }} style={styles.image} />
                </View>
                <Text style={styles.name}>{this.props.user.displayName}</Text>
            </View>
        );
    }
}

CardAuthor.propTypes = {
    user: React.PropTypes.shape({
        picture: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired
    }).isRequired
};
