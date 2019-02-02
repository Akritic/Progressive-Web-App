
var CACHE_STATIC_NAME = 'static-5';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      return cache.addAll(
        [
          '/',
          '',
          '/s/css/main.css',
          'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
          'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css',
          'https://code.jquery.com/jquery-3.2.1.min.js',
          'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
          'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hmIqOxjaPXZSk.woff2',
          'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hvIqOxjaPXZSk.woff2',
          'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hnIqOxjaPXZSk.woff2',
          'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hoIqOxjaPXZSk.woff2',
        ]
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('dynamic').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


//Handling for Push notifications

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });

          if (client !== undefined) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
          notification.close();
        })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});

self.addEventListener('push', function(event) {
  console.log('Push Notification received', event);

//  var data = {title: 'New!', content: 'Something new happened!', openUrl: '/'};

//  if (event.data) {
//    data = JSON.parse(event.data.text());
//  }

  var options = {
    body: 'New post has been added!',
    icon: '/s/images/Mobile64x64.png',
    badge: '/s/images/Mobile64x64.png',
    data: {
      url: event.data.text()
    }
  };

  event.waitUntil(
    self.registration.showNotification('Akriti Blog', options)
  );
});