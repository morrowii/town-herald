
require('../models/index')();
let News = require('../models/news');
const request = require('request');
const cheerio = require('cheerio');

module.exports = function(app) {

    app.get('/', function (req, res) {

        request('https://www.pcgamer.com/news/', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            const $ = cheerio.load(body);

            $('article', '.listingResults').each(function() {
                $(this).find('.free-text-label').remove();
                let newsLink = $(this).parent().attr('href');
                let newsTitle = $(this).find('.article-name').text();
                let newsSynopsis = $(this).find('.synopsis').text();

                let article = {
                    title: newsTitle,
                    synopsis: newsSynopsis,
                    link: newsLink
                };

                let query = { title: newsTitle };

                News.findOneAndUpdate(query, article, { upsert: true }, function(err) {
                    if (err) throw err;
                    console.log('Article accepted.');
                });
            });
        });

        res.render('home');
    });

}
