/** @jsx React.DOM */

var React = require('react'),
	SetClass = require('classnames'),
	Tappable = require('react-tappable'),
	{ Navigation, Dialogs, Link, UI } = require('touchstonejs');

var timer = 59;
var timerid  = 0;

module.exports = React.createClass({
	mixins: [Navigation, Dialogs],

	getInitialState: function() {
		return {
			flavour: 'strawberry',
            amount: 20,
            account: '6122323121243487123',
            smsText: '获取验证码',
            disabled: false
		}
	},
    sendSmscode: function(){
        var that = this;

        that.setState({
            disabled: true,
            smsText: timer + '秒后重新发送'
        });
        clearInterval(timerid);
        timerid = setInterval(function(){
            that.setState({
                timer: timer,
                smsText: timer ? timer + '秒后重新发送' : '获取验证码',
                disabled : timer>0
            });  
            timer--;
            if(!timer){
                clearInterval(timerid);
                timer = 59;
            }
        }, 1000, 60);
    },

	handleFlavourChange: function(newFlavour) {

		this.setState({
			flavour: newFlavour
		});

	},

    flashAlert: function() {
        timer++;
        if(timer % 2){
            this.showView('pay', 'fade');
        }else{
            this.showView('verify', 'fade');
        }
    },

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="银联支付">
					<UI.HeaderbarButton showView="prepay" viewTransition="reveal-from-right" label="返回" icon="ion-chevron-left" />
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
					<div className="panel-header text-caps">支付信息</div>
					<div className="panel">
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                金额:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.state.amount}元</div>
                                </div>
                            </div>
                        </div>
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                卡号:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.state.account}</div>
                                </div>
                            </div>
                        </div>
                        <UI.LabelInput label="验证码" placeholder="请输入验证码"  type="tel"/>
					</div>
                    <Tappable onTap={this.sendSmscode} disabled={this.state.disabled} className="panel-button primary" component="button">
                        {this.state.smsText}
                    </Tappable>
                    <Tappable onTap={this.flashAlert} className="panel-button primary" component="button">
                        下一步
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

