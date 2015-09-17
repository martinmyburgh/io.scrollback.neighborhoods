import React from "react-native";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    summary: {
        color: "#999",
        fontSize: 14,
        lineHeight: 24
    }
});

export default class TextSummary extends React.Component {
    render() {
        return (
            <Text numberOfLines={3} {...this.props} style={[ styles.summary, this.props.style ]}>
                {this.props.text}
            </Text>
        );
    }
}

TextSummary.propTypes = {
    text: React.PropTypes.string.isRequired
};
