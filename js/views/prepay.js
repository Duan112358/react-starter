/** @jsx React.DOM */

var React = require('react'),
	getClasses = require('classnames'),
	Tappable = require('react-tappable'),
    Api = require('../api'),
	{ Navigation, Link, UI } = require('touchstonejs');

var timer = 0;

module.exports = React.createClass({
	mixins: [Navigation, Api],

	getInitialState: function() {
        this.getquery();
        console.log(this.params);
        return {
            processing: false,
            processingText: '下一步'
        };
	},

    isdisabled: function(){
        return !this.state.account ||
            this.state.accountError ||
            this.state.processing;
    },

    prepay: function() {
        var that = this;

        if(that.isdisabled()){
            return;
        }

        that.setState({
            processing: true,
            processingText: '处理中...'
        });

        that.checkcard({
            card_no: this.state.account,
            token: this.params.token,
            caller: 'h5'
        },
        function(resp){
            if(resp.respcd !== '0000'){
                alert(resp.resperr);
            }else{
                var data = resp.data;
                that.params.account = that.state.account;
                if(data.bind){
                    // 已经实名认证
                    that.showView('pay', 'show-from-right', that.params);
                }else{
                    // 未实名认证
                    that.showView('verify', 'show-from-right', that.params);
                }
            }

            that.setState({
                processing: false,
                processingText: '下一步'
            });
            
        });
    },
    
    onAccountChange: function(evt){
        var value = evt.target.value;
        var pattern = /^\d{16,19}$/;

        this.setState({
            account: value,
            accountError: value && !pattern.test(value) && '卡号格式不正确' 
        }); 
    },

	render: function() {

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar type="default" label="银联支付">
					<UI.HeaderbarButton showView="result" viewTransition="reveal-from-right" label="返回" icon="ion-chevron-left" />
                    <UI.LoadingButton loading={this.state.processing} className="Headerbar-button right is-primary" disabled={this.isdisabled()} onTap={this.prepay} label={this.state.processingText}/>
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
					<div className="panel-header text-caps">支付信息</div>
					<div className="panel">
                        <div className="list-item is-first" component="div">
                            <div className="item-inner default">
                                <div className="field-label">金额:</div>
                                <div className="item-note primary">
                                    <div className="item-note-label">{this.params.amount/100}元</div>
                                </div>
                            </div>
                        </div>
						<UI.LabelInput type="tel" label="卡号:" pattern={/^\d+$/}   placeholder="请输入卡号" onChange={this.onAccountChange} className={getClasses({'error': !!!this.state.account, 'invalid': this.state.accountError})}/>
					</div>
                    <Tappable onTap={this.prepay} className="panel-button primary" component="button" disabled={this.isdisabled()}>
                    {this.state.processingText}
                    </Tappable>
				</UI.FlexBlock>
			</UI.FlexLayout>
		);
	}
});

