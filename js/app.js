/** @jsx React.DOM */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');

var Touchstone = require('touchstonejs');

var config = require('./config');

var views = {

	'prepay': require('./views/prepay'),
	'pay': require('./views/pay'),
	'verify': require('./views/verify'),

	// components
	'result': require('./views/result'),
};

var App = React.createClass({
	mixins: [Touchstone.createApp(views)],

	getInitialState: function() {
		var startView = 'verify';

		// resort to #viewName if it exists
		if (window.location.hash) {
			var hash = window.location.hash.slice(1)

			if (hash in views) startView = hash
		}

		var initialState = {
			currentView: startView,
			online: true
		};

		return initialState;
	},

	getViewProps: function() {
		return {
			online: this.state.online
		};
	},
	
	gotoDefaultView: function() {
		this.showView('prepay', 'fade');
	},

	render: function() {
		return (
            <ReactCSSTransitionGroup transitionName={this.state.viewTransition.name} transitionEnter={this.state.viewTransition.in} transitionLeave={this.state.viewTransition.out} className="view-wrapper" component="div">
                {this.getCurrentView()}
            </ReactCSSTransitionGroup>
		);
	}
});

React.render(<App />, document.getElementById('app'));
