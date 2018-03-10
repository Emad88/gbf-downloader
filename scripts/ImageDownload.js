var fs = require('fs');
var request = require('request');

/**
 * Image Download
 * ======================
 * Download and saves a single fileCreatedDate
 * @param {object} options
 */
var ImageDownload = (options) =>
{
	options.encoding = 'binary';

	return new Promise((resolve, reject) =>
	{
		request(options, (err, res, body) =>
		{
			// Error callback
			var onError = (err, url) =>
			{
				return reject(err);
			};

			// Error checks
			if(!options.url)
				return onError('The option url is required');

			if(!options.dest)
				return onError('The option dest is required');

			if(err)
				return onError(err);

			if(!body)
				return onError(`Image loading error - empty body. URL: ${options.url}`);

			if(res.statusCode !== 200)
				return onError(`Image loading error - ${res.statusCode}. URL: ${options.url}`);

			// Write file to disc
			fs.writeFile(options.dest, body, 'binary', (err) =>
			{
				if (err)
					return onError(err);

				return resolve(options.dest);
			});
		});
    });
}

module.exports = ImageDownload;