/** @jsx React.DOM */

var React = require('react'),
	SetClass = require('classnames'),
	Tappable = require('react-tappable'),
	Navigation = require('touchstonejs').Navigation,
	Link = require('touchstonejs').Link,
	UI = require('touchstonejs').UI;

module.exports = React.createClass({
	mixins: [Navigation],

	flashAlert: function(alertContent) {
		alert(alertContent);
	},

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="Feedback">
					<UI.Headerbar label="支付结果"/>
				</UI.Headerbar>
				<UI.FlexBlock>
					<UI.Feedback iconKey="ion-checkmark" iconType="success" header="支付成功" actionText="确定" actionFn={this.flashAlert.bind(this, 'You clicked the action.')} />
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});
