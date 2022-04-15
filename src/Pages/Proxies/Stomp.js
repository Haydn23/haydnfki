import ProxyModule from '../../ProxyModule.js';
import process from 'process';
import { bareCDN } from '../../root.js';

export default class Stomp extends ProxyModule {
	name = 'Stomp';
	async _componentDidMount() {
		await this.possible_error('Failure loading the Stomp bootstrapper.');
		await this.load_script('/stomp/bootstrapper.js');
		await this.possible_error();

		const { StompBoot } = global;

		const config = {
			bare: bareCDN,
			directory: '/stomp/',
		};

		if (process.env.NODE_ENV === 'development') {
			config.loglevel = StompBoot.LOG_TRACE;
			config.codec = StompBoot.CODEC_PLAIN;
		} else {
			config.loglevel = StompBoot.LOG_ERROR;
			config.codec = StompBoot.CODEC_XOR;
		}

		this.boot = new StompBoot(config);

		this.possible_error('Failure registering the Stomp Service Worker.');
		await this.boot.ready;
		this.possible_error();

		await this.possible_error('Bare server is unreachable.');
		await fetch(bareCDN);
		await this.possible_error();

		this.redirect(this.boot.html(this.destination));
	}
}
