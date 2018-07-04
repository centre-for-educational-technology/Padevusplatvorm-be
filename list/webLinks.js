const cache = require('../cache/cache');
const db = require('../database/data');
const restModel = require('../rest/restModel');
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

function getList(limit, offset, success, failure){
	db.query('SELECT * FROM web_link WHERE date_removed IS NULL ORDER BY date_added DESC LIMIT ? OFFSET ?', [limit, offset], rows => {
		const cached = [];
		const notCached = [];
		const promises = [];
		rows.forEach(row => {
			let promise = new Promise((resolve, reject) => {
				let cachedItem = cache.getItem(row.id);
				if (cachedItem){
					cached.push(cachedItem);
					resolve();
				} else {
					getWebLinkData(row.link, data => {
						data = Object.assign({}, row, data);
						if (data.image && data.title){
							notCached.push(data);
						}
						resolve();
					}, () => {
						console.log('Unable to receive link data - ' + row.link);
						resolve();
					});
				}
			});
			promises.push(promise);
		});
		Promise.all(promises).then(()=>{
			success([...cached, ...notCached]);
			cache.saveCache(notCached);
		});
	}, error => {
		console.log(error);
		failure(error);
	});
}

function getAdminList(limit, offset, success, failure){
	db.query('SELECT link.*, user.email AS user FROM web_link AS link INNER JOIN user AS user ON link.fk_added_by = user.id WHERE link.date_removed IS NULL ORDER BY link.date_added DESC LIMIT ? OFFSET ?', [limit, offset], rows => {
		const cached = [];
		const notCached = [];
		const promises = [];
		rows.forEach(row => {
			let promise = new Promise((resolve, reject) => {
				let cachedItem = cache.getItem('admin-' + row.id);
				if (cachedItem){
					cached.push(cachedItem);
					resolve();
				} else {
					getWebLinkData(row.link, data => {
						data = Object.assign({}, row, data);
						if (data.image && data.title){
							notCached.push(data);
						}
						resolve();
					}, () => {
                        console.log('Unable to receive link data - ' + row.link);
                        resolve();
                    });
				}
			});
			promises.push(promise);
		});
		Promise.all(promises).then(()=>{
			success([...cached, ...notCached]);
			cache.saveAdminCache(notCached);
		});
	}, error => {
		console.log(error);
		failure(error);
	});
}

function getArticleCount(success, failure){
	db.query('SELECT COUNT(id) AS count FROM web_link WHERE date_removed IS NULL', [], rows => {
		success(rows[0].count);
	}, error => {
		console.log(error);
		failure(error);
	});
}

function addWebLink(user, link, success, failure) {
	const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
	db.query('INSERT INTO web_link (link, date_added, fk_added_by) VALUES (?, ?, ?)', [link, utc, user.id], () => {
		success();
	}, error => {
		console.log(error);
		failure(error);
	});
}

function removeWebLink(user, id, success, failure) {
	const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
	db.query('UPDATE web_link SET date_removed = ?, fk_removed_by = ? WHERE id = ?', [utc, user.id, id], () => {
		cache.clearItem(id);
		success();
	}, error => {
		console.log(error);
		failure(error);
	});
}

function getWebLinkData(link, success, failure){
	if (!link.startsWith('http')){
		link = 'http://' + link;
	}
	request(link, (error, response, html) => {
		if (error !== null){
			console.log(error);
			if (failure && typeof failure === "function") {
				failure(error);
			}
		} else {
			const dom = cheerio.load(html);
			const data = {
				title: dom('meta[property="og:title"]').attr('content'),
				link: dom('meta[property="og:url"]').attr('content'),
				image: dom('meta[property="og:image"]').attr('content'),
				description: dom('meta[property="og:description"]').attr('content'),
				site_name: dom('meta[property="og:site_name"]').attr('content')
			};
			if (!data.site_name){
				data.site_name = extractHostname(link);
			}
			if (data.link === undefined){
				data.link = link;
			}
			success(data);
		}
	});
}

const verifyLink = (req, res, link, success) => {
	db.query('SELECT COUNT(id) AS count FROM web_link WHERE link = ? AND date_removed IS NULL', [link], rows => {
		if (rows[0].count < 1){
			success();
		} else {
			restModel.generateResponse(base =>{
				base.userMessage = 'Link already posted.';
				res.statusCode = 400;
				res.send(base);
			});
		}
	}, error => {
		console.log(error);
		restModel.generateErrorResponse(base =>{
			res.statusCode = 500;
			res.send(base);
		});
	});
};

function extractHostname(url) {
	let hostname;
	//find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf("://") > -1) {
		hostname = url.split('/')[2];
	}
	else {
		hostname = url.split('/')[0];
	}

	//find & remove port number
	hostname = hostname.split(':')[0];
	//find & remove "?"
	hostname = hostname.split('?')[0];

	return hostname;
}

module.exports = {
	getList,
	getAdminList,
	addWebLink,
	removeWebLink,
	getWebLinkData,
	getArticleCount,
	verifyLink
};