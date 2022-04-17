import ServiceFrame from './ServiceFrame.js';
import { ObfuscateLayout, Obfuscated } from './obfuscate.js';
import { ReactComponent as HatSVG } from './Assets/hat-small.svg';
import { ReactComponent as WavesSVG } from './Assets/waves.svg';
import { createRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Styles/Navigation.scss';
import './Styles/Footer.scss';
import Layout from './Layout.js';

export default class MainLayout extends Layout {
	state = {
		...this.state,
		search: false,
		expanded: false,
	};
	nav = createRef();
	search_bar = createRef();
	service_frame = createRef();
	collapsable = createRef();
	listen_click(event) {
		if (this.collapsable.current.contains(event.target)) {
			this.setState({
				expanded: false,
			});
		}
	}
	constructor(props) {
		super(props);
		this.listen_click = this.listen_click.bind(this);
	}
	componentDidMount() {
		super.componentDidMount();
		document.addEventListener('click', this.listen_click);
	}
	componentWillUnmount() {
		super.componentWillUnmount();
		document.removeEventListener('click', this.listen_click);
	}
	lightswitch() {
		if (this.state.theme === 'day') {
			this.setState({
				theme: 'night',
			});
		} else if (this.state.theme === 'night') {
			this.setState({
				theme: 'day',
			});
		}
	}
	render() {
		super.update();

		return (
			<>
				<ObfuscateLayout />
				<nav
					ref={this.nav}
					data-expanded={Number(this.state.expanded)}
					data-search={Number(this.state.search)}
				>
					<div
						className="expand"
						onClick={() => this.setState({ expanded: !this.state.expanded })}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
					<Link to="/" className="entry logo">
						<HatSVG />
					</Link>
					<div className="shift-right"></div>
					<div className="collapsable" ref={this.collapsable}>
						<Link to="/proxy.html" className="entry text">
							<span>Proxy</span>
						</Link>
						<Link to="/games.html" className="entry text">
							<span>Games</span>
						</Link>
						<Link to="/support.html" className="entry text">
							<span>Support</span>
						</Link>
					</div>
					<button className="lightswitch" onClick={this.lightswitch.bind(this)}>
						<span className="material-icons">
							{this.state.theme === 'night' ? 'brightness_7' : 'brightness_4'}
						</span>
					</button>
				</nav>
				{this.props.element || <Outlet />}
				<ServiceFrame ref={this.service_frame} />
				<footer>
					<WavesSVG />
					<div className="background">
						<div className="content">
							<Link to="/licenses.html">Licenses</Link>
							<Link to="/contact.html">Contact</Link>
							<Link to="/privacy.html">Privacy</Link>
							<Link to="/terms.html">Terms of use</Link>
							<span>
								&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
								{new Date().getUTCFullYear()}
							</span>
						</div>
					</div>
				</footer>
			</>
		);
	}
}