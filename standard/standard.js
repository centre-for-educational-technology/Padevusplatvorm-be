const db = require('../database/data');
const moment = require('moment');

function getAllStandards(success, failure) {
    db.query('SELECT * FROM standard', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getStandard(standardId, success, failure) {
    db.query('SELECT * FROM standard WHERE id = ?', [standardId], rows => {
        if (rows.length) {
            success(rows[0]);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addStandard(standard, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO standard (name, level, description, date_created) VALUES (?, ?, ?, ?)',
        [standard.name, standard.level, standard.description, utc], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

/*

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

function getWebLinkData(link, success, failure) {
    if (!link.startsWith('http')) {
        link = 'http://' + link;
    }
    request(link, (error, response, html) => {
        if (error !== null) {
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
            if (data.link === undefined) {
                data.link = link;
            }
            success(data);
        }
    });
}
*/

module.exports = {
    getAllStandards,
    getStandard,
    addStandard
};