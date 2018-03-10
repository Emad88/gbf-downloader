var fs              = require('fs');
var ImageDownloader = require('./ImageDownloader.js');

/**
 * Leader
 * ======================
 * @param {string} configFile
 */
class Leader
{
	constructor(configFile = 'data/leader.json')
	{
		console.log(`Reading ${configFile}...`);
		this._config = fs.readFileSync(configFile, "utf8");
		this._config = JSON.parse(this._config);
	}

	/**
	 * Download character images
	 * @param {Object} options
	 */
	downloadImages(options = {})
	{
		var images = this._getImageData(options.imageType);
		var downloader = new ImageDownloader(options.maxRequests);
		downloader.queue(images);
		downloader.start();
	}

	/**
	 * Return an array of urls of the images of the character
	 * @param {string} fileType ("job_change", "my")
	 * @return {array}
	 */
	_getImageData(types = "my,job")
	{
		var data = [];

		// All alias
		if(types == "all")
			types = "my,job";

		// Normalize the types
		types = types.split(",");
		for(let i = 0; i < types.length; i++)
			types[i] = types[i].toLowerCase().trim();

		// Build the image list
		for(var t = 0; t < types.length; t++)
		{
			let type = types[t];

			// Filetype aliases
			if(type == "job")  type = "job_change";
			if(type == "zoom") type = "job_change";

			// Generate the image urls
			for(let categoryCode in this._config)
			{
				let category = this._config[categoryCode];

				for(var jobCode in category.classes)
				{
					let job = category.classes[jobCode];
					let jobCodeNumber = jobCode.substr(0, 3);
					let jobCodeString = jobCode.substr(4, 2);

					for(let sex = 0; sex <= 1; sex++)
					{
						var sexName = sex == 0 ? "M" : "F";

						var img = {};
						img.url      = `http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/leader/${type}/${jobCodeNumber}${category.code}01_${jobCodeString}_${sex}_01.png`;
						img.path     = `download\\leader\\${type}`;
						img.filename = `${job} ${sexName}.png`;
						img.dest     = `${img.path}\\${img.filename}`;

						data.push(img);
					}
				}
			}
		}
		return data;
	}
}

module.exports = Leader;
