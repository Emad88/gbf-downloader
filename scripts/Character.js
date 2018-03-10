/**
 * Character
 * ======================
 */
class Character
{
	constructor()
	{
		this._data =
		{
			id          : null,
			cid         : null,
			rarity      : null,
			name        : null,
			title       : null,
			jpname      : null,
			jptitle     : null,
			element     : null,
			style       : null,
			race        : null,
			sex         : null,
			star        : null,
			hp          : null,
			atk         : null,
			em          : null,
			weapon      : null,
			join_weapon : null,
			voice       : null,
			released    : null,
			obtain      : null,
		};
	}

	/**
	 * Return an array of urls of the images of the character
	 * @param {string} fileType ("zoom", "my", "sd", "f", "spritesheet", "m", "detail", "quest", "raid_normal")
	 * @return {array}
	 */
	getImageUrls(fileType = "my")
	{
		var imgs = [];

		// Filetype aliases
		if(fileType == "mini")  fileType = "m";
		if(fileType == "party") fileType = "f";
		if(fileType == "raid")  fileType = "raid_normal";
		if(fileType == "chibi") fileType = "sd";

		// Generate the image urls
		for(let uncap = 1; uncap <= this.uncaps; uncap++)
		{
			let url;

			switch(fileType)
			{
				case "spritesheet":
					url = `http://game-a.granbluefantasy.jp/assets_en/img/sp/cjs/npc_${this.id}_0${uncap}.png`;
					break;

				case "m":
				case "f":
				case "quest":
				case "raid_normal":
					url = `http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/npc/${fileType}/${this.id}_0${uncap}.jpg`;
					break;

				case "zoom":
				case "my":
				case "sd":
				case "detail":
					url = `http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/npc/${fileType}/${this.id}_0${uncap}.png`;
					break;

				default:
					continue;
			}

			imgs.push(url);
		}

		return imgs;
	}

	/**
	 * Set a parameter
	 * @param {string} param
	 * @param {string} value
	 */
	setParam(param, value)
	{
		// Normalize parameter name
		param = param.toLowerCase().trim();
		if(value == "") return;

		// Normalize value
		value = value.replace(/\r?\n|\r/g, "").trim();
		if(value == "") return;

		// Get the normalized parameter name
		let paramName = "";

		switch(param)
		{
			case "id":
				paramName = "id";
				value = parseInt(value);
				break;

			case "cid":
				paramName = "cid";
				value = parseInt(value);
				break;

			case "name":
			case "link":
				paramName = "name";
				break;

			case "title":
				paramName = "title";
				break;

			case "jpname":
				paramName = "jpname";
				break;

			case "jptitle":
				paramName = "jptitle";
				break;

			case "t":
			case "c.r":
				paramName = "rarity";
				break;

			case "el":
			case "c.el":
				paramName = "element";
				break;

			case "style":
			case "c.ty":
				paramName = "style";
				break;

			case "race":
			case "c.ra":
				paramName = "race";
				break;

			case "sex":
			case "gender":
				paramName = "sex";
				break;

			case "★":
				paramName = "star";
				value = parseInt(value);
				break;

			case "hp":
				paramName = "hp";
				value = parseInt(value);
				break;

			case "atk":
				paramName = "atk";
				value = parseInt(value);
				break;

			case "em":
				paramName = "em";
				value = parseInt(value);
				break;

			case "weapon":
			case "wpns":
				paramName = "weapon";
				break;

			case "join_weapon":
				paramName = "join_weapon";
				break;

			case "voice":
				paramName = "voice";
				break;

			case "released":
			case "date":
				paramName = "released";
				break;

			case "obtain":
				paramName = "obtain";
				break;

			default:
				// Skip if not defined
				return;
		}

		// Set the parameter
		this._data[paramName] = value;
	}

	/**
	 * Get a parameter, if it exists
	 * @param {string} param
	 * @return {string}
	 */
	getParam(param)
	{
		if(!!this._data[param])
			return this._data[param];
		else
			return "";
	}

	/**
	 * Get the type of the given parameter name
	 * @param {string} param
	 * @return {string}
	 */
	getParamType(param)
	{
		return typeof this._data[param];
	}

	/**
	 * Getters
	 * ======================
	 */
	get id()
	{
		return this._data.id;
	}

	get name()
	{
		return this._data.name;
	}

	get star()
	{
		return this._data.star;
	}

	get uncaps()
	{
		return Math.ceil((this.star)/2);
	}
}

module.exports = Character;