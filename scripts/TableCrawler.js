var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

/**
 * TableCrawler
 * ======================
 */
class TableCrawler
{
	/**
	 * Fetch the html of a page
	 * @param {string} url
	 */
	fetchTable(url)
	{
		console.log("Fetching", url);

		var options =
		{
			uri: url,
			transform: function (body){return cheerio.load(body);}
		};

		return rp(options).then($ =>
		{
			console.log("Page fetched", url);
			return this._parsePage($, url)
		});
	}

	/**
	 * Parse a html table
	 * @param {Object} $
	 * @private
	 */
	_parsePage($, url)
	{
		return new Promise((resolve, reject) =>
		{
			// Remove hidden texts
			$(".tooltiptext").remove();

			// Get headers
			var headers = {};

			$('table.wikitable tr').eq(0).each((r, row) =>
			{
				$('th', row).each((c, cell) =>
				{
					let value = $(cell).text();
					value = value.toLowerCase().replace(/\r?\n|\r/g, "").trim();

					headers[c] = value;
				});
			});

			// Get content
			var table = [];

			$('table.wikitable tr').each((r, row) =>
			{
				if(r != 0)
				{
					let item = {};
					table.push(item);

					$('td', row).each((c, cell) =>
					{
						let value = $(cell).text();
						value = value.replace(/\r?\n|\r/g, "").trim();

						item[headers[c]] = value;
					});
				}
			});

			console.log("Page parsed", url);
			resolve(table);
		});
	}
}
module.exports = TableCrawler;