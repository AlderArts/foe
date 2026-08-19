declare module "preloader" {
	interface PreloaderOptions {
		xhrImages?: boolean;
		[key: string]: any;
	}

	interface Preloader {
		on(event: string, callback: CallableFunction): Preloader;
		add(url: string): Preloader;
		load(): Preloader;
	}

	function preloader(options?: PreloaderOptions): Preloader;
	export default preloader;
}
