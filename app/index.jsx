var React = require('react'),
    Router = require('react-router');

var {Route, DefaultRoute, NotFoundRoute, Redirect, RouteHandler, Link} = Router;

var App = React.createClass({
    render: () => (
        <div>
            <h1>Main</h1>
            <Link to="/home">click me</Link>
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

if (typeof window !== 'undefined') window.routes = routes;

module.exports = (options) => {

    return (req, res, next) => {
        Router.run(routes, req.url, (Handler, state) => {
            state.routes.forEach((route) => console.log(`${route.path}: ` + (route.handler === Handler ? 'yes': 'no')))

            setTimeout(function() {
                res.render('../app/index.ejs', {
                    content: React.renderToString(<Handler />)
                });
            }, 2000);
        });
    }
}
