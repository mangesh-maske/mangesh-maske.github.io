
self.addEventListener('install', function(event){
    console.log('SW installed');
    event.waitUntil(
        caches.open('static')
        .then(function(cache){
            cache.addAll([
                '/',
                'index.html',
                'assets/css/app.css',
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
                'assets/images/slide-1.jpg',
                'assets/images/slide-2.jpg',
                'assets/images/slide-3.jpg',
                'assets/images/slide-4.jpg',
                'assets/images/slide-5.jpg',
                'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js',
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
                'assets/js/app.js'
            ]);
    })
);
    
});

self.addEventListener('activate', function(){
    console.log('SW activated');
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(res){
            if(res){
                return res;
            }
            else{
                return fetch(event.request);
            }
        })
    );
});