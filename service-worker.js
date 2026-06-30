/*=====================================================
 FunFact V4
 service-worker.js
 Version 4.0.0
======================================================*/

const CACHE_NAME = "funfact-v4-cache-v4.3";

const STATIC_CACHE = [
/*aktif ini profesional*/

 
   "./",
   "./index.html", 
    "./style.css",
    "./script.js",
    "./manifest.json", 
    "./data/funfacts.json",  

    "./images/logo.png",

];

/*=================================
 Install
==================================*/

self.addEventListener("install", event=>{

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache=>cache.addAll(STATIC_CACHE))

    );

    self.skipWaiting();

});

/*=================================
 Activate
==================================*/

self.addEventListener("activate", event=>{

    event.waitUntil(

        caches.keys().then(keys=>{

            return Promise.all(

                keys.map(key=>{

                    if(key!==CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/*=================================
 Fetch
==================================*/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    // Selalu ambil data terbaru untuk funfacts.json
    if (event.request.url.includes("funfacts.json")) {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    const clone = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });

                    return response;

                })

                .catch(() => {

                    return caches.match(event.request);

                })

        );

        return;
    }

    // Cache First untuk file lainnya
    event.respondWith(

        caches.match(event.request)

            .then(cache => {

                if (cache) {
                    return cache;
                }

                return fetch(event.request)

                    .then(response => {

                        const clone = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, clone);
                        });

                        return response;

                    })

                    .catch(() => {

                        if (event.request.destination === "image") {
                            return caches.match("./images/logo.png");
                        }

                    });

            })

    );

});

/*=================================
 Message
==================================*/

self.addEventListener("message",event=>{

    if(event.data==="skipWaiting"){

        self.skipWaiting();

    }

});

/*=================================
 Push Notification
==================================*/

self.addEventListener("push",event=>{

    if(!event.data)return;

    const data=event.data.json();

    event.waitUntil(

        self.registration.showNotification(

            data.title||"FunFact V4",

            {

                body:data.body,

                icon:"./images/logo.png",

                badge:"./images/logo.png",

                image:data.image,

                vibrate:[200,100,200],

                tag:"funfact",

                renotify:true

            }

        )

    );

});

/*=================================
 Notification Click
==================================*/

self.addEventListener("notificationclick",event=>{

    event.notification.close();

    event.waitUntil(

        clients.openWindow("./index.html")

    );

});

/*=================================
 Background Sync
==================================*/

self.addEventListener("sync",event=>{

    if(event.tag==="sync-favorites"){

        console.log("Background Sync");

    }

});

/*=================================
 Periodic Sync
==================================*/

self.addEventListener("periodicsync",event=>{

    if(event.tag==="update-funfacts"){

        console.log("Checking Update");

    }

});

/*=================================
 End
==================================*/

console.log("FunFact V4 Service Worker Loaded");
