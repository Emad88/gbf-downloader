var minimist = require('minimist');
var App = require('./scripts/App.js');

var args = minimist(process.argv.slice(2),
{
	string  : ['download', 'imageType', 'race', 'sex', 'rarity', 'star', 'sort', 'maxRequests']
});

var app = new App();

if(!args.download)
{
	app.help();
}
else
{
	var options =
	{
		filters :
		{
			"race"   : args.race,
			"sex"    : args.sex,
			"rarity" : args.rarity,
			"star"   : args.star
		},
		sort         : args.sort,
		imageType    : args.imageType,
		maxRequests  : args.maxRequests
	}

	switch(args.download)
	{
		case "characters":
			app.downloadCharacterImages(options);
			break;

		case "characters_data":
			app.exportCharacterData(options);
			break;

		case "leader":
			app.downloadLeaderImages(options);
			break;
	}
}



