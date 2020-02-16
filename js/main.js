'use strict';

var ESC_KEY = 'Escape';

var IMAGES_COUNT = 25;
var AVATARS_COUNT = 6;
var LIKE_MIN_COUNT = 15;
var LIKE_MAX_COUNT = 200;
var COMMENTS_MIN_COUNT = 2;
var COMMENTS_MAX_COUNT = 10;
var COMMENT_IMG_WIDTH = 35;
var COMMENT_IMG_HEIGHT = 35;

var UPLOAD_RESIZE_STEP = 25;
var UPLOAD_SIZE_MAX = 100;
var UPLOAD_SIZE_MIN = 25;

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

// Body
var bodyElement = document.body;
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
// Элемент добавления нового файла
var uploadFileInput = document.querySelector('#upload-file');
// Элемент открытия окна загрузки нового изображения
var imgUploadOverlayElement = document.querySelector('.img-upload__overlay');
// Кнопка закрытия окна загрузки нового изображения
var uploadCancelButton = document.querySelector('#upload-cancel');
var uploadPanelKeydownHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    hideUploadPanel();
  }
};
// Кнопка увеличения изображения
var uploadImgMakeBiggerButton = document.querySelector('.scale__control--bigger');
var uploadImgMakeBiggerButtonHandler = function () {
  resizeUploadImg(UPLOAD_RESIZE_STEP);
};
// Кнопка уменьшения изображения
var uploadImgMakeSmallerButton = document.querySelector('.scale__control--smaller');
var uploadImgMakeSmallerButtonHandler = function () {
  resizeUploadImg(-1 * UPLOAD_RESIZE_STEP);
};

// Элемент ввода масштаба
var uploadScaleInput = document.querySelector('.scale__control--value');
// Элементь превью загружаемого изображения
var imgUploadPreviewElement = document.querySelector('.img-upload__preview');
var imgUploadPreviewElementDefaultClassName = imgUploadPreviewElement.className;

// Элемент списка эффектов
var effectsListElement = document.querySelector('.effects__list');
// Элемент настройки глубины
var effectLevelElement = document.querySelector('.effect-level');
// Кнопка изменения глубины эффекта
var effectLevelPinElement = document.querySelector('.effect-level__pin');
// Элемент ввода значения глубины эффекта
var effectLevelValueInput = document.querySelector('.effect-level__value');
var effectLevelChangeHandler = function () {
  var effectLevelStr = effectLevelValueInput.value;
  var effectLevelNum = parseInt(effectLevelStr, 10);
  var effect = getSelectedEffect();

  imgUploadPreviewElement.style.filter = getFilterForLevel(effect, effectLevelNum);
};

// Элемент для ввода хэштегов
var hashtagsInput = document.querySelector('.text__hashtags');
var hashtagsInputChangeHandler = function () {
  hashtagsInput.setCustomValidity('');

  var hashtagsText = hashtagsInput.value;
  var hashtagsTextTrim = hashtagsText.trim();
  var hashTags = hashtagsTextTrim.split(' ');
  var hashTagsToUpper = arrayToUpper(hashTags);

  // Нельзя указать больше пяти хэш-тегов;
  if (hashTagsToUpper.length > 5) {
    hashtagsInput.setCustomValidity('Нельзя указать больше пяти хэш-тегов.');
    return;
  }

  // Один и тот же хэш-тег не может быть использован дважды
  var duplicateHashtag = getDuplicatesInArray(hashTagsToUpper);
  if (duplicateHashtag !== null) {
    hashtagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды.');
    return;
  }

  // Проверяем каждый хэш-тег по отдельности
  for (var i = 0; i < hashTags.length; i++) {
    var checkResult = checkHashTag(hashTags[i]);
    if (checkResult !== null) {
      // Задаем результат проверки
      hashtagsInput.setCustomValidity(checkResult);
      return;
    }
  }
};

var hashtagsInputKeydownHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    // Останавливаем всплытие события
    evt.stopPropagation();
  }
};

// Элемент для ввода комментария к загружаемой фотографии
var textDescriptionInput = document.querySelector('.text__description');
var textDescriptionInputKeyDownHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    // Останавливаем всплытие события
    evt.stopPropagation();
  }
};


var arrayToUpper = function (array) {
  var resultArray = [];
  for (var i = 0; i < array.length; i++) {
    var upperValue = array[i].toUpperCase();
    resultArray.push(upperValue);
  }

  return resultArray;
};

var getDuplicatesInArray = function (array) {
  var duplicate = null;
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        duplicate = array[i];
        return duplicate;
      }
    }
  }
  return duplicate;
};

var checkHashTag = function (hashTag) {
  var result = null;

  // хэш-тег начинается с символа # (решётка);
  if (hashTag[0] !== '#') {
    result = 'Хэш-теги должны начинаться с символа "#".';
    return result;
  }

  // хеш-тег не может состоять только из одной решётки
  if (hashTag.length === 1) {
    result = 'Хэш-тег не может состоять только из одной решётки.';
    return result;
  }

  // строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т.п.),
  // символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д.;
  var hashTagText = hashTag.substring(1);
  if (!hashTagText.match('^[A-Za-z0-9]+$')) {
    result = 'Хэш-тег состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т.п.), символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д.';
    return result;
  }

  // максимальная длина одного хэш-тега 20 символов, включая решётку;
  if (hashTag.length > 20) {
    result = 'Максимальная длина одного хэш-тега 20 символов, включая решётку.';
    return result;
  }

  return result;
};

// Получить название выбранного эффекта
var getSelectedEffect = function () {
  var effect = effectsListElement.querySelector('input[name="effect"]:checked').value;
  return effect;
};

