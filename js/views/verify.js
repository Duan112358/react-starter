/** @jsx React.DOM */

var React = require('react'),
	getClasses = require('classnames'),
	Tappable = require('react-tappable'),
    Api = require('../api'),
	{ Navigation, Link, UI } = require('touchstonejs');

var timer = 59;

module.exports = React.createClass({
	mixins: [Navigation, Api],

	getInitialState: function() {
		return {
            processing: false,
            processingText: '立即支付',
            accountType: '信用卡',
            disabled: false
		}
	},

    onExpireChange: function(evt){
        var pattern = /^[1-3][1-9]\/(0[1-9])|(1[0-2])$/;
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

        this.setState({
            mobile: value,
            mobileError: value && (value.length > 11 || (!/^1[3-8]\d{9}$/.test(value))) && '手机号格式不正确'
        });
    },

    onIDnumberChange: function(evt){
        var value = evt.target.value;
        var that = this;

        this.setState({
            idnum: evt.target.value,
            idnumError: value && (!/^\d{0,}(X|x|\d)$/.test(value) || value.length > 18) && '身份证格式不正确'
        });
    },

    isdisabled: function(){
        var state = this.state;
        var hasError = (!state.expire || state.expireError) ||
            (!state.cvv2 || state.cvv2Error) ||
            (!state.name || state.nameError) ||
            (!state.mobile || state.mobileError) ||
            (!state.idnum || state.idnumError);
        return hasError || this.state.processing;
    },

    auth_card: function() {
        var that = this;

        that.setState({
            processing: true,
            processingText: '支付处理中...'
        });

        that.auth({
            cvv2: that.state.cvv2,
            mobile: that.state.mobile,
            name: that.state.name,
            expire: that.state.expire,
            ID_number: that.state.idnum,
            card_no: that.props.account,
            order_no: that.props.order_no,
            token: that.props.token,
            caller: 'h5'
        }, function(resp){
            if(resp.respcd !== '0000'){
                alert(resp.resperr);
            }else{
                that.showView('pay', 'show-from-right', that.params);
            }

            that.setState({
                processing: false,
                processingText: '立即支付'
            });
            
        });
    },

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="银联支付">
					<UI.HeaderbarButton showView="prepay" viewTransition="reveal-from-right" label="返回" icon="ion-chevron-left" />
                    <UI.LoadingButton loading={this.state.processing} className="Headerbar-button right is-primary" disabled={this.isdisabled()} onTap={this.auth_card} label={this.state.processingText}/>
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
					<div className="panel-header text-caps">支付信息</div>
					<div className="panel">
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                金额:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.props.amount/100}元</div>
                                </div>
                            </div>
                        </div>
                        <div className="list-item" component="div">
                            <div className="item-inner default">
                                卡号:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.props.account}</div>
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
                        <UI.LabelInput label="有效期" placeholder="月份/年份 如15/08"  type="text" onChange={this.onExpireChange} className={getClasses({'error': !!!this.state.expire, 'invalid': this.state.expireError})} value={this.state.expire}/>
                        <UI.LabelInput label="CVV2" placeholder="卡背面签名栏后三位"  type="tel" onChange={this.onCvv2Change} value={this.state.cvv2} className={getClasses({'error': !!!this.state.cvv2, 'invalid': this.state.cvv2Error})}/>
                        <UI.LabelInput label="姓名" placeholder="请输入姓名"  type="text" onChange={this.onNameChange} value={this.state.name} className={getClasses({'error': !!!this.state.name, 'invalid': this.state.nameError})}/>
                        <UI.LabelInput label="身份证号" placeholder="请输入身份证号"  type="text" onChange={this.onIDnumberChange} value={this.state.idnum} className={getClasses({'error': !!!this.state.idnum, 'invalid': this.state.idnumError})}/>
                        <UI.LabelInput label="手机号" placeholder="请输入银行预留手机号"  type="tel" onChange={this.onMobileChange} value={this.state.mobile} className={getClasses({'error': !!!this.state.mobile, 'invalid': this.state.mobileError})}/>
                    </div>
                    <Tappable onTap={this.auth_card} disabled={this.isdisabled()} className="panel-button primary" component="button">
                    {this.state.processingText}
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

