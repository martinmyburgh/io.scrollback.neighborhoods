import React from "react-native";
import Icon from "./icon";
import GrowingTextInput from "./growing-text-input";

const {
	StyleSheet,
	Animated,
	View,
	TouchableHighlight,
	PixelRatio,
	DeviceEventEmitter
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .24)",
		borderTopWidth: 1 / PixelRatio.get()
	},
	inputContainer: {
		flex: 1,
		paddingHorizontal: 16
	},
	input: {
		color: "#000",
		backgroundColor: "transparent",
		paddingVertical: 16,
		margin: 0
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		color: "#000",
		fontSize: 24,
		opacity: 0.5,
		margin: 16
	}
});

export default class ChatInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			keyboardHeightAnim: new Animated.Value(0),
			text: this._getComputedText(this.props)
		};
	}

	componentWillMount() {
		this._keyboardDidShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
		this._keyboardDidHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
	}

	componentWillReceiveProps(nextProps) {
		const text = this._getComputedText(nextProps, this.state.text);

		if (text && text !== this.state.text) {
			this.setState({ text }, () => this._input.focusKeyboard());
		}
	}

	componentWillUnmount() {
		this._keyboardDidShowSubscription.remove();
		this._keyboardDidHideSubscription.remove();
	}

	_keyboardDidShow(e) {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: e.endCoordinates.height
		}).start();
	}

	_keyboardDidHide() {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: 0
		}).start();
	}

	_sendMessage() {
		this.props.sendMessage(this.state.text);

		this.setState({
			text: ""
		});
	}

	_onValueChange(text) {
		this.setState({
			text
		});
	}

	_getComputedText(opts, value = "") {
		let newValue = value;

		if (opts.quotedText) {
			if (newValue) {
				newValue += "\n\n";
			}

			newValue += "> " + (opts.replyTo ? "@" + opts.replyTo + " - " : "") + opts.quotedText + "\n\n";
		} else if (opts.replyTo) {
			newValue += `@${opts.replyTo} `;
		}

		return newValue;
	}

	render() {
		return (
			<View {...this.props}>
				<View style={styles.container}>
					<GrowingTextInput
						ref={c => this._input = c}
						value={this.state.text}
						onValueChange={this._onValueChange.bind(this)}
						style={styles.inputContainer}
						inputStyle={styles.inputStyle}
						underlineColorAndroid="transparent"
						placeholder="Type a message"
						numberOfLines={7}
					/>

					<TouchableHighlight onPress={this._sendMessage.bind(this)} underlayColor="rgba(0, 0, 0, .16)">
						<View style={styles.iconContainer}>
							<Icon name="send" style={styles.icon} />
						</View>
					</TouchableHighlight>
				</View>
				<Animated.View style={{ height: this.state.keyboardHeightAnim }} />
			</View>
		);
	}
}

ChatInput.propTypes = {
	sendMessage: React.PropTypes.func.isRequired,
	quoteMessage: React.PropTypes.func.isRequired,
	replyToMessage: React.PropTypes.func.isRequired,
	quotedText: React.PropTypes.string,
	replyTo: React.PropTypes.string
};