// Настройка видимости слайдера глубины эффекта
var configVisibleLevelElement = function () {
  var effect = getSelectedEffect();
  if (effect === 'none') {
    effectLevelElement.classList.add('hidden');
  } else {
    effectLevelElement.classList.remove('hidden');
  }
};

// Обработчик собтия click по документу
var documentClickHandler = function () {
  if (event.target.classList.contains('effects__radio')) {
    var effectValue = event.target.value;
    var effectCssClass = 'effects__preview--' + effectValue;
    imgUploadPreviewElement.className = imgUploadPreviewElementDefaultClassName;
    imgUploadPreviewElement.style.filter = '';
    imgUploadPreviewElement.classList.add(effectCssClass);

    // Настраиваем видимость слайдера
    configVisibleLevelElement();
  }
};

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

var getPrcValueFromString = function (prcString) {
  var prcNumber = parseInt(prcString.replace('%', ''), 10);
  return prcNumber;
};

var getPrcStringFromNumber = function (prcValue) {
  var prcString = prcValue + '%';
  return prcString;
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

var needOpenImage = false;
// Открываем первое изображение (пока не открываем)
if (needOpenImage) {
  var selectedImage = images[0];
  openModalImage(selectedImage);
}

// Изменить масштаб загружаемого изображения
var resizeUploadImg = function (change) {
  var sizeString = uploadScaleInput.value;
  var size = getPrcValueFromString(sizeString);
  var newSize = size + change;

  if (!(newSize >= UPLOAD_SIZE_MIN && newSize <= UPLOAD_SIZE_MAX)) {
    return;
  }

  var newSizeString = getPrcStringFromNumber(newSize);

  uploadScaleInput.value = newSizeString;
  imgUploadPreviewElement.style.transform = 'scale(' + newSize / 100.0 + ')';
};

// Получить значение фильтра для заданного эффекта с указанным уровнем
var getFilterForLevel = function (effect, valueLevel) {
  var filter = '';
  switch (effect) {
    case 'none':
      break;
    case 'chrome':
      var chromeLevel = valueLevel * 0.01;
      filter = 'grayscale(' + chromeLevel + ')';
      break;
    case 'sepia':
      var sepiaLevel = valueLevel * 0.01;
      filter = 'sepia(' + sepiaLevel + ')';
      break;
    case 'marvin':
      var marvinLevel = valueLevel;
      filter = 'invert(' + marvinLevel + '%)';
      break;
    case 'phobos':
      var phobosLevel = valueLevel * 0.03;
      filter = 'blur(' + phobosLevel + 'px)';
      break;
    case 'heat':
      var heatLevel = valueLevel * 0.02 + 1;
      filter = 'brightness(' + heatLevel + ')';
      break;
  }
  return filter;
};

// Показать панель загрузки
var showUploadPanel = function () {
  bodyElement.classList.add('modal-open');
  imgUploadOverlayElement.classList.remove('hidden');

  // Добавлянм обработчик keydown панели загрузки
  document.addEventListener('keydown', uploadPanelKeydownHandler);

  // Добавляем обработчики увеличения/уменьшения масштаба
  uploadImgMakeBiggerButton.addEventListener('click', uploadImgMakeBiggerButtonHandler);
  uploadImgMakeSmallerButton.addEventListener('click', uploadImgMakeSmallerButtonHandler);

  // Добавляем обработчик отслеживания изменения уровня эффекта
  effectLevelPinElement.addEventListener('mouseup', effectLevelChangeHandler);

  // Настраиваем видимость элемента глубины эффектов
  configVisibleLevelElement();

  // Добавляем обработчик на изменение хэштегов
  hashtagsInput.addEventListener('change', hashtagsInputChangeHandler);
  // Добавляем обработчик на нажатие клавиши в поле хештегов
  hashtagsInput.addEventListener('keydown', hashtagsInputKeydownHandler);

  // Добавляем обработчик на нажатие клавиши в поле комментария к загружаемой фотографии
  textDescriptionInput.addEventListener('keydown', textDescriptionInputKeyDownHandler);
};

// Скрыть панель загрузки
var hideUploadPanel = function () {
  bodyElement.classList.remove('modal-open');
  imgUploadOverlayElement.classList.add('hidden');

  // Очищаем поле загружаемого файла
  uploadFileInput.value = '';

  // Удаляем обработчик keydown панели загрузки
  document.removeEventListener('keydown', uploadPanelKeydownHandler);

  // Удаляем обработчики увеличения/уменьшения масштаба
  uploadImgMakeBiggerButton.removeEventListener('click', uploadImgMakeBiggerButtonHandler);
  uploadImgMakeSmallerButton.removeEventListener('click', uploadImgMakeSmallerButtonHandler);

  // Удаляем обработчик отслеживания уровня эффекта
  effectLevelPinElement.removeEventListener('mouseup', effectLevelChangeHandler);

  // Удаляем обработчик изменения хэштегов
  hashtagsInput.removeEventListener('change', hashtagsInputChangeHandler);
  // Удаляем обработчик на нажатие клавиши в поле хештегов
  hashtagsInput.removeEventListener('keydown', hashtagsInputKeydownHandler);

  // Удаляем обработчик на нажатие клавиши в поле комментария к загружаемой фотографии
  textDescriptionInput.removeEventListener('keydown', textDescriptionInputKeyDownHandler);
};

// Добавляем обработчик загрузки нового изобажения
uploadFileInput.addEventListener('change', function () {
  showUploadPanel();
});

// Добавляем обработчик закрытия загрузки нового изобажения
uploadCancelButton.addEventListener('click', function () {
  hideUploadPanel();
});

// Отслеживаем все click по документу
document.addEventListener('click', documentClickHandler);
