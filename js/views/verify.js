/** @jsx React.DOM */

var React = require('react'),
	getClasses = require('classnames'),
	Tappable = require('react-tappable'),
	{ Navigation, Dialogs, Link, UI } = require('touchstonejs');

var timer = 59;

module.exports = React.createClass({
	mixins: [Navigation, Dialogs],

	getInitialState: function() {
		return {
			flavour: 'strawberry',
            amount: 20,
            account: '6122323121243487123',
            accountType: '信用卡',
            smsText: '获取验证码',
            disabled: false
		}
	},

    onExpireChange: function(evt){
        var pattern = /(^0[1-9])|(^1[0-2])\/[1-3][1-9]$/;
        var value = evt.target.value;

        this.setState({
            expire: value,
            expireError: value && !pattern.test(value) && '有效期格式错误' 
        });
    },

    onCvv2Change: function(evt){
        var pattern = /^\d{3}$/;
        var value = evt.target.value;

        this.setState({
            cvv2: value,
            cvv2Error: value && !pattern.test(value) && 'CVV2码格式错误' 
        });
    },

    onNameChange: function(evt){
        this.setState({
            name: evt.target.value
        });
    },

    onMobileChange: function(evt){
        var that = this;
        var value = evt.target.value;

        if(value && (value.length > 11 || (!/^\1[3-8]\d{9}$/.test(value)))){
            that.setState({
                mobileError: '手机号格式不正确'
            });
            return;
        }
        this.setState({
            mobile: evt.target.value
        });
    },

    onIDnumberChange: function(evt){
        var value = evt.target.value;
        var that = this;

        if(value && value.length > 18){
            that.setState({
                idnumError: '身份证号码格式不正确'
            });
            return;
        }
        if(value && !/^\d{0,}(X|x|\d)$/.test(value)){
            that.setState({
                idnumError: '身份证号码格式不正确'
            });
            return;
        }

        this.setState({
            idnum: evt.target.value
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
                        <div className="list-item" component="div">
                            <div className="item-inner default">
                                卡号:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.state.account}</div>
                                </div>
                            </div>
                        </div>
                        <div className="list-item" component="div">
                            <div className="item-inner default">
                                卡类型:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.state.accountType}</div>
                                </div>
                            </div>
                        </div>
					</div>
                    
					<div className="panel-header text-caps">银行卡信息</div>
					<div className="panel">
                        <UI.LabelInput label="有效期" placeholder="月份/年份 如08/10"  type="text" onChange={this.onExpireChange} className={getClasses({'error': !!!this.state.expire, 'invalid': this.state.expireError})} value={this.state.expire}/>
                        <UI.LabelInput label="CVV2" placeholder="卡背面签名栏后三位"  type="tel" onChange={this.onCvv2Change} value={this.state.cvv2} className={getClasses({'error': !!!this.state.cvv2, 'invalid': this.state.cvv2Error})}/>
                        <UI.LabelInput label="姓名" placeholder="请输入姓名"  type="text" onChange={this.onNameChange} value={this.state.name} className={getClasses({'error': !!!this.state.name, 'invalid': this.state.nameError})}/>
                        <UI.LabelInput label="身份证号" placeholder="请输入身份证号"  type="text" onChange={this.onIDnumberChange} value={this.state.idnumber} className={getClasses({'error': !!!this.state.idnum, 'invalid': this.state.idnumError})}/>
                        <UI.LabelInput label="手机号" placeholder="请输入银行预留手机号"  type="tel" onChange={this.onMobileChange} value={this.state.mobile} className={getClasses({'error': !!!this.state.mobile, 'invalid': this.state.mobileError})}/>
                    </div>
                    <Tappable onTap={this.flashAlert} className="panel-button primary" component="button">
                        提交信息
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

