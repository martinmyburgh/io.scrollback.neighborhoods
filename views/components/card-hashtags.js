import React from "react-native";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	hashtags: {
		fontSize: 12,
		lineHeight: 21,
		color: "#2196F3"
	}
});

export default class CardHashtags extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
				(this.props.hashtags.length !== nextProps.hashtags.length) ||
				!this.props.hashtags.every((el, i) => el === nextProps.hashtags[i])
			);
	}

	render() {
		return (
			<Text {...this.props} style={[ styles.hashtags, this.props.style ]}>
				{this.props.hashtags.join(" ")}
			</Text>
		);
	}
}

CardHashtags.propTypes = {
	hashtags: React.PropTypes.arrayOf(React.PropTypes.string)
};
