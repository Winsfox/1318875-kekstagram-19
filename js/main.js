'use strict';

var IMAGES_COUNT = 25;
var AVATARS_COUNT = 6;
var LIKE_MIN_COUNT = 15;
var LIKE_MAX_COUNT = 200;
var COMMENTS_MIN_COUNT = 2;
var COMMENTS_MAX_COUNT = 10;


var MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var AUTHORS = ['Вашингтон Ирвинг',
  'Ирвинг Вашингтон',
  'Дон Кихот',
  'Омар Хайям',
  'Катя',
  'Кот Лета',
  'Арнольд',
  'Мартин',
  'Таня'
];

// Получить случайно целое число от 0 до max - 1
var getRandomNumber = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

// Получить случайно целое число от min до max
var getRandomNumberWithMinMax = function (min, max) {
  // Проверка от дураков :)
  if (max < min) {
    return undefined;
  }

  // Ищем локальный максимум для рандомного значения
  var localMax = max - min + 1;
  var randomVal = getRandomNumber(localMax);
  // Корректируем полученное значение для попадания в необходимый диапазон
  var result = randomVal + min;
  return result;
};

// Получить случайный элемент массива из массива
var getRandomArrayValue = function (array) {
  var arrayLength = array.length;
  var randomIndex = getRandomNumber(arrayLength);
  var result = array[randomIndex];
  return result;
};

// Сгенерировать случайное сообщение из заданного количества строк
var getRandomMessage = function (stringsCount) {
  var message = '';
  for (var i = 0; i < stringsCount; i++) {
    var newString = getRandomArrayValue(MESSAGES);
    message += (message === '' ? '' : ' ') + newString;
  }
  return message;
};

// Получить заданное количество комментариев
var getComments = function (count) {
  var comments = [];

  for (var i = 0; i < count; i++) {
    var author = getRandomArrayValue(AUTHORS);
    var avatarIndex = getRandomNumber(AVATARS_COUNT) + 1;
    var commentStringsCount = getRandomNumber(2) + 1;
    var message = getRandomMessage(commentStringsCount);

    var newComment = {
      avatar: 'img/avatar-' + avatarIndex + '.svg',
      message: message,
      name: author
    };

    comments.push(newComment);
  }

  return comments;
};

// Получить необходимое количество изображений
var getImages = function (count) {
  var images = [];

  for (var i = 0; i < count; i++) {
    // Получаем количество комментариев
    var commentsCount = getRandomNumberWithMinMax(COMMENTS_MIN_COUNT, COMMENTS_MAX_COUNT);
    // Получаем массив комментариев
    var comments = getComments(commentsCount);
    var likesCount = getRandomNumberWithMinMax(LIKE_MIN_COUNT, LIKE_MAX_COUNT);
    var photoIndex = i + 1;

    var image = {
      url: 'photos/' + photoIndex + '.jpg',
      description: 'описание фотографии',
      likes: likesCount,
      comments: comments
    };

    images.push(image);
  }

  return images;
};

// Получить необходимое количество элементов изображений по заданному шаблону
var getPicturesElements = function (count, templateElement) {
  var imagesElements = [];
  var images = getImages(count);

  for (var i = 0; i < images.length; i++) {
    var imageElement = templateElement.cloneNode(true);
    imageElement.querySelector('.picture__img').src = images[i].url;
    imageElement.querySelector('.picture__likes').textContent = images[i].likes;
    imageElement.querySelector('.picture__comments').textContent = images[i].comments.length;
    imagesElements.push(imageElement);
  }

  return imagesElements;
};

// Отобразить все изображения
var showImages = function () {
  // Шаблон изображения
  var imageTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

  // Создаем буферный фрагмент
  var wizardsFragment = document.createDocumentFragment();

  var imagesElements = getPicturesElements(IMAGES_COUNT, imageTemplate);

  for (var i = 0; i < imagesElements.length; i++) {
    var imageElement = imagesElements[i];
    wizardsFragment.appendChild(imageElement);
  }

  // Элемент списка изображений
  var picturesElement = document.querySelector('.pictures');
  picturesElement.appendChild(wizardsFragment);
};

showImages();


