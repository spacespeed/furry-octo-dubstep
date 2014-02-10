MS2-Lightweight-Server
======================

Implementation of the Mineshafter Squared API as an out-of-the-box server

I made this to authenticate a private server for my friends. Maybe it'll be useful for someone else too.

### Running your own server
1. Install [Node.js](http://nodejs.org)
2. In the project root, run `npm install`
3. Run `node app.js`

### Setting up users and skins
Add users to the `minecraft/users.json` file. Here is an example; it is quite self-explanatory. The server will generate some additional data. You don't need to worry about it. If you mess something up, just delete everything for that user except the username and password, and the server will recreate.

```javascript
[
	{
		'username': 'Somebody',
		'password': 'something'
	},
	{
		'username': 'another_player',
		'password': 'minecraft',
	},
	{
		'username': 'pooploser69',
		'password': 'the_noob_adventures',
	}
]
```

To add skins or cloaks, drop them in the `minecraft/skins` and `minecraft/cloaks` folders respectively. Both should be 64 by 32 pixel `.png` files.