'use strict';

var IMAGES_COUNT = 25;
var AVATARS_COUNT = 6;
var LIKE_MIN_COUNT = 15;
var LIKE_MAX_COUNT = 200;
var COMMENTS_MIN_COUNT = 2;
var COMMENTS_MAX_COUNT = 10;
var COMMENT_IMG_WIDTH = 35;
var COMMENT_IMG_HEIGHT = 35;


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

// Шаблон для изображения
var imageTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
// Элемент контейнера для изображений
var picturesElement = document.querySelector('.pictures');
// Элемент открытого изображения
var bigPictureElement = document.querySelector('.big-picture');
// Элемент блока комментариев открытого изображения
var socialCommentsElement = document.querySelector('.social__comments');
// Элемент счетчика комментариев открытого изображения
var socialCommentCountElement = document.querySelector('.social__comment-count');
// Блок загрузки новых комментариев открытого изображения
var commentsLoaderElement = document.querySelector('.comments-loader');
// Блок с описанием открытого изображения
var captionElement = document.querySelector('.social__caption');

// Получить случайно целое число от min до max
var getRandomInteger = function randomInteger(min, max) {
  // случайное число от min до (max+1)
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// Получить случайный элемент массива
var getRandomArrayValue = function (array) {
  var arrayLength = array.length;
  var randomIndex = getRandomInteger(0, arrayLength - 1);
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

// Получить случайный комментарий
var getRandomComment = function () {
  var author = getRandomArrayValue(AUTHORS);
  var avatarIndex = getRandomInteger(1, AVATARS_COUNT);
  var commentStringsCount = getRandomInteger(1, 2);
  var message = getRandomMessage(commentStringsCount);

  var newComment = {
    avatar: 'img/avatar-' + avatarIndex + '.svg',
    message: message,
    name: author
  };

  return newComment;
};

// Получить заданное количество случайных комментариев
var getRandomComments = function (count) {
  var comments = [];
  for (var i = 0; i < count; i++) {
    var newComment = getRandomComment();
    comments.push(newComment);
  }

  return comments;
};

// Сгенерировать параметры для изображения с заданным индексом
var getRandomImage = function (index) {
  // Получаем количество комментариев
  var commentsCount = getRandomInteger(COMMENTS_MIN_COUNT, COMMENTS_MAX_COUNT);
  // Получаем массив комментариев
  var comments = getRandomComments(commentsCount);
  var likesCount = getRandomInteger(LIKE_MIN_COUNT, LIKE_MAX_COUNT);

  var image = {
    url: 'photos/' + index + '.jpg',
    description: 'описание фотографии',
    likes: likesCount,
    comments: comments
  };

  return image;
};

// Получить необходимое количество изображений
var getImages = function (count) {
  var images = [];

  for (var i = 1; i <= count; i++) {
    var image = getRandomImage(i);
    images.push(image);
  }

  return images;
};

// Получить элемент изображения по заданному шаблону
var getPictureElement = function (image, templateElement) {
  var imageElement = templateElement.cloneNode(true);
  imageElement.querySelector('.picture__img').src = image.url;
  imageElement.querySelector('.picture__likes').textContent = image.likes;
  imageElement.querySelector('.picture__comments').textContent = image.comments.length;
  return imageElement;
};

// Получить необходимое количество элементов изображений по заданному шаблону
var getPicturesElements = function (images, templateElement) {
  var imagesElements = [];

  for (var i = 0; i < images.length; i++) {
    var imageElement = getPictureElement(images[i], templateElement);
    imagesElements.push(imageElement);
  }

  return imagesElements;
};

// Отобразить все изображения
var showImages = function (images) {
  // Создаем буферный фрагмент
  var newFragment = document.createDocumentFragment();
  var imagesElements = getPicturesElements(images, imageTemplate);

  for (var i = 0; i < imagesElements.length; i++) {
    var imageElement = imagesElements[i];
    newFragment.appendChild(imageElement);
  }

  picturesElement.appendChild(newFragment);
};

// Получить элемент комментария
var getCommentElement = function (comment) {
  var liElement = document.createElement('li');
  liElement.classList.add('social__comment');

  var imgElement = document.createElement('img');
  imgElement.classList.add('social__picture');
  imgElement.src = comment.avatar;
  imgElement.alt = comment.name;
  imgElement.width = COMMENT_IMG_WIDTH;
  imgElement.height = COMMENT_IMG_HEIGHT;

  var pElement = document.createElement('p');
  pElement.classList.add('social__text');
  pElement.textContent = comment.message;

  liElement.appendChild(imgElement);
  liElement.appendChild(pElement);

  return liElement;
};

// Получить элементы комментариев
var getCommentsElement = function (comments) {
  var elements = [];

  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    var commentElement = getCommentElement(comment);
    elements.push(commentElement);
  }

  return elements;
};

var showMainPicture = function (image) {
  // Удаляем скрытость элемента открытого изображения
  bigPictureElement.classList.remove('hidden');

  bigPictureElement.querySelector('.big-picture__img').src = image.url;
  bigPictureElement.querySelector('.likes-count').textContent = image.likes.length;
  bigPictureElement.querySelector('.comments-count').textContent = image.comments.length;

  // Скрываем счетчик комментариев
  socialCommentCountElement.classList.add('hidden');
  // Скрываем блок загрузки новых комментариев
  commentsLoaderElement.classList.add('hidden');

  // Убираем прокручивание тела
  var bodyElement = document.body;
  bodyElement.classList.add('modal-open');

  // Добавляем описание к изображению
  captionElement.textContent = image.description;
};

// Добавить элементы комментариев
var addCommentsToElement = function (comments, parentElement) {
  // Создаем буферный фрагмент
  var newCommentsFragment = document.createDocumentFragment();

  var commentsElements = getCommentsElement(comments);
  // Заполняем блок с комментариями
  for (var i = 0; i < commentsElements.length; i++) {
    newCommentsFragment.appendChild(commentsElements[i]);
  }
  parentElement.appendChild(newCommentsFragment);
};

// Открыть изображение в модальном режиме
var openModalImage = function (image) {
  // Показать основное изображение
  showMainPicture(image);
  // Показать комментарии
  addCommentsToElement(image.comments, socialCommentsElement);
};

var images = getImages(IMAGES_COUNT);
showImages(images);

// Открываем первое изображение
var selectedImage = images[0];
openModalImage(selectedImage);
