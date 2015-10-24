import React from "react-native";
import LocalitiesFiltered from "../components/localities-filtered";
import Geolocation from "../../modules/geolocation";
import debounce from "../../lib/debounce";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class LocalitiesFilterController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				results: []
			}
		};

		this._fetchMatchingRooms = debounce(this._fetchMatchingRoomsImmediate.bind(this));

		this._cachedResults = {};
	}

	_fetchMatchingRoomsImmediate(filter) {
		Geolocation.getCurrentPosition(position => {
			const opts = { ref: filter + "*" };

			if (position && position.coords) {
				const { latitude: lat, longitude: lon } = position.coords;

				opts.location = {
					lat,
					lon
				};
			}

			this.query("getRooms", opts).then(res => {
				const data = res.results || [];

				this._cachedResults[filter] = data;

				if (filter !== this.state.filter) {
					return;
				}

				this._onDataArrived(data);
			});
		});
	}

	_onDataArrived(results) {
		this.setState({
			data: { results }
		});
	}

	_onSearchChange(text) {
		const filter = text.toLowerCase();

		if (filter) {
			InteractionManager.runAfterInteractions(() => {
				if (this._mounted) {
					if (this._cachedResults[filter]) {
						this.setState({
							filter,
							data: {
								results: this._cachedResults[filter]
							}
						});
					} else {
						this.setState({
							filter,
							data: {
								results: [ "missing" ]
							}
						});
					}
				}
			});

			if (!this._cachedResults[filter]) {
				this._fetchMatchingRooms(filter);
			}
		} else {
			this.setState({
				filter,
				data: {
					results: []
				}
			});
		}
	}

	render() {
		return (
			<LocalitiesFiltered
				{...this.props}
				{...this.state}
				onSearchChange={this._onSearchChange.bind(this)}
			/>
		);
	}
}
