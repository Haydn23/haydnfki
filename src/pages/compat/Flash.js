import CompatModule, { wrapCompat } from '../../CompatModule.js';

class Flash extends CompatModule {
	name = 'Flash';
	constructor(props) {
		super(props);

		this.state.ruffle_loaded = false;
	}
	async componentDidMount() {
		await this.props.layout.current.setState({ page: 'compat-flash' });
		await this.possible_error('Error loading Ruffle player.');
		await this.load_script('/ruffle/ruffle.js');
		await this.possible_error();

		const ruffle = global.RufflePlayer.newest();
		this.player = ruffle.createPlayer();
		this.move_player(this.container.current);

		this.player.addEventListener('loadeddata', () => {
			this.setState({
				ruffle_loaded: true,
			});
		});

		this.player.addEventListener('error', event => {
			console.log(event);
			this.setState({
				error: event.error,
			});
		});

		this.player.load({ url: this.destination.toString() });
	}
	move_player(parent) {
		const inst = this.player.instance;
		this.player.instance = false;
		parent.append(this.player);
		this.player.instance = inst;
	}
	componentWillUnmount() {
		this.player.remove();
	}
	render() {
		if (!this.state.error && this.state.ruffle_loaded) {
			return (
				<main
					data-ruffle="1"
					ref={main => {
						this.container.current = main;
						if (main === undefined) {
							this.player.remove();
						} else {
							this.move_player(main);
						}
					}}
				></main>
			);
		}

		return super.render();
	}
}

export default wrapCompat(Flash);
