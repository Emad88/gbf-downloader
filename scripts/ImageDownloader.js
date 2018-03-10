var fs       = require('fs');
var fx       = require('mkdir-recursive');
var download = require('./ImageDownload');

/**
 * Image Downloader
 * ======================
 * @param {int=} maxRequests
 */
class ImageDownloader
{
	constructor(maxRequests = 5)
	{
		this._queue = [];
		this._maxRequests = parseInt(maxRequests);
	}

	/**
	 * Queue a list of images to download
	 * @param {Array} items
	 */
	queue(items)
	{
		this._queue = this._queue.concat(items);
	}

	/**
	 * Start processing the queue
	 */
	start()
	{
		console.log(`Downloading ${this._queue.length} images (Max simultaneous downloads: ${this._maxRequests})...`);
		
		for(var i = 0; i < this._maxRequests; i++)
			this._startRequest();
	}

	/**
	 * Process one download request
	 * @private
	 */
	_startRequest()
	{
		if(this._queue.length == 0) return;

		// Get the item
		var item = this._queue.splice(0,1)[0];

		// Download only if the file doesn't exist
		if(!fs.existsSync(item.dest))
		{
			// Create folders
			if(!fs.existsSync(item.path))
				fx.mkdirSync(item.path);

			// Download next image in the queue
			const options =
			{
				url  : item.url,
				dest : item.dest
			}

			download(options)
				.then((filename) =>
				{
					console.log('File saved to', filename);
					this._startRequest();
				})
				.catch((err) =>
				{
					// Should remove the request here but couldn't get the filename from a reject
					console.log(err);
					this._startRequest();
				});
		}
		else
		{
			this._startRequest();
		}
	}
}
module.exports = ImageDownloader;