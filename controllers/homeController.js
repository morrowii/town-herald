
require('../models/index')();
let News = require('../models/news');
const request = require('request');
const cheerio = require('cheerio');

module.exports = function(app) {

    app.get('/', function(req, res) {
        
        News.find(function(err, data) {
            console.log('Successfully returned all articles.');
            res.render('home', { articles: data });
        });
    });

    app.get('/new-articles', async function (req, res) {

        await request('https://www.pcgamer.com/news/', function (error, response, body) {
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

        res.json({ redirectURL: '/' });
    });

    app.delete('/clear-articles', function(req, res) {
        News.remove({}, function() {
            console.log('Cleared articles.');
            res.json({ redirectURL: '/' });
        });
    });

    app.put('/create-comment', function(req, res) {
        News.findOneAndUpdate(
            { _id: req.body.id }, 
            { $push: { messages: req.body.comment } },
            function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            }
        );
        res.json({ redirectURL: '/' });
    });

    app.delete('/delete-comment', function(req, res) {
        News.findOneAndUpdate(
            { _id: req.body.id }, 
            { $pull: { messages: req.body.comment } },
            function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            }
        );
        res.json({ redirectURL: '/' });
    });

}
