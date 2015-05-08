/** @jsx React.DOM */

var React = require('react'),
	SetClass = require('classnames'),
	Tappable = require('react-tappable'),
    Api = require('../api'),
	{ Navigation, Link, UI } = require('touchstonejs');

var timer = 0;

module.exports = React.createClass({
	mixins: [Navigation, Api],

	getInitialState: function() {
		return {
			flavour: 'strawberry',
            amount: 20
		}
	},

    flashAlert: function() {
        timer++;
        if(timer % 2){
            this.showView('pay', 'show-from-right', {});
        }else{
            this.showView('verify', 'show-from-right');
        }
    },
    
    onAccountChange: function(evt){
        this.setState({
            account: evt.target.value
        }); 
    },

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="银联支付">
					<UI.HeaderbarButton showView="result" viewTransition="reveal-from-right" label="返回" icon="ion-chevron-left" />
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
					<div className="panel-header text-caps">支付信息</div>
					<div className="panel">
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                <div className="field-label">金额:</div>
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.state.amount}元</div>
                                </div>
                            </div>
                        </div>
						<UI.LabelInput type="tel" label="卡号:" pattern={/^\d+$/}   placeholder="请输入卡号" />
					</div>
                    <Tappable onTap={this.flashAlert} className="panel-button primary" component="button">
                        下一步
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

