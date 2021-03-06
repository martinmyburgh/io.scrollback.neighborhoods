/* @flow */

import React from 'react-native';
import NextButton from './NextButton';
import StatusbarWrapper from '../StatusbarWrapper';
import AppTextInput from '../AppTextInput';
import KeyboardSpacer from '../KeyboardSpacer';
import OnboardTitle from './OnboardTitle';
import OnboardParagraph from './OnboardParagraph';
import OnboardError from './OnboardError';
import Icon from '../Icon';
import VersionCodes from '../../modules/VersionCodes';
import Facebook from '../../modules/Facebook';
import Colors from '../../../Colors.json';

const {
	View,
	ScrollView,
	Image,
	StyleSheet,
	Platform,
	TouchableOpacity,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},

	inner: {
		alignItems: 'center',
		justifyContent: 'center'
	},

	avatar: {
		height: 96,
		width: 96,
		borderRadius: 48
	},

	avatarContainer: {
		margin: 16,
		height: 96,
		width: 96,
		borderRadius: 48,
		backgroundColor: Colors.placeholder
	},

	inputContainer: {
		width: 200,
		marginHorizontal: 16,
	},

	closeButtonContainer: {
		alignSelf: 'flex-start'
	},

	closeButton: {
		margin: 16,
		color: Colors.fadedBlack
	},
});

type Props = {
	error: Object;
	onComplete: Function;
	onChangeNick: Function;
	onChangeName: Function;
	nick: string;
	name: string;
	avatar: string;
	isLoading: boolean;
	isDisabled: boolean;
};

export default class UserDetails extends React.Component {
	static propTypes = {
		onComplete: React.PropTypes.func.isRequired,
		onChangeNick: React.PropTypes.func.isRequired,
		onChangeName: React.PropTypes.func.isRequired,
		nick: React.PropTypes.string,
		name: React.PropTypes.string,
		user: React.PropTypes.shape({
			picture: React.PropTypes.string
		}),
		error: React.PropTypes.object,
		isLoading: React.PropTypes.bool,
		isDisabled: React.PropTypes.bool,
	};

	props: Props;

	componentDidMount() {
		this._fetchFullName();
	}

	_fetchFullName = async () => {
		try {
			const res = await Facebook.sendGraphRequest('GET', '/me', { fields: 'name' }).then(JSON.parse);

			if (res && res.name && !this.props.name) {
				this.props.onChangeName(res.name);
			}
		} catch (e) {
			// ignore
		}
	};

	render() {
		const nick_color = this.props.error && this.props.error.field === 'nick' ? Colors.error : Colors.placeholder;
		const name_color = this.props.error && this.props.error.field === 'name' ? Colors.error : Colors.placeholder;

		return (
			<View style={styles.container}>
				<ScrollView keyboardShouldPersistTaps contentContainerStyle={[ styles.container, styles.inner ]}>
					<StatusbarWrapper />
					<TouchableOpacity style={styles.closeButtonContainer} onPress={this.props.cancelSignUp}>
						<Icon
							name='close'
							size={24}
							style={styles.closeButton}
						/>
					</TouchableOpacity>
					<OnboardTitle>Create an Account!</OnboardTitle>
					<View style={styles.avatarContainer}>
						<Image style={styles.avatar} source={{ uri: this.props.user ? this.props.user.picture : null }} />
					</View>
					<OnboardParagraph>What should we call you?</OnboardParagraph>

					<View style={styles.inputContainer}>
						<AppTextInput
							autoCapitalize='none'
							autoCorrect={false}
							maxLength={32}
							placeholder='Username, e.g. barry43'
							textAlign='center'
							underlineColorAndroid={nick_color}
							onChangeText={this.props.onChangeNick}
							value={this.props.nick}
						/>
						<AppTextInput
							autoCapitalize='words'
							placeholder='Fullname, e.g. Barry Allen'
							textAlign='center'
							underlineColorAndroid={name_color}
							onChangeText={this.props.onChangeName}
							value={this.props.name}
						/>
					</View>

					<OnboardError
						hint='People on Hey, Neighbor! will know you by your username.'
						message={this.props.error ? this.props.error.message : null}
					/>
					<KeyboardSpacer />
				</ScrollView>
				<NextButton
					label='Sign up'
					loading={this.props.isLoading}
					disabled={this.props.isDisabled}
					onPress={this.props.onComplete}
				/>
				{Platform.Version >= VersionCodes.KITKAT ?
					<KeyboardSpacer /> :
					null // Android seems to Pan the screen on < Kitkat
				}
			</View>
		);
	}
}
