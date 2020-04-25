# The Joy of JavaScript (TJoJS)
Thank you for becoming an early adopter of The Joy of JavaScript (TJoJ), and welcome! To get the most out of this book, you’ll want to have a professional grasp of JavaScript either on the server or the client side, as well as an interest in learning new ways to write JavaScript.

In these strange and turbulent times of seclusion and social distancing, reading and writing  have become my escape. I hope that reading  this book can help you get through this “coronanxiety,” just as writing it is helping me, and that we can come out of this crisis stronger and more motivated.

We’re at the perfect point of inflection for a book like Joy of JavaScript. The language is moving at a frantic pace, and this book allows you to jump ahead and begin to grasp the stream of new proposals and modern programming idioms that will equip you to tackle today’s challenges in the cleanest, most elegant way; and have fun while doing it!

I began coding JavaScript many years ago, but really became passionate about it when I surfed the functional and reactive programming wave that began about four years ago. This opened up my eyes to a completely different perspective on the language, while inspiring me to write Manning titles like Functional Programming in JavaScript and RxJS in Action.

As excited as I was about writing those books, I always felt I was overlooking a whole dimension of the language: objects. Objects are the fabric of the language. This book reveals JavaScript’s true multi-paradigmic nature, and shows how all of the new features supports these paradigms. The book starts with foundational concepts that teach different alternatives for modeling your objects. The second part connects these pieces together in a compositional, functional manner. With the models in place, part three deals with how to properly architect and organize code around JavaScript’s new module system. Finally, you’ll learn how to code asynchronously using JavaScript’s data protocols, as well as how to scale to infinite amounts of data using streams. 

Unlike most JavaScript books and tutorials, this book relies entirely on plain, vanilla JavaScript with no dependencies on third-party libraries or frameworks. Throughout each chapter, you’ll learn about the new proposals and features that are currently being standardized and the paradigms that embrace these features.
The Joy of JavaScript is not a guide or cookbook for writing ECMAScript 2016, 2017, etc. You can find that easily online. Rather, it aims at showcasing new programming idioms, techniques, and sound computer science topics in the context of tackling a real-world problem—underpinning what we know today as modern JavaScript application development. 
Finally, if you have any questions, comments, or suggestions, please share them in Manning’s LiveBook platform: https://livebook.manning.com/book/the-joy-of-javascript/discussion.

—Luis Atencio

<p align="center">
    <img src="https://github.com/JoyOfJavaScript/joj/blob/master/img/cover.jpg" height="450" width="400" align="center" />
</p>

# Running the code
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

# About this book
TBD
