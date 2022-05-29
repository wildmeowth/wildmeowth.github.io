const ghpages = require('gh-pages');

ghpages.publish('./_site', {
    dotfiles: true,
    message: 'Pub ghpages'
},
(err, data) => {
    if(err){
        console.log(err);
    }else{
        console.log('published');
    }
});