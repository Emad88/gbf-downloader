var fs              = require('fs');
var TableCrawler    = require('./TableCrawler.js');
var Character       = require('./Character.js');
var ImageDownloader = require('./ImageDownloader.js');

/**
 * CharacterDB
 * ======================
 * @param {string=} configFile
 */
class CharacterDB
{
	constructor(configFile = 'data/characters.json')
	{
		this._characters = [];

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
		// Fetch data
		this._crawlData()

		// Filters
		.then(() =>
		{
			return new Promise((resolve, reject) =>
			{
				if(options.filters)
				{
					for(var key in options.filters)
					{
						if(!!options.filters[key])
						{
							this._filter(key, options.filters[key]);
						}
					}
				}
				resolve();
			});
		})

		// Download files
		.then(() =>
		{
			var images = this._getImageData(options.imageType);
			var downloader = new ImageDownloader(options.maxRequests);
			downloader.queue(images);
			downloader.start();
		});
	}

	/**
	 * Export character data in a JSON
	 * @param {Object} options
	 */
	exportData(options = {})
	{
		// Fetch data
		this._crawlData()

		// Filters
		.then(() =>
		{
			return new Promise((resolve, reject) =>
			{
				if(options && options.filters)
				{
					for(var key in options.filters)
					{
						if(!!options.filters[key])
						{
							this._filter(key, options.filters[key]);
						}
					}
				}
				resolve();
			});
		})

		// Sort data
		.then(() =>
		{
			if(options && options.sort)
			{
				return new Promise((resolve, reject) =>
				{
					this._sort(options.sort);
					resolve();
				});
			}
		})

		// Export JSON
		.then(() =>
		{
			return this._exportJSON();
		});
	}

	/**
	 * Add a character
	 * @param {Character} c
	 * @return {Character}
	 * @private
	 */
	_addCharacter(c)
	{
		this._characters.push(c);
		return c;
	}

	/**
	 * Get a character by name
	 * @param {string} name
	 * @return {Character}
	 * @private
	 */
	_getCharacterByName(name)
	{
		for(var character of this._characters)
		{
			if(character.name == name)
				return character;
		}
		return false;
	}

	/**
	 * Sort characters by field
	 * @param {string=} field
	 * @private
	 */
	_sort(field = "id")
	{
		if(!this._characters.length) return;

		console.log(`Sorting characters by ${field}...`);

		var type = this._characters[0].getParamType(field);

		this._characters.sort((a, b) =>
		{
			switch(type)
			{
				case "number":
					return a[field] - b[field];

				case "string":
					return a[field].localeCompare(b[field]);
			}
		});
	}

	_filter(field, values = "")
	{
		// Normalize the values
		values = values.split(",");
		for(let i = 0; i < values.length; i++)
			values[i] = values[i].toLowerCase().trim();

		// Skip
		if(values.length == 1 && values[0] == "") return;

		console.log(`Filtering characters by ${field} with values`, values);

		// Filter characters
		for(let i = this._characters.length-1; i >= 0; i--)
		{
			let value = (this._characters[i].getParam(field) + "").toLowerCase();
			if(values.indexOf(value) == -1)
			{
				this._characters.splice(i, 1);
			}
		}
	}

	/**
	 * Crawl and parse data from the wiki
	 * @return {Promise}
	 * @private
	 */
	_crawlData()
	{
		// Fetch validation data
		var validationDataPromise = new Promise((resolve, reject) =>
		{
			var crawler = new TableCrawler();
			resolve(crawler.fetchTable(this._config.validationDataUrl));
		});

		// Fetch character data
		var characterDataPromise = new Promise((resolve, reject) =>
		{
			var crawler = new TableCrawler();
			resolve(crawler.fetchTable(this._config.characterDataUrl));
		});

		// Parse the data
		return Promise.all([validationDataPromise, characterDataPromise]).then((values) =>
		{
			return new Promise((resolve, reject) =>
			{
				resolve(this._parseCrawledData(values[0], values[1]));
			});
		})
	}


	/**
	 * Parse the crawled data
	 * @param {array} validationData
	 * @param {array} characterData
	 * @private
	 */
	_parseCrawledData(validationData, characterData)
	{
		for(var i = 0; i < validationData.length; i++)
		{
			var chara = new Character();
			this._addCharacter(chara);

			for(var key in validationData[i])
				chara.setParam(key, validationData[i][key]);
		}

		for(var i = 0; i < characterData.length; i++)
		{
			var name = characterData[i].name;
			var chara = this._getCharacterByName(name);
			if(!chara) continue;

			for(var key in characterData[i])
				chara.setParam(key, characterData[i][key]);
		}
	}

	/**
	 * Export character list as JSON
	 * @param {string=} filename
	 * @private
	 */
	_exportJSON(filename = "output.json")
	{
		console.log(`Exporting JSON...`);

		return new Promise((resolve, reject) =>
		{
			let data = JSON.stringify(this._characters, null, 2);

			fs.writeFile(filename, data, 'utf-8', err =>
			{
				console.log(err ? err : (`Saved to ${filename}`));
				!err ? resolve() : reject();
			});
		});
	}

	/**
	 * Return a list of images to download
	 * @param {string|array} types
	 * @return {array}
	 * @private
	 */
	_getImageData(types = "my,zoom")
	{
		var data = [];

		// All alias
		if(types == "all")
			types = "zoom,my,chibi,party,raid,mini,detail,quest,spritesheet";

		// Normalize the types
		types = types.split(",");
		for(let i = 0; i < types.length; i++)
			types[i] = types[i].toLowerCase().trim();

		// Build the image list
		for(var i = 0; i < this._characters.length; i++)
		{
			let chara = this._characters[i];

			for(var t = 0; t < types.length; t++)
			{
				let type = types[t];
				let imgs = chara.getImageUrls(type);

				for(var m = 0; m < imgs.length; m++)
				{
					var img = {};
					img.url      = imgs[m];
					img.path     = `download\\${type}`;
					img.filename = `${chara.name} ${m+1}.png`;
					img.dest     = `${img.path}\\${img.filename}`;

					data.push(img);
				}
			}
		}

		return data;
	}
}

module.exports = CharacterDB;