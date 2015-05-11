/** @jsx React.DOM */

var React = require('react'),
	getClasses = require('classnames'),
	Tappable = require('react-tappable'),
    Api = require('../api'),
	{ Navigation, Link, UI } = require('touchstonejs');

var timer = 60;
var timerid  = 0;

module.exports = React.createClass({
	mixins: [Navigation, Api],

	getInitialState: function() {
		return {
            smsText: '获取验证码',
            processing: false,
            processingText: '立即支付',
            disabled: false
		}
	},
    isdisabled: function(){
        return !this.state.smscode ||
            this.state.smscodeError ||
            this.state.processing;
    },
    sendSmscode: function(){
        var that = this;

        that.setState({
            disabled: true,
            smsText: timer + '秒后重新发送'
        });

        /*this.smscode({
            order_no: this.props.order_no,
            card_no: this.props.account 
        },function(resp){
            if(resp.respcd !== '0000'){
                alert(resp.resperr);
            }
        });*/

        timer = 60;
        clearInterval(timerid);
        timerid = setInterval(function(){
            that.setState({
                timer: timer,
                smsText: timer ? timer + '秒后重新发送' : '获取验证码',
                disabled : timer>0
            });  
            if(!timer){
                clearInterval(timerid);
            }else{
                timer--;
            }
        }, 1000, 60);
    },

    onSmscodeChange: function(evt){
        var value = evt.target.value;
        var pattern = /^\d{4,6}$/;

        this.setState({
            smscode: value,
            smscodeError: value && !pattern.test(value) && '验证码格式错误'
        });
    },

    pay: function() {
        var that = this;

        if(that.isdisabled()){
            return;
        }

        that.setState({
            processing: true,
            processingText: '支付处理中...'
        });

        that.showView('result', 'show-from-right', {
            success: '支付成功'
        });

        /*that.trade({
            vcode: that.state.smscode,
            card_no: that.props.account,
            token: that.props.token,
            order_no: that.props.order_id,
            caller: 'h5'
        }, function(resp){
            clearTimeout(timerid);
            if(resp.respcd !== '0000'){
                alert(resp.resperr);
            }else{
                that.showView('result', 'show-from-right', {
                    success: '支付成功'
                });
            }

            that.setState({
                processing: false,
                processingText: '立即支付'
            });
        });*/
    },

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="银联支付">
					<UI.HeaderbarButton showView="prepay" viewTransition="reveal-from-right" label="返回" icon="ion-chevron-left" />
                    <UI.LoadingButton loading={this.state.processing} className="Headerbar-button right is-primary" disabled={this.isdisabled()} onTap={this.prepay} label={this.state.processingText}/>
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
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                卡号:
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.props.account}</div>
                                </div>
                            </div>
                        </div>
                        <UI.LabelInput label="验证码" placeholder="请输入验证码"  type="tel" onChange={this.onSmscodeChange} className={getClasses({'error': !!!this.state.smscode, 'invalid': this.state.smscodeError})}/>
					</div>
                    <Tappable onTap={this.sendSmscode} disabled={this.state.disabled} className="panel-button primary" component="button">
                        {this.state.smsText}
                    </Tappable>
                    <Tappable onTap={this.pay} disabled={this.isdisabled()} className="panel-button primary" component="button">
                    {this.state.processingText}
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

