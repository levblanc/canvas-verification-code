/**
 * Get a random number between [min, max) 
 * @param {number} min minimun value
 * @param {number} max maximun value
 */
const randomArbitrary = (min, max) =>
  (Math.random() * (max - min)) + min;

/**
 * Get a random integer between  [min, max]
 * @param {number} min minimun value
 * @param {number} max maximun value
 */
const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Get a random color value between [min, max]
 * @param {number} min minimun value
 * @param {number} max maximun value
*/
const randomColor = (min, max) => {
  const r = randomInt(min, max);
  const g = randomInt(min, max);
  const b = randomInt(min, max);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Test whether a number is positive integer
 * @param {number} num number to be tested
 */
const isPositiveInt = (num) => {
  const validInt = new RegExp(/^[1-9]\d*$/g);
  return validInt.test(num);
};

/**
 * Generation verification code
 * @param {number} width width of code background
 * @param {number} height height of code background
 * @param {string} type type of verification code, can be'default' (mix of number and letter), 'number', 'letter'
 * @param {number} codeLen number of characters in code, default is 4
 */
const generateCode = (
  width,
  height,
  type = 'default',
  codeLen = 4,
) => {
  if (!width || !height) {
    throw new Error('params width and/or height is needed.');
  }

  if (typeof width !== 'number') {
    throw new Error('type of param "width" should be number.');
  }

  if (typeof height !== 'number') {
    throw new Error('type of param "height" should be number.');
  }

  if (type) {
    if (typeof type === 'string') {
      const typeList = ['default', 'number', 'letter'];
      if (typeList.indexOf(type) === -1) {
        throw new Error('param type should be "default", "number", or "letter"');
      }
    } else if (typeof type === 'number') {
      if (!isPositiveInt(type)) {
        throw new Error('param codeLen shoule be positive integer.');
      }

      codeLen = type;
      type = 'default';
    } else {
      throw new Error('please check the type of your third param, or checkout the API reference for more info. https://github.com/levblanc/canvas-verification-code');
    }
  }

  // create canvas context
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');

  // define number and letters for generating the code
  // some of numbers and letters may look alike in sans-serif font
  // they are: 
  // numbers: 0, 1
  // letters: i, l, o, I, L, O, Q, S
  // feel free to delete them from the string
  const numberArr = '0123456789'.split('');
  const letterArr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  let codeText  = '';
  let targetArr = [];

  // define final characters set
  if (type === 'default') {
    targetArr = numberArr.concat(letterArr);
  } else if (type === 'number') {
    targetArr = numberArr;
  } else {
    targetArr = letterArr;
  }

  // set canvas width and height 
  canvas.width  = width;
  canvas.height = height;

  // set fill color for the canvas rectangle
  // color between RGB 180 ~ 255 is relatively light
  // so that it won't conflict with foreground chars
  ctx.fillStyle = randomColor(180, 255);
  // set background opacity
  ctx.globalAlpha = 0.7;
  // fill rectangle
  ctx.fillRect(0, 0, width, height);
  // reset alpha value for text
  ctx.globalAlpha = 1;

  // generation code chars
  for (let i = 0; i < codeLen; i++) {
    // randomly pick a character
    const textIndex = randomInt(0, targetArr.length - 1);
    const targetChar = targetArr[textIndex];

    // set style for the char
    ctx.font = 'bold 38px serif';
    // set baseline alignment 
    ctx.textBaseline = 'middle';
    // fill the char
    // color between RGB 1 ~ 100 is relatively dark
    // so that your char stands out from the background
    ctx.fillStyle = randomColor(1, 100);

    // translate positions
    const transX = (width / codeLen) * (i + 0.2);
    const transY = height / 2;
    // random scale sizes
    const scaleX = randomArbitrary(0.8, 1);
    const scaleY = randomArbitrary(0.8, 1);
    // random rotate degree
    const deg = Math.PI / 180;
    const rotate = randomArbitrary(-60, 60);

    // DO NOT put rotate before translate
    // SEQUENCE DOES MATTER !!!
    ctx.translate(transX, transY);
    ctx.scale(scaleX, scaleY);
    ctx.rotate(deg * rotate);

    // fill the char
    ctx.fillText(targetChar, 0, 0);
    // reset all transforms for next char
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // save the char into string
    codeText += targetChar;
  }

  return {
    code: codeText.toLowerCase(),
    data: canvas.toDataURL(),
  };
};

export default generateCode;
