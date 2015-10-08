import React from "react-native";
import Modal from "./modal";
import navigationBar from "../utils/navigation-bar";
import renderScene from "../utils/render-scene";
import routes from "../utils/routes";

const {
	StyleSheet,
	Navigator,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative"
	},
	statusbar: {
		height: 25, // offset for statusbar height
		backgroundColor: "#673ab7"
	},
	scene: {
		marginTop: 56, // offset for appbar height
		backgroundColor: "#eee"
	}
});

export default class Home extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.statusbar} />
				<Navigator
					initialRoute={this.props.initialRoute || routes.home()}
					renderScene={renderScene}
					navigationBar={navigationBar}
					sceneStyle={styles.scene}
				/>
				<Modal />
			</View>
		);
	}
}

Home.propTypes = {
	initialRoute: React.PropTypes.object
};
