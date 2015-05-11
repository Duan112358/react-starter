/** @jsx React.DOM */

var React = require('react'),
    Api = require('../api'),
    { Navigation, Link, UI } = require('touchstonejs');

module.exports = React.createClass({
	mixins: [Navigation, Api],

	back: function() {
        this.send_msg({
            callback: 'unionpay_trade_callback',
            module: 'unionpay',
            params: this.props.success ? {
                unionpay: {success: true, msg: '支付成功'}
            } : {
                unionpay: {success: false, msg: '支付失败'}
            }
        });	
	},

	render: function() {
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="支付结果">
				</UI.Headerbar>
				<UI.FlexBlock>
					<UI.Feedback iconKey={this.props.success ? 'ion-ios7-checkmark-outline' : 'ion-ios7-close-outline'} iconType={this.props.success ? 'success': 'danger'} header={this.props.success ? '支付成功' : '支付失败'} actionText="确定" actionFn={this.back} />
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});
