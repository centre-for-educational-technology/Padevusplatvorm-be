const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 86400 });

function saveCache(items = []){
	items.forEach(item => {
		cache.set(item.id, item);
	});
}

function saveAdminCache(items = []){
	items.forEach(item => {
		cache.set('admin-' + item.id, item);
	});
}

function getItem(key){
	return cache.get(key);
}

function clearItem(key){
	cache.del([key]);
}

module.exports = {
	saveCache,
	saveAdminCache,
	getItem,
	clearItem
};