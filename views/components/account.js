import React from "react-native";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";
import Avatar from "./avatar";
import GrowingTextInput from "./growing-text-input";

const {
    StyleSheet,
    View,
    Text,
    SwitchAndroid
} = React;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: "#999"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 24
    },
    info: {
        flex: 1,
        marginLeft: 16
    },
    nick: {
        fontWeight: "bold",
        lineHeight: 21
    },
    email: {
        fontSize: 12,
        lineHeight: 18
    },
    settings: {
        alignItems: "stretch"
    },
    inputContainer: {
        borderColor: "rgba(0, 0, 0, .04)",
        borderBottomWidth: 1,
        paddingVertical: 8
    },
    inputLabelText: {
        fontSize: 12,
        marginHorizontal: 16
    },
    input: {
        marginHorizontal: 12
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "rgba(0, 0, 0, .04)",
        borderBottomWidth: 1,
        padding: 16
    },
    itemLabel: {
        flex: 1
    },
    itemText: {
        fontSize: 16,
        lineHeight: 24
    }
});

export default class Account extends React.Component {
    _onPushNotificationChange(value) {
        const user = Object.assign({}, this.props.user);

        const params = user.params ? Object.assign({}, user.params) : {};
        const notifications = params.notifications ? Object.assign({}, params.notifications) : {};

        notifications.push = value;

        params.notifications = notifications;
        user.params = params;

        this.props.saveUser(user);
    }

    _onEmailNotificationChange(value) {
        const user = Object.assign({}, this.props.user);

        const params = user.params ? Object.assign({}, user.params) : {};
        const email = params.email ? Object.assign({}, params.email) : {};

        email.notifications = value;

        params.email = email;
        user.params = params;

        this.props.saveUser(user);
    }

    _onStatusChange(e) {
        const user = Object.assign({}, this.props.user);

        user.description = e.nativeEvent.text;

        this.props.saveUser(user);
    }

    render() {
        const { user } = this.props;

        return (
            <View {...this.props} style={[ styles.container, this.props.style ]}>
                {(() => {
                    if (this.props.user === "LOADING") {
                        return <PageLoading />;
                    }

                    if (this.props.user === "FAILED") {
                        return <PageRetry />;
                    }

                    return (
                        <View style={styles.settings}>
                            <View style={styles.item}>
                                <View style={styles.avatar}>
                                    <Avatar
                                        size={48}
                                        nick={user.id}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.nick}>{user.id}</Text>
                                    <Text style={styles.email}>{user.identities[0].slice(7)}</Text>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabelText}>Status message</Text>
                                <GrowingTextInput
                                    style={styles.input}
                                    defaultValue={user.description}
                                    placeholder="Status message"
                                    autoCapitalize="sentences"
                                    numberOfLines={3}
                                    onChange={this._onStatusChange.bind(this)}
                                />
                            </View>
                            <View style={styles.item}>
                                <View style={styles.itemLabel}>
                                    <Text style={styles.itemText}>Push notifications</Text>
                                </View>
                                <SwitchAndroid
                                    value={user.params && user.params.notifications ? user.params.notifications.push !== false : false}
                                    onValueChange={this._onPushNotificationChange.bind(this)}
                                />
                            </View>
                            <View style={styles.item}>
                                <View style={styles.itemLabel}>
                                    <Text style={styles.itemText}>Email notifications</Text>
                                </View>
                                <SwitchAndroid
                                    value={user.params && user.params.email ? user.params.email.notifications !== false : false}
                                    onValueChange={this._onEmailNotificationChange.bind(this)}
                                />
                            </View>
                        </View>
                    );
                })()}
            </View>
        );
    }
}

Account.propTypes = {
    user: React.PropTypes.oneOfType([
        React.PropTypes.oneOf([ "LOADING", "FAILED" ]),
        React.PropTypes.shape({
            id: React.PropTypes.string
        })
    ]).isRequired,
    saveUser: React.PropTypes.func.isRequired
};
