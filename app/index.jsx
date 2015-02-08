var React = require('react'),
    Router = require('react-router'),
    flux = require('reflux');

var {Route, DefaultRoute, NotFoundRoute, Redirect, RouteHandler, Link} = Router;

var App = React.createClass({
    render: () => (
        <div>
            <h1>Main</h1>
            <Link to="/home">click me</Link>
            <a href="/auth/google/signup">signup</a>
            <a href="/auth/google/login">login</a>
            <RouteHandler/>
        </div>
    )
});

var Home = React.createClass({
    render: () =>(
        <h1>Hello World - Home</h1>
    )
});

var routes = (
    <Route handler={App} path="/">
        <Route handler={Home} path="/home" />
    </Route>
);

//
// Render server or browser side
//

if (typeof window !== 'undefined') {
    Router.run(routes, Router.HistoryLocation, (Handler) => {
        React.render(React.createElement(Handler, null), document.body);
    });
} else {

    module.exports = (options) => {

        return (req, res, next) => {
            Router.run(routes, req.url, (Handler, state) => {
                state.routes.forEach((route) => console.log(`${route.path}: ` + (route.handler === Handler ? 'yes': 'no')))

                res.render('../app/index.ejs', {
                    content: React.renderToString(<Handler />)
                });
            });
        }
    }

}
