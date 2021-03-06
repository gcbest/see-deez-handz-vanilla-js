/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
// const URL = 'https://teachablemachine.withgoogle.com/models/Te0UCkuiK/'; // a, b, c
const URL = 'https://teachablemachine.withgoogle.com/models/uClbGgAxr/'; // full alphabet, blank wall
const LETTERS = [
        'Aa',
        'Bb',
        'Cc',
        'Dd',
        'Ee',
        'Ff',
        'Gg',
        'Hh',
        'Ii',
        'Jj',
        'Kk',
        'Ll',
        'Mm',
        'Nn',
        'Oo',
        'Pp',
        'Qq',
        'Rr',
        'Ss',
        'Tt',
        'Uu',
        'Vv',
        'Ww',
        'Xx',
        'Yy',
        'Zz',
];
// const WORDS = ['house', 'dog', 'car'];

let model;
let webcam;
let labelContainer;
let maxPredictions;
let randomLetter = '';
// let randomWord = '';
let index = 0;

const setRandomIndex = () => (index = Math.floor(Math.random() * LETTERS.length));
const getRandomLetter = () => {
        setRandomIndex();
        return LETTERS[index];
};
// const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const letterBtn = document.getElementById('letter-btn');
const nextLetterBtn = document.getElementById('next-letter-btn');
const randomLetterBtn = document.getElementById('random-letter-btn');
// const wordBtn = document.getElementById('word-btn');
const webcamContainer = document.getElementById('webcam-container');

function removeAllChildNodes(parent) {
        while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
        }
}

if (letterBtn && nextLetterBtn && randomLetterBtn) {
        letterBtn.addEventListener('click', function() {
                // randomLetter = getRandomLetter();
                randomLetter = LETTERS[index];
                document.getElementById('letter').textContent = randomLetter;
                removeAllChildNodes(webcamContainer);
                init();
        });

        nextLetterBtn.addEventListener('click', function() {
                if (index < LETTERS.length) {
                        randomLetter = LETTERS[++index];
                } else {
                        index = 0;
                        // eslint-disable-next-line prefer-destructuring
                        randomLetter = LETTERS[index];
                }
                document.getElementById('letter').textContent = randomLetter;
        });

        randomLetterBtn.addEventListener('click', function() {
                randomLetter = getRandomLetter();
                document.getElementById('letter').textContent = randomLetter;
        });
}

// TODO: get init() working with word btn
// wordBtn.addEventListener('click', function() {
//         randomWord = getRandomWord();
//         console.log(randomWord);
//         document.getElementById('letter').textContent = randomWord;
//         removeAllChildNodes(webcamContainer);
//         init();
// });

// run the webcam image through the image model
async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < maxPredictions; i++) {
                const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
                // labelContainer.childNodes[i].innerHTML = classPrediction;

                if (prediction[i].className === randomLetter && prediction[i].probability > 0.75) {
                        alert(`Correct: ${randomLetter}`);
                        // randomLetter = getRandomLetter();
                        if (index < LETTERS.length) {
                                randomLetter = LETTERS[++index];
                        } else {
                                index = 0;
                                // eslint-disable-next-line prefer-destructuring
                                randomLetter = LETTERS[index];
                        }
                        document.getElementById('letter').textContent = randomLetter;
                }
        }
}

async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
}

// Load the image model and setup the webcam
async function init() {
        const modelURL = `${URL}model.json`;
        const metadataURL = `${URL}metadata.json`;
        document.getElementById('letter').textContent = randomLetter;

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById('webcam-container').appendChild(webcam.canvas);
        labelContainer = document.getElementById('label-container');
        for (let i = 0; i < maxPredictions; i++) {
                // and class labels
                // labelContainer.appendChild(document.createElement('div'));
        }
}

exports.LETTERS = LETTERS;
