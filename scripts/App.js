var CharacterDB = require('./CharacterDB.js');
var Leader = require('./Leader.js');

/**
 * Granblue Fantasy Image Downloader
 * ===========================
 */
class App
{
	constructor()
	{
		console.log("=====================");
		console.log("GBF Image Downloader");
		console.log("=====================");
	}

	/**
	 * Export character data as json
	 * @param {object} options
	 */
	exportCharacterData(options)
	{
		var db = new CharacterDB();
		db.exportData(options);
	}

	/**
	 * Download character assets
	 * @param {object} options
	 */
	downloadCharacterImages(options)
	{
		var db = new CharacterDB();
		db.downloadImages(options);
	}

	/**
	 * Download leader assets
	 * @param {object} options
	 */
	downloadLeaderImages(options)
	{
		var leader = new Leader();
		leader.downloadImages(options);
	}

	/**
	 * Help tips
	 */
	help()
	{
		var str = 
`
Download character images:

node index --download=characters

Additional parameters:

--imageType=[value,value,...] Select which images to download (Values: all, zoom, my, chibi, party, raid, mini, detail, quest, spritesheet. Default: my,zoom)
--race=[value,value,..]       Filters by one or more races. (Values: human, erune, harvin, draph, primal, unknown)
--sex=[value]                 Filters by sex. (Values: male, female)
--rarity=[value]              Filters by rarity of uncaps (Values: r, sr, ssr)
--star=[value]                Filters by number of uncaps (Values: 3, 4, 5)
--maxRequests=[value]         Change how many parallel downloads can be active (Default: 5)

---------------------------
	
Download character data as JSON:

node index --download=characters_data

Additional parameters:

--sort=[value] Sort characters by the given field (Values: id, cid, name, rarity, star, race. Default: name)

---------------------------

Download leader images:

node index --download=leader

Additional parameters:

--imageType=[value,value,...] Select which images to download (Values: all, job, my. Default: job,my)

---------------------------
`;
		console.log(str);
	}
}
module.exports = App;