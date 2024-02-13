const select = require('./select');
const request = require('../request');
const { getManagedCacheStorage } = require('../cache');

const track = (info) => {
	const url =
		'https://api.tunefree.fun/ncm/song/?id=' +
		info.id +
		'&level=' +
		['hires', 'exhigh'].slice(
			select.ENABLE_FLAC ? 0 : 1,
			select.ENABLE_FLAC ? 1 : 2
		);
	return request('GET', url)
		.then((response) => response.json())
		.then((jsonBody) => {
			if (
				jsonBody &&
				typeof jsonBody === 'object' &&
				'code' in jsonBody &&
				jsonBody.code !== 200
			)
				return Promise.reject();

			const playUrl = jsonBody?.data['0']?.url;
			if (playUrl) return playUrl;

			return Promise.reject();
		});
};

const cs = getManagedCacheStorage('provider/pyncmd');
const check = (info) => cs.cache(info, () => track(info));

module.exports = { check };
