# Granblue Fantasy Image Downloader #

With this Node script you can download the images of all playable characters from the game [Granblue Fantasy](game.granbluefantasy.jp).


## Setup ##

- Install **Node.js** [https://nodejs.org/en/](https://nodejs.org/en/). If asked to add it to PATH, select yes.
- Download this repository and unzip it somewhere.
- Open command line in Admin mode at the project's folder, where `index.js` is.
- Execute `npm install` in the command line.

## How to use

### Download character images ###

Execute in the command line:

	node index --download=characters

**Additional parameters:**

`--imageType=[value,value,...]` Select which images to download (*Values*: `all`, `zoom`, `my`, `chibi`, `party`, `raid`, `mini`, `detail`, `quest`, `spritesheet`. Default: `my,zoom`)

`--race=[value,value,..]` Filters by one or more races. (*Values*: `human`, `erune`, `harvin`, `draph`, `primal`, `unknown`)

`--sex=[value]` Filters by sex (*Values*: `male`, `female`)

`--rarity=[value]` Filters by rarity of uncaps (*Values*: `r`, `sr`, `ssr`)

`--star=[value]` Filters by number of uncaps (*Values*: `3`, `4`, `5`)

`--maxRequests=[value]` Change how many parallel downloads can be active (*Default*: `5`)


**Examples:** 

Download full-sized and chibi images of Female Erune and Draph SSR characters with 5 uncaps:

	node index --download=characters --imageType=zoom,chibi --race=draph,erune --sex=female --rarity=ssr --star=5

Download everything:

	node index --download=characters --imageType=all


### Download character data as JSON ###

	node index --download=characters_data

**Additional parameters:**

All previous filters are valid plus:

`--sort=[value]` Sort characters by the given field (*Values*: `id`, `cid`, `name`, `rarity`, `star`, `race`. *Default*: `name`)


### Download leader images ###

	node index --download=leader

**Additional parameters:**

`--imageType=[value,value,...]` Select which images to download (*Values*: `all`, `job`, `my`. *Default*: `job,my`)

