# Joy of JavaScript
Thank you for becoming an early adopter of Joy of JavaScript, and welcome! To get the most out of this book, you’ll want to have a professional grasp of JavaScript either  on the server or the client side, as well as an interest in learning new ways to write JavaScript.

We’re at the perfect point of inflexion for a book like Joy of JavaScript. The language is moving at a frantic pace, and this book allows you to jump ahead and begin to grasp the stream of new proposals and modern programming idioms that will equip you to tackle today’s challenges in the most clean and elegant way. So you can truly enjoy using it!
I began coding JavaScript many years ago, but really became passionate about it when I surfed the functional and reactive programming wave that began about four years ago. This opened up my eyes to a completely different perspective of the language that led me to devote most of my writing aimed at using JavaScript in a functional way, with Manning titles like Functional Programming in JavaScript and RxJS in Action.

As exciting as writing those books was, I always felt I was overlooking a whole dimension of the language: objects. Objects are the fabric of the language. This book exposes JavaScript as a multi-paradigmic language from three key angles: objects, functions, and asynchronous programming. This journey starts out with foundational concepts that teach different alternatives for modeling your objects. The second part connects these pieces together in a compositional, functional manner. With the models in place, part three deals with how to properly architect and organize code around JavaScript’s new module system. Finally, you’ll learn how to scale your code and tackle events and other asynchronous behavior.

Unlike most JavaScript books and tutorials, this book relies almost entirely on plain, vanilla JavaScript with little to no dependency on third-party libraries or frameworks. Throughout each part, you’ll learn about the new proposals and features that are currently being standardized and the paradigms that embrace these features.

Obviously I can’t cover everything because that would easily take three books, but I try to focus on what’s important for today’s needs. With that said, Joy of JavaScript is not a guide or cookbook for writing ECMAScript 2016, 2017, etc. You can find that easily online. Rather, it aims at showcasing new programming idioms and techniques in the context of tackling a real-world problem—underpinning what we know today as modern JavaScript application development. 

I hope you enjoy JoJ and that it occupies an important place on your digital (and physical!) bookshelf. If you have any questions, comments, or suggestions, please share them in Manning’s Author Online forum for my book: (Manning will fill in the URL.)


# Runing the code
You have a couple of options to run the code. If you have Node.js v10 installed locally in your system, feel free to run the tests locally; otherwise, you can run the code housed in a Docker container.

### Running locally

The repo contains two projects: chapter-listings and blockchain. You must first initialize each project by running: `npm install`

### Running a chapter listing
~~~
// src/chapter-listings
npm test src/ch02/2-1.js
~~~

### Running all chapter listings
~~~
// src/chapter-listings
npm run test-all
~~~

## Running insinde a container

If you don't have Node.js v10 and don't care for upgrading just yet, you can run the tests inside a container. Install the Docker plugin corresponding to your platform (MacOS, Windows, etc). Then run: 

```
docker-compose up
```

