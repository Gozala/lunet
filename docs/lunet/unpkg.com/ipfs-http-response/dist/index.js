(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IpfsHttpResponse"] = factory();
	else
		root["IpfsHttpResponse"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

/* eslint-disable no-proto */


var base64 = __webpack_require__(43);

var ieee754 = __webpack_require__(44);

var isArray = __webpack_require__(20);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */

Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
/*
 * Export kMaxLength after typed array support is determined.
 */

exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = {
      __proto__: Uint8Array.prototype,
      foo: function foo() {
        return 42;
      }
    };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }

    that.length = length;
  }

  return that;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  } // Common case.


  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }

    return allocUnsafe(this, arg);
  }

  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;

  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);

  if (size <= 0) {
    return createBuffer(that, size);
  }

  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }

  return createBuffer(that, size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }

  return that;
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }

  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }

  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }

      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }

  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }

  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;
  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;

    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }

  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0; // Use a for loop to avoid recursion

  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;

      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;

      case 'hex':
        return len >>> 1;

      case 'base64':
        return base64ToBytes(string).length;

      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

  if (start === undefined || start < 0) {
    start = 0;
  } // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.


  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
} // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;

  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }

  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }

  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;

  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }

  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;

  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }

  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;

  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }

  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }

  if (end === undefined) {
    end = target ? target.length : 0;
  }

  if (thisStart === undefined) {
    thisStart = 0;
  }

  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }

  if (thisStart >= thisEnd) {
    return -1;
  }

  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1; // Normalize byteOffset

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset; // Coerce to Number.

  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  } // Normalize byteOffset: negative offsets start from the end of the buffer


  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  } // Normalize val


  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  } // Finally, search either indexOf (if dir is true) or lastIndexOf


  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]

    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }

    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();

    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }

      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;

  if (dir) {
    var foundIndex = -1;

    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

    for (i = byteOffset; i >= 0; i--) {
      var found = true;

      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }

      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;

  if (!length) {
    length = remaining;
  } else {
    length = Number(length);

    if (length > remaining) {
      length = remaining;
    }
  } // must be an even number of digits


  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }

  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;

    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    } // legacy write(string, encoding, offset, length) - remove in v0.13

  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';
  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;

  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }

          break;

        case 2:
          secondByte = buf[i + 1];

          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }

      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  } // Decode in chunks to avoid "call stack size exceeded".


  var res = '';
  var i = 0;

  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }

  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }

  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }

  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';

  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }

  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';

  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }

  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);

    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;

  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];

  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (code < 256) {
        val = code;
      }
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
}; // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

  if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

  while (str.length % 4 !== 0) {
    str = str + '=';
  }

  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }

  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

/*<replacement>*/

var pna = __webpack_require__(7);
/*</replacement>*/

/*<replacement>*/


var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;
/*<replacement>*/

var util = __webpack_require__(6);

util.inherits = __webpack_require__(4);
/*</replacement>*/

var Readable = __webpack_require__(19);

var Writable = __webpack_require__(11);

util.inherits(Duplex, Readable);
{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  if (options && options.readable === false) this.readable = false;
  if (options && options.writable === false) this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // the no-half-open enforcer

function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();
  pna.nextTick(cb, err);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function TempCtor() {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(0);

var Buffer = buffer.Buffer; // alternative to using Object.keys for old browsers

function copyProps(src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}

if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length);
} // Copy static methods from Buffer


copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number');
  }

  return Buffer(arg, encodingOrOffset, length);
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  var buf = Buffer(size);

  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }

  return buf;
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return Buffer(size);
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return buffer.SlowBuffer(size);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }

  return objectToString(arg) === '[object Array]';
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return _typeof(arg) === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return _typeof(arg) === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return objectToString(e) === '[object Error]' || e instanceof Error;
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof(arg) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = {
    nextTick: nextTick
  };
} else {
  module.exports = process;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }

  var len = arguments.length;
  var args, i;

  switch (len) {
    case 0:
    case 1:
      return process.nextTick(fn);

    case 2:
      return process.nextTick(function afterTickOne() {
        fn.call(null, arg1);
      });

    case 3:
      return process.nextTick(function afterTickTwo() {
        fn.call(null, arg1, arg2);
      });

    case 4:
      return process.nextTick(function afterTickThree() {
        fn.call(null, arg1, arg2, arg3);
      });

    default:
      args = new Array(len - 1);
      i = 0;

      while (i < args.length) {
        args[i++] = arguments[i];
      }

      return process.nextTick(function afterTick() {
        fn.apply(null, args);
      });
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = slice;

function slice(arrayLike, start) {
  start = start | 0;
  var newLen = Math.max(arrayLike.length - start, 0);
  var newArr = Array(newLen);

  for (var idx = 0; idx < newLen; idx++) {
    newArr[idx] = arrayLike[start + idx];
  }

  return newArr;
}

module.exports = exports["default"];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var R = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }

  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = $getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }

  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }

  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }

  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(19);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(11);
exports.Duplex = __webpack_require__(3);
exports.Transform = __webpack_require__(25);
exports.PassThrough = __webpack_require__(50);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

/*<replacement>*/

var pna = __webpack_require__(7);
/*</replacement>*/


module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/

var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var util = __webpack_require__(6);

util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/

var internalUtil = {
  deprecate: __webpack_require__(49)
};
/*</replacement>*/

/*<replacement>*/

var Stream = __webpack_require__(21);
/*</replacement>*/

/*<replacement>*/


var Buffer = __webpack_require__(5).Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/


var destroyImpl = __webpack_require__(22);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(3);
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(3); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options["final"] === 'function') this._final = options["final"];
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end'); // TODO: defer error events consistently everywhere, not just the cb

  stream.emit('error', er);
  pna.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }

  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;
  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      stream.emit('error', err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(23).setImmediate, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Multihash implementation in JavaScript.
 *
 * @module multihash
 */


var bs58 = __webpack_require__(61);

var cs = __webpack_require__(62);

exports.names = cs.names;
exports.codes = cs.codes;
exports.defaultLengths = cs.defaultLengths;

var varint = __webpack_require__(13);
/**
 * Convert the given multihash to a hex encoded string.
 *
 * @param {Buffer} hash
 * @returns {string}
 */


exports.toHexString = function toHexString(hash) {
  if (!Buffer.isBuffer(hash)) {
    throw new Error('must be passed a buffer');
  }

  return hash.toString('hex');
};
/**
 * Convert the given hex encoded string to a multihash.
 *
 * @param {string} hash
 * @returns {Buffer}
 */


exports.fromHexString = function fromHexString(hash) {
  return Buffer.from(hash, 'hex');
};
/**
 * Convert the given multihash to a base58 encoded string.
 *
 * @param {Buffer} hash
 * @returns {string}
 */


exports.toB58String = function toB58String(hash) {
  if (!Buffer.isBuffer(hash)) {
    throw new Error('must be passed a buffer');
  }

  return bs58.encode(hash);
};
/**
 * Convert the given base58 encoded string to a multihash.
 *
 * @param {string|Buffer} hash
 * @returns {Buffer}
 */


exports.fromB58String = function fromB58String(hash) {
  var encoded = hash;

  if (Buffer.isBuffer(hash)) {
    encoded = hash.toString();
  }

  return Buffer.from(bs58.decode(encoded));
};
/**
 * Decode a hash from the given multihash.
 *
 * @param {Buffer} buf
 * @returns {{code: number, name: string, length: number, digest: Buffer}} result
 */


exports.decode = function decode(buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('multihash must be a Buffer');
  }

  if (buf.length < 3) {
    throw new Error('multihash too short. must be > 3 bytes.');
  }

  var code = varint.decode(buf);

  if (!exports.isValidCode(code)) {
    throw new Error("multihash unknown function code: 0x".concat(code.toString(16)));
  }

  buf = buf.slice(varint.decode.bytes);
  var len = varint.decode(buf);

  if (len < 1) {
    throw new Error("multihash invalid length: 0x".concat(len.toString(16)));
  }

  buf = buf.slice(varint.decode.bytes);

  if (buf.length !== len) {
    throw new Error("multihash length inconsistent: 0x".concat(buf.toString('hex')));
  }

  return {
    code: code,
    name: cs.codes[code],
    length: len,
    digest: buf
  };
};
/**
 *  Encode a hash digest along with the specified function code.
 *
 * > **Note:** the length is derived from the length of the digest itself.
 *
 * @param {Buffer} digest
 * @param {string|number} code
 * @param {number} [length]
 * @returns {Buffer}
 */


exports.encode = function encode(digest, code, length) {
  if (!digest || !code) {
    throw new Error('multihash encode requires at least two args: digest, code');
  } // ensure it's a hashfunction code.


  var hashfn = exports.coerceCode(code);

  if (!Buffer.isBuffer(digest)) {
    throw new Error('digest should be a Buffer');
  }

  if (length == null) {
    length = digest.length;
  }

  if (length && digest.length !== length) {
    throw new Error('digest length should be equal to specified length.');
  }

  return Buffer.concat([Buffer.from(varint.encode(hashfn)), Buffer.from(varint.encode(length)), digest]);
};
/**
 * Converts a hash function name into the matching code.
 * If passed a number it will return the number if it's a valid code.
 * @param {string|number} name
 * @returns {number}
 */


exports.coerceCode = function coerceCode(name) {
  var code = name;

  if (typeof name === 'string') {
    if (!cs.names[name]) {
      throw new Error("Unrecognized hash function named: ".concat(name));
    }

    code = cs.names[name];
  }

  if (typeof code !== 'number') {
    throw new Error("Hash function code should be a number. Got: ".concat(code));
  }

  if (!cs.codes[code] && !exports.isAppCode(code)) {
    throw new Error("Unrecognized function code: ".concat(code));
  }

  return code;
};
/**
 * Checks wether a code is part of the app range
 *
 * @param {number} code
 * @returns {boolean}
 */


exports.isAppCode = function appCode(code) {
  return code > 0 && code < 0x10;
};
/**
 * Checks whether a multihash code is valid.
 *
 * @param {number} code
 * @returns {boolean}
 */


exports.isValidCode = function validCode(code) {
  if (exports.isAppCode(code)) {
    return true;
  }

  if (cs.codes[code]) {
    return true;
  }

  return false;
};
/**
 * Check if the given buffer is a valid multihash. Throws an error if it is not valid.
 *
 * @param {Buffer} multihash
 * @returns {undefined}
 * @throws {Error}
 */


function validate(multihash) {
  exports.decode(multihash); // throws if bad.
}

exports.validate = validate;
/**
 * Returns a prefix from a valid multihash. Throws an error if it is not valid.
 *
 * @param {Buffer} multihash
 * @returns {undefined}
 * @throws {Error}
 */

exports.prefix = function prefix(multihash) {
  validate(multihash);
  return multihash.slice(0, 2);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  encode: __webpack_require__(63),
  decode: __webpack_require__(64),
  encodingLength: __webpack_require__(65)
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {// THIS FILE IS GENERATED, DO NO EDIT MANUALLY
// For more information see the README.md

/* eslint-disable dot-notation */
 // serialization

exports['protobuf'] = Buffer.from('50', 'hex');
exports['cbor'] = Buffer.from('51', 'hex');
exports['rlp'] = Buffer.from('60', 'hex');
exports['bencode'] = Buffer.from('63', 'hex'); // multiformat

exports['multicodec'] = Buffer.from('30', 'hex');
exports['multihash'] = Buffer.from('31', 'hex');
exports['multiaddr'] = Buffer.from('32', 'hex');
exports['multibase'] = Buffer.from('33', 'hex'); // multihash

exports['identity'] = Buffer.from('00', 'hex');
exports['sha1'] = Buffer.from('11', 'hex');
exports['sha2-256'] = Buffer.from('12', 'hex');
exports['sha2-512'] = Buffer.from('13', 'hex');
exports['sha3-512'] = Buffer.from('14', 'hex');
exports['sha3-384'] = Buffer.from('15', 'hex');
exports['sha3-256'] = Buffer.from('16', 'hex');
exports['sha3-224'] = Buffer.from('17', 'hex');
exports['shake-128'] = Buffer.from('18', 'hex');
exports['shake-256'] = Buffer.from('19', 'hex');
exports['keccak-224'] = Buffer.from('1a', 'hex');
exports['keccak-256'] = Buffer.from('1b', 'hex');
exports['keccak-384'] = Buffer.from('1c', 'hex');
exports['keccak-512'] = Buffer.from('1d', 'hex');
exports['murmur3-128'] = Buffer.from('22', 'hex');
exports['murmur3-32'] = Buffer.from('23', 'hex');
exports['dbl-sha2-256'] = Buffer.from('56', 'hex');
exports['md4'] = Buffer.from('d4', 'hex');
exports['md5'] = Buffer.from('d5', 'hex');
exports['bmt'] = Buffer.from('d6', 'hex');
exports['x11'] = Buffer.from('1100', 'hex');
exports['blake2b-8'] = Buffer.from('b201', 'hex');
exports['blake2b-16'] = Buffer.from('b202', 'hex');
exports['blake2b-24'] = Buffer.from('b203', 'hex');
exports['blake2b-32'] = Buffer.from('b204', 'hex');
exports['blake2b-40'] = Buffer.from('b205', 'hex');
exports['blake2b-48'] = Buffer.from('b206', 'hex');
exports['blake2b-56'] = Buffer.from('b207', 'hex');
exports['blake2b-64'] = Buffer.from('b208', 'hex');
exports['blake2b-72'] = Buffer.from('b209', 'hex');
exports['blake2b-80'] = Buffer.from('b20a', 'hex');
exports['blake2b-88'] = Buffer.from('b20b', 'hex');
exports['blake2b-96'] = Buffer.from('b20c', 'hex');
exports['blake2b-104'] = Buffer.from('b20d', 'hex');
exports['blake2b-112'] = Buffer.from('b20e', 'hex');
exports['blake2b-120'] = Buffer.from('b20f', 'hex');
exports['blake2b-128'] = Buffer.from('b210', 'hex');
exports['blake2b-136'] = Buffer.from('b211', 'hex');
exports['blake2b-144'] = Buffer.from('b212', 'hex');
exports['blake2b-152'] = Buffer.from('b213', 'hex');
exports['blake2b-160'] = Buffer.from('b214', 'hex');
exports['blake2b-168'] = Buffer.from('b215', 'hex');
exports['blake2b-176'] = Buffer.from('b216', 'hex');
exports['blake2b-184'] = Buffer.from('b217', 'hex');
exports['blake2b-192'] = Buffer.from('b218', 'hex');
exports['blake2b-200'] = Buffer.from('b219', 'hex');
exports['blake2b-208'] = Buffer.from('b21a', 'hex');
exports['blake2b-216'] = Buffer.from('b21b', 'hex');
exports['blake2b-224'] = Buffer.from('b21c', 'hex');
exports['blake2b-232'] = Buffer.from('b21d', 'hex');
exports['blake2b-240'] = Buffer.from('b21e', 'hex');
exports['blake2b-248'] = Buffer.from('b21f', 'hex');
exports['blake2b-256'] = Buffer.from('b220', 'hex');
exports['blake2b-264'] = Buffer.from('b221', 'hex');
exports['blake2b-272'] = Buffer.from('b222', 'hex');
exports['blake2b-280'] = Buffer.from('b223', 'hex');
exports['blake2b-288'] = Buffer.from('b224', 'hex');
exports['blake2b-296'] = Buffer.from('b225', 'hex');
exports['blake2b-304'] = Buffer.from('b226', 'hex');
exports['blake2b-312'] = Buffer.from('b227', 'hex');
exports['blake2b-320'] = Buffer.from('b228', 'hex');
exports['blake2b-328'] = Buffer.from('b229', 'hex');
exports['blake2b-336'] = Buffer.from('b22a', 'hex');
exports['blake2b-344'] = Buffer.from('b22b', 'hex');
exports['blake2b-352'] = Buffer.from('b22c', 'hex');
exports['blake2b-360'] = Buffer.from('b22d', 'hex');
exports['blake2b-368'] = Buffer.from('b22e', 'hex');
exports['blake2b-376'] = Buffer.from('b22f', 'hex');
exports['blake2b-384'] = Buffer.from('b230', 'hex');
exports['blake2b-392'] = Buffer.from('b231', 'hex');
exports['blake2b-400'] = Buffer.from('b232', 'hex');
exports['blake2b-408'] = Buffer.from('b233', 'hex');
exports['blake2b-416'] = Buffer.from('b234', 'hex');
exports['blake2b-424'] = Buffer.from('b235', 'hex');
exports['blake2b-432'] = Buffer.from('b236', 'hex');
exports['blake2b-440'] = Buffer.from('b237', 'hex');
exports['blake2b-448'] = Buffer.from('b238', 'hex');
exports['blake2b-456'] = Buffer.from('b239', 'hex');
exports['blake2b-464'] = Buffer.from('b23a', 'hex');
exports['blake2b-472'] = Buffer.from('b23b', 'hex');
exports['blake2b-480'] = Buffer.from('b23c', 'hex');
exports['blake2b-488'] = Buffer.from('b23d', 'hex');
exports['blake2b-496'] = Buffer.from('b23e', 'hex');
exports['blake2b-504'] = Buffer.from('b23f', 'hex');
exports['blake2b-512'] = Buffer.from('b240', 'hex');
exports['blake2s-8'] = Buffer.from('b241', 'hex');
exports['blake2s-16'] = Buffer.from('b242', 'hex');
exports['blake2s-24'] = Buffer.from('b243', 'hex');
exports['blake2s-32'] = Buffer.from('b244', 'hex');
exports['blake2s-40'] = Buffer.from('b245', 'hex');
exports['blake2s-48'] = Buffer.from('b246', 'hex');
exports['blake2s-56'] = Buffer.from('b247', 'hex');
exports['blake2s-64'] = Buffer.from('b248', 'hex');
exports['blake2s-72'] = Buffer.from('b249', 'hex');
exports['blake2s-80'] = Buffer.from('b24a', 'hex');
exports['blake2s-88'] = Buffer.from('b24b', 'hex');
exports['blake2s-96'] = Buffer.from('b24c', 'hex');
exports['blake2s-104'] = Buffer.from('b24d', 'hex');
exports['blake2s-112'] = Buffer.from('b24e', 'hex');
exports['blake2s-120'] = Buffer.from('b24f', 'hex');
exports['blake2s-128'] = Buffer.from('b250', 'hex');
exports['blake2s-136'] = Buffer.from('b251', 'hex');
exports['blake2s-144'] = Buffer.from('b252', 'hex');
exports['blake2s-152'] = Buffer.from('b253', 'hex');
exports['blake2s-160'] = Buffer.from('b254', 'hex');
exports['blake2s-168'] = Buffer.from('b255', 'hex');
exports['blake2s-176'] = Buffer.from('b256', 'hex');
exports['blake2s-184'] = Buffer.from('b257', 'hex');
exports['blake2s-192'] = Buffer.from('b258', 'hex');
exports['blake2s-200'] = Buffer.from('b259', 'hex');
exports['blake2s-208'] = Buffer.from('b25a', 'hex');
exports['blake2s-216'] = Buffer.from('b25b', 'hex');
exports['blake2s-224'] = Buffer.from('b25c', 'hex');
exports['blake2s-232'] = Buffer.from('b25d', 'hex');
exports['blake2s-240'] = Buffer.from('b25e', 'hex');
exports['blake2s-248'] = Buffer.from('b25f', 'hex');
exports['blake2s-256'] = Buffer.from('b260', 'hex');
exports['skein256-8'] = Buffer.from('b301', 'hex');
exports['skein256-16'] = Buffer.from('b302', 'hex');
exports['skein256-24'] = Buffer.from('b303', 'hex');
exports['skein256-32'] = Buffer.from('b304', 'hex');
exports['skein256-40'] = Buffer.from('b305', 'hex');
exports['skein256-48'] = Buffer.from('b306', 'hex');
exports['skein256-56'] = Buffer.from('b307', 'hex');
exports['skein256-64'] = Buffer.from('b308', 'hex');
exports['skein256-72'] = Buffer.from('b309', 'hex');
exports['skein256-80'] = Buffer.from('b30a', 'hex');
exports['skein256-88'] = Buffer.from('b30b', 'hex');
exports['skein256-96'] = Buffer.from('b30c', 'hex');
exports['skein256-104'] = Buffer.from('b30d', 'hex');
exports['skein256-112'] = Buffer.from('b30e', 'hex');
exports['skein256-120'] = Buffer.from('b30f', 'hex');
exports['skein256-128'] = Buffer.from('b310', 'hex');
exports['skein256-136'] = Buffer.from('b311', 'hex');
exports['skein256-144'] = Buffer.from('b312', 'hex');
exports['skein256-152'] = Buffer.from('b313', 'hex');
exports['skein256-160'] = Buffer.from('b314', 'hex');
exports['skein256-168'] = Buffer.from('b315', 'hex');
exports['skein256-176'] = Buffer.from('b316', 'hex');
exports['skein256-184'] = Buffer.from('b317', 'hex');
exports['skein256-192'] = Buffer.from('b318', 'hex');
exports['skein256-200'] = Buffer.from('b319', 'hex');
exports['skein256-208'] = Buffer.from('b31a', 'hex');
exports['skein256-216'] = Buffer.from('b31b', 'hex');
exports['skein256-224'] = Buffer.from('b31c', 'hex');
exports['skein256-232'] = Buffer.from('b31d', 'hex');
exports['skein256-240'] = Buffer.from('b31e', 'hex');
exports['skein256-248'] = Buffer.from('b31f', 'hex');
exports['skein256-256'] = Buffer.from('b320', 'hex');
exports['skein512-8'] = Buffer.from('b321', 'hex');
exports['skein512-16'] = Buffer.from('b322', 'hex');
exports['skein512-24'] = Buffer.from('b323', 'hex');
exports['skein512-32'] = Buffer.from('b324', 'hex');
exports['skein512-40'] = Buffer.from('b325', 'hex');
exports['skein512-48'] = Buffer.from('b326', 'hex');
exports['skein512-56'] = Buffer.from('b327', 'hex');
exports['skein512-64'] = Buffer.from('b328', 'hex');
exports['skein512-72'] = Buffer.from('b329', 'hex');
exports['skein512-80'] = Buffer.from('b32a', 'hex');
exports['skein512-88'] = Buffer.from('b32b', 'hex');
exports['skein512-96'] = Buffer.from('b32c', 'hex');
exports['skein512-104'] = Buffer.from('b32d', 'hex');
exports['skein512-112'] = Buffer.from('b32e', 'hex');
exports['skein512-120'] = Buffer.from('b32f', 'hex');
exports['skein512-128'] = Buffer.from('b330', 'hex');
exports['skein512-136'] = Buffer.from('b331', 'hex');
exports['skein512-144'] = Buffer.from('b332', 'hex');
exports['skein512-152'] = Buffer.from('b333', 'hex');
exports['skein512-160'] = Buffer.from('b334', 'hex');
exports['skein512-168'] = Buffer.from('b335', 'hex');
exports['skein512-176'] = Buffer.from('b336', 'hex');
exports['skein512-184'] = Buffer.from('b337', 'hex');
exports['skein512-192'] = Buffer.from('b338', 'hex');
exports['skein512-200'] = Buffer.from('b339', 'hex');
exports['skein512-208'] = Buffer.from('b33a', 'hex');
exports['skein512-216'] = Buffer.from('b33b', 'hex');
exports['skein512-224'] = Buffer.from('b33c', 'hex');
exports['skein512-232'] = Buffer.from('b33d', 'hex');
exports['skein512-240'] = Buffer.from('b33e', 'hex');
exports['skein512-248'] = Buffer.from('b33f', 'hex');
exports['skein512-256'] = Buffer.from('b340', 'hex');
exports['skein512-264'] = Buffer.from('b341', 'hex');
exports['skein512-272'] = Buffer.from('b342', 'hex');
exports['skein512-280'] = Buffer.from('b343', 'hex');
exports['skein512-288'] = Buffer.from('b344', 'hex');
exports['skein512-296'] = Buffer.from('b345', 'hex');
exports['skein512-304'] = Buffer.from('b346', 'hex');
exports['skein512-312'] = Buffer.from('b347', 'hex');
exports['skein512-320'] = Buffer.from('b348', 'hex');
exports['skein512-328'] = Buffer.from('b349', 'hex');
exports['skein512-336'] = Buffer.from('b34a', 'hex');
exports['skein512-344'] = Buffer.from('b34b', 'hex');
exports['skein512-352'] = Buffer.from('b34c', 'hex');
exports['skein512-360'] = Buffer.from('b34d', 'hex');
exports['skein512-368'] = Buffer.from('b34e', 'hex');
exports['skein512-376'] = Buffer.from('b34f', 'hex');
exports['skein512-384'] = Buffer.from('b350', 'hex');
exports['skein512-392'] = Buffer.from('b351', 'hex');
exports['skein512-400'] = Buffer.from('b352', 'hex');
exports['skein512-408'] = Buffer.from('b353', 'hex');
exports['skein512-416'] = Buffer.from('b354', 'hex');
exports['skein512-424'] = Buffer.from('b355', 'hex');
exports['skein512-432'] = Buffer.from('b356', 'hex');
exports['skein512-440'] = Buffer.from('b357', 'hex');
exports['skein512-448'] = Buffer.from('b358', 'hex');
exports['skein512-456'] = Buffer.from('b359', 'hex');
exports['skein512-464'] = Buffer.from('b35a', 'hex');
exports['skein512-472'] = Buffer.from('b35b', 'hex');
exports['skein512-480'] = Buffer.from('b35c', 'hex');
exports['skein512-488'] = Buffer.from('b35d', 'hex');
exports['skein512-496'] = Buffer.from('b35e', 'hex');
exports['skein512-504'] = Buffer.from('b35f', 'hex');
exports['skein512-512'] = Buffer.from('b360', 'hex');
exports['skein1024-8'] = Buffer.from('b361', 'hex');
exports['skein1024-16'] = Buffer.from('b362', 'hex');
exports['skein1024-24'] = Buffer.from('b363', 'hex');
exports['skein1024-32'] = Buffer.from('b364', 'hex');
exports['skein1024-40'] = Buffer.from('b365', 'hex');
exports['skein1024-48'] = Buffer.from('b366', 'hex');
exports['skein1024-56'] = Buffer.from('b367', 'hex');
exports['skein1024-64'] = Buffer.from('b368', 'hex');
exports['skein1024-72'] = Buffer.from('b369', 'hex');
exports['skein1024-80'] = Buffer.from('b36a', 'hex');
exports['skein1024-88'] = Buffer.from('b36b', 'hex');
exports['skein1024-96'] = Buffer.from('b36c', 'hex');
exports['skein1024-104'] = Buffer.from('b36d', 'hex');
exports['skein1024-112'] = Buffer.from('b36e', 'hex');
exports['skein1024-120'] = Buffer.from('b36f', 'hex');
exports['skein1024-128'] = Buffer.from('b370', 'hex');
exports['skein1024-136'] = Buffer.from('b371', 'hex');
exports['skein1024-144'] = Buffer.from('b372', 'hex');
exports['skein1024-152'] = Buffer.from('b373', 'hex');
exports['skein1024-160'] = Buffer.from('b374', 'hex');
exports['skein1024-168'] = Buffer.from('b375', 'hex');
exports['skein1024-176'] = Buffer.from('b376', 'hex');
exports['skein1024-184'] = Buffer.from('b377', 'hex');
exports['skein1024-192'] = Buffer.from('b378', 'hex');
exports['skein1024-200'] = Buffer.from('b379', 'hex');
exports['skein1024-208'] = Buffer.from('b37a', 'hex');
exports['skein1024-216'] = Buffer.from('b37b', 'hex');
exports['skein1024-224'] = Buffer.from('b37c', 'hex');
exports['skein1024-232'] = Buffer.from('b37d', 'hex');
exports['skein1024-240'] = Buffer.from('b37e', 'hex');
exports['skein1024-248'] = Buffer.from('b37f', 'hex');
exports['skein1024-256'] = Buffer.from('b380', 'hex');
exports['skein1024-264'] = Buffer.from('b381', 'hex');
exports['skein1024-272'] = Buffer.from('b382', 'hex');
exports['skein1024-280'] = Buffer.from('b383', 'hex');
exports['skein1024-288'] = Buffer.from('b384', 'hex');
exports['skein1024-296'] = Buffer.from('b385', 'hex');
exports['skein1024-304'] = Buffer.from('b386', 'hex');
exports['skein1024-312'] = Buffer.from('b387', 'hex');
exports['skein1024-320'] = Buffer.from('b388', 'hex');
exports['skein1024-328'] = Buffer.from('b389', 'hex');
exports['skein1024-336'] = Buffer.from('b38a', 'hex');
exports['skein1024-344'] = Buffer.from('b38b', 'hex');
exports['skein1024-352'] = Buffer.from('b38c', 'hex');
exports['skein1024-360'] = Buffer.from('b38d', 'hex');
exports['skein1024-368'] = Buffer.from('b38e', 'hex');
exports['skein1024-376'] = Buffer.from('b38f', 'hex');
exports['skein1024-384'] = Buffer.from('b390', 'hex');
exports['skein1024-392'] = Buffer.from('b391', 'hex');
exports['skein1024-400'] = Buffer.from('b392', 'hex');
exports['skein1024-408'] = Buffer.from('b393', 'hex');
exports['skein1024-416'] = Buffer.from('b394', 'hex');
exports['skein1024-424'] = Buffer.from('b395', 'hex');
exports['skein1024-432'] = Buffer.from('b396', 'hex');
exports['skein1024-440'] = Buffer.from('b397', 'hex');
exports['skein1024-448'] = Buffer.from('b398', 'hex');
exports['skein1024-456'] = Buffer.from('b399', 'hex');
exports['skein1024-464'] = Buffer.from('b39a', 'hex');
exports['skein1024-472'] = Buffer.from('b39b', 'hex');
exports['skein1024-480'] = Buffer.from('b39c', 'hex');
exports['skein1024-488'] = Buffer.from('b39d', 'hex');
exports['skein1024-496'] = Buffer.from('b39e', 'hex');
exports['skein1024-504'] = Buffer.from('b39f', 'hex');
exports['skein1024-512'] = Buffer.from('b3a0', 'hex');
exports['skein1024-520'] = Buffer.from('b3a1', 'hex');
exports['skein1024-528'] = Buffer.from('b3a2', 'hex');
exports['skein1024-536'] = Buffer.from('b3a3', 'hex');
exports['skein1024-544'] = Buffer.from('b3a4', 'hex');
exports['skein1024-552'] = Buffer.from('b3a5', 'hex');
exports['skein1024-560'] = Buffer.from('b3a6', 'hex');
exports['skein1024-568'] = Buffer.from('b3a7', 'hex');
exports['skein1024-576'] = Buffer.from('b3a8', 'hex');
exports['skein1024-584'] = Buffer.from('b3a9', 'hex');
exports['skein1024-592'] = Buffer.from('b3aa', 'hex');
exports['skein1024-600'] = Buffer.from('b3ab', 'hex');
exports['skein1024-608'] = Buffer.from('b3ac', 'hex');
exports['skein1024-616'] = Buffer.from('b3ad', 'hex');
exports['skein1024-624'] = Buffer.from('b3ae', 'hex');
exports['skein1024-632'] = Buffer.from('b3af', 'hex');
exports['skein1024-640'] = Buffer.from('b3b0', 'hex');
exports['skein1024-648'] = Buffer.from('b3b1', 'hex');
exports['skein1024-656'] = Buffer.from('b3b2', 'hex');
exports['skein1024-664'] = Buffer.from('b3b3', 'hex');
exports['skein1024-672'] = Buffer.from('b3b4', 'hex');
exports['skein1024-680'] = Buffer.from('b3b5', 'hex');
exports['skein1024-688'] = Buffer.from('b3b6', 'hex');
exports['skein1024-696'] = Buffer.from('b3b7', 'hex');
exports['skein1024-704'] = Buffer.from('b3b8', 'hex');
exports['skein1024-712'] = Buffer.from('b3b9', 'hex');
exports['skein1024-720'] = Buffer.from('b3ba', 'hex');
exports['skein1024-728'] = Buffer.from('b3bb', 'hex');
exports['skein1024-736'] = Buffer.from('b3bc', 'hex');
exports['skein1024-744'] = Buffer.from('b3bd', 'hex');
exports['skein1024-752'] = Buffer.from('b3be', 'hex');
exports['skein1024-760'] = Buffer.from('b3bf', 'hex');
exports['skein1024-768'] = Buffer.from('b3c0', 'hex');
exports['skein1024-776'] = Buffer.from('b3c1', 'hex');
exports['skein1024-784'] = Buffer.from('b3c2', 'hex');
exports['skein1024-792'] = Buffer.from('b3c3', 'hex');
exports['skein1024-800'] = Buffer.from('b3c4', 'hex');
exports['skein1024-808'] = Buffer.from('b3c5', 'hex');
exports['skein1024-816'] = Buffer.from('b3c6', 'hex');
exports['skein1024-824'] = Buffer.from('b3c7', 'hex');
exports['skein1024-832'] = Buffer.from('b3c8', 'hex');
exports['skein1024-840'] = Buffer.from('b3c9', 'hex');
exports['skein1024-848'] = Buffer.from('b3ca', 'hex');
exports['skein1024-856'] = Buffer.from('b3cb', 'hex');
exports['skein1024-864'] = Buffer.from('b3cc', 'hex');
exports['skein1024-872'] = Buffer.from('b3cd', 'hex');
exports['skein1024-880'] = Buffer.from('b3ce', 'hex');
exports['skein1024-888'] = Buffer.from('b3cf', 'hex');
exports['skein1024-896'] = Buffer.from('b3d0', 'hex');
exports['skein1024-904'] = Buffer.from('b3d1', 'hex');
exports['skein1024-912'] = Buffer.from('b3d2', 'hex');
exports['skein1024-920'] = Buffer.from('b3d3', 'hex');
exports['skein1024-928'] = Buffer.from('b3d4', 'hex');
exports['skein1024-936'] = Buffer.from('b3d5', 'hex');
exports['skein1024-944'] = Buffer.from('b3d6', 'hex');
exports['skein1024-952'] = Buffer.from('b3d7', 'hex');
exports['skein1024-960'] = Buffer.from('b3d8', 'hex');
exports['skein1024-968'] = Buffer.from('b3d9', 'hex');
exports['skein1024-976'] = Buffer.from('b3da', 'hex');
exports['skein1024-984'] = Buffer.from('b3db', 'hex');
exports['skein1024-992'] = Buffer.from('b3dc', 'hex');
exports['skein1024-1000'] = Buffer.from('b3dd', 'hex');
exports['skein1024-1008'] = Buffer.from('b3de', 'hex');
exports['skein1024-1016'] = Buffer.from('b3df', 'hex');
exports['skein1024-1024'] = Buffer.from('b3e0', 'hex'); // multiaddr

exports['ip4'] = Buffer.from('04', 'hex');
exports['tcp'] = Buffer.from('06', 'hex');
exports['dccp'] = Buffer.from('21', 'hex');
exports['ip6'] = Buffer.from('29', 'hex');
exports['ip6zone'] = Buffer.from('2a', 'hex');
exports['dns'] = Buffer.from('35', 'hex');
exports['dns4'] = Buffer.from('36', 'hex');
exports['dns6'] = Buffer.from('37', 'hex');
exports['dnsaddr'] = Buffer.from('38', 'hex');
exports['sctp'] = Buffer.from('84', 'hex');
exports['udp'] = Buffer.from('0111', 'hex');
exports['p2p-webrtc-star'] = Buffer.from('0113', 'hex');
exports['p2p-webrtc-direct'] = Buffer.from('0114', 'hex');
exports['p2p-stardust'] = Buffer.from('0115', 'hex');
exports['p2p-circuit'] = Buffer.from('0122', 'hex');
exports['udt'] = Buffer.from('012d', 'hex');
exports['utp'] = Buffer.from('012e', 'hex');
exports['unix'] = Buffer.from('0190', 'hex');
exports['p2p'] = Buffer.from('01a5', 'hex');
exports['ipfs'] = Buffer.from('01a5', 'hex');
exports['https'] = Buffer.from('01bb', 'hex');
exports['onion'] = Buffer.from('01bc', 'hex');
exports['onion3'] = Buffer.from('01bd', 'hex');
exports['garlic64'] = Buffer.from('01be', 'hex');
exports['garlic32'] = Buffer.from('01bf', 'hex');
exports['quic'] = Buffer.from('01cc', 'hex');
exports['ws'] = Buffer.from('01dd', 'hex');
exports['wss'] = Buffer.from('01de', 'hex');
exports['p2p-websocket-star'] = Buffer.from('01df', 'hex');
exports['http'] = Buffer.from('01e0', 'hex'); // ipld

exports['raw'] = Buffer.from('55', 'hex');
exports['dag-pb'] = Buffer.from('70', 'hex');
exports['dag-cbor'] = Buffer.from('71', 'hex');
exports['libp2p-key'] = Buffer.from('72', 'hex');
exports['git-raw'] = Buffer.from('78', 'hex');
exports['torrent-info'] = Buffer.from('7b', 'hex');
exports['torrent-file'] = Buffer.from('7c', 'hex');
exports['leofcoin-block'] = Buffer.from('81', 'hex');
exports['leofcoin-tx'] = Buffer.from('82', 'hex');
exports['leofcoin-pr'] = Buffer.from('83', 'hex');
exports['eth-block'] = Buffer.from('90', 'hex');
exports['eth-block-list'] = Buffer.from('91', 'hex');
exports['eth-tx-trie'] = Buffer.from('92', 'hex');
exports['eth-tx'] = Buffer.from('93', 'hex');
exports['eth-tx-receipt-trie'] = Buffer.from('94', 'hex');
exports['eth-tx-receipt'] = Buffer.from('95', 'hex');
exports['eth-state-trie'] = Buffer.from('96', 'hex');
exports['eth-account-snapshot'] = Buffer.from('97', 'hex');
exports['eth-storage-trie'] = Buffer.from('98', 'hex');
exports['bitcoin-block'] = Buffer.from('b0', 'hex');
exports['bitcoin-tx'] = Buffer.from('b1', 'hex');
exports['zcash-block'] = Buffer.from('c0', 'hex');
exports['zcash-tx'] = Buffer.from('c1', 'hex');
exports['stellar-block'] = Buffer.from('d0', 'hex');
exports['stellar-tx'] = Buffer.from('d1', 'hex');
exports['decred-block'] = Buffer.from('e0', 'hex');
exports['decred-tx'] = Buffer.from('e1', 'hex');
exports['dash-block'] = Buffer.from('f0', 'hex');
exports['dash-tx'] = Buffer.from('f1', 'hex');
exports['swarm-manifest'] = Buffer.from('fa', 'hex');
exports['swarm-feed'] = Buffer.from('fb', 'hex');
exports['dag-json'] = Buffer.from('0129', 'hex'); // namespace

exports['path'] = Buffer.from('2f', 'hex');
exports['ipld-ns'] = Buffer.from('e2', 'hex');
exports['ipfs-ns'] = Buffer.from('e3', 'hex');
exports['swarm-ns'] = Buffer.from('e4', 'hex'); // key

exports['ed25519-pub'] = Buffer.from('ed', 'hex'); // holochain

exports['holochain-adr-v0'] = Buffer.from('807124', 'hex');
exports['holochain-adr-v1'] = Buffer.from('817124', 'hex');
exports['holochain-key-v0'] = Buffer.from('947124', 'hex');
exports['holochain-key-v1'] = Buffer.from('957124', 'hex');
exports['holochain-sig-v0'] = Buffer.from('a27124', 'hex');
exports['holochain-sig-v1'] = Buffer.from('a37124', 'hex');
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {// No operation performed.
}

module.exports = noop;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(31),
    getRawTag = __webpack_require__(87),
    objectToString = __webpack_require__(88);
/** `Object#toString` result references. */


var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

module.exports = baseGetTag;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && _typeof(value) == 'object';
}

module.exports = isObjectLike;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsync = undefined;

var _asyncify = __webpack_require__(108);

var _asyncify2 = _interopRequireDefault(_asyncify);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
  return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
  return isAsync(asyncFn) ? (0, _asyncify2["default"])(asyncFn) : asyncFn;
}

exports["default"] = wrapAsync;
exports.isAsync = isAsync;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/

var pna = __webpack_require__(7);
/*</replacement>*/


module.exports = Readable;
/*<replacement>*/

var isArray = __webpack_require__(20);
/*</replacement>*/

/*<replacement>*/


var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = __webpack_require__(9).EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = __webpack_require__(21);
/*</replacement>*/

/*<replacement>*/


var Buffer = __webpack_require__(5).Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/


var util = __webpack_require__(6);

util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/

var debugUtil = __webpack_require__(45);

var debug = void 0;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = __webpack_require__(46);

var destroyImpl = __webpack_require__(22);

var StringDecoder;
util.inherits(Readable, Stream);
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(3);
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(24).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(3);
  if (!(this instanceof Readable)) return new Readable(options);
  this._readableState = new ReadableState(options, this); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  return er;
} // if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.


function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(24).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
}; // Don't raise the hwm > 8MB


var MAX_HWM = 0x800000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true; // emit 'readable' now to make sure it gets picked up.

  emitReadable(stream);
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;

  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;else len = state.length;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  } // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.


  var increasedAwaitDrain = false;
  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);

    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;

    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;

      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }

  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {}
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList; // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }
  return ret;
} // Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function fromListPartial(n, list, hasStrings) {
  var ret;

  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }

  return ret;
} // Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;

  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;

    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
} // Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;

  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;

    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState; // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.

  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(9).EventEmitter;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*<replacement>*/

var pna = __webpack_require__(7);
/*</replacement>*/
// undocumented cb() API, needed for core, not for public API


function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);

      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // setimmediate attaches itself to the global object


__webpack_require__(48); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || void 0 && (void 0).setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || void 0 && (void 0).clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/

var Buffer = __webpack_require__(5).Buffer;
/*</replacement>*/


var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;

  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;

  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';

      case 'latin1':
      case 'binary':
        return 'latin1';

      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;

      default:
        if (retried) return; // undefined

        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}

; // Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings

function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);

  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
} // StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.


exports.StringDecoder = StringDecoder;

function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;

  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;

    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;

    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;

    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }

  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;

  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }

  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End; // Returns only complete characters in a Buffer

StringDecoder.prototype.text = utf8Text; // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer

StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
}; // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.


function utf8CheckByte(_byte) {
  if (_byte <= 0x7F) return 0;else if (_byte >> 5 === 0x06) return 2;else if (_byte >> 4 === 0x0E) return 3;else if (_byte >> 3 === 0x1E) return 4;
  return _byte >> 6 === 0x02 ? -1 : -2;
} // Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.


function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }

    return nb;
  }

  return 0;
} // Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.


function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return "\uFFFD";
  }

  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return "\uFFFD";
    }

    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return "\uFFFD";
      }
    }
  }
} // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.


function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;

  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
} // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.


function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
} // For UTF-8, a replacement character is added when ending on a partial
// character.


function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + "\uFFFD";
  return r;
} // UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.


function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);

    if (r) {
      var c = r.charCodeAt(r.length - 1);

      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }

    return r;
  }

  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
} // For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.


function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';

  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }

  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;

  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }

  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
} // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)


function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.


module.exports = Transform;

var Duplex = __webpack_require__(3);
/*<replacement>*/


var util = __webpack_require__(6);

util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);

    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');
  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');
  return stream.push(null);
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(58)(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc
var Buffer = __webpack_require__(5).Buffer;

module.exports = function base(ALPHABET) {
  var ALPHABET_MAP = {};
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0); // pre-compute lookup table

  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z);
    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous');
    ALPHABET_MAP[x] = z;
  }

  function encode(source) {
    if (source.length === 0) return '';
    var digits = [0];

    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % BASE;
        carry = carry / BASE | 0;
      }

      while (carry > 0) {
        digits.push(carry % BASE);
        carry = carry / BASE | 0;
      }
    }

    var string = ''; // deal with leading zeros

    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) {
      string += LEADER;
    } // convert digits to a string


    for (var q = digits.length - 1; q >= 0; --q) {
      string += ALPHABET[digits[q]];
    }

    return string;
  }

  function decodeUnsafe(string) {
    if (typeof string !== 'string') throw new TypeError('Expected String');
    if (string.length === 0) return Buffer.allocUnsafe(0);
    var bytes = [0];

    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]];
      if (value === undefined) return;

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE;
        bytes[j] = carry & 0xff;
        carry >>= 8;
      }

      while (carry > 0) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    } // deal with leading zeros


    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0);
    }

    return Buffer.from(bytes.reverse());
  }

  function decode(string) {
    var buffer = decodeUnsafe(string);
    if (buffer) return buffer;
    throw new Error('Non-base' + BASE + ' character');
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  };
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var varint = __webpack_require__(13);

module.exports = {
  numberToBuffer: numberToBuffer,
  bufferToNumber: bufferToNumber,
  varintBufferEncode: varintBufferEncode,
  varintBufferDecode: varintBufferDecode
};

function bufferToNumber(buf) {
  return parseInt(buf.toString('hex'), 16);
}

function numberToBuffer(num) {
  var hexString = num.toString(16);

  if (hexString.length % 2 === 1) {
    hexString = '0' + hexString;
  }

  return Buffer.from(hexString, 'hex');
}

function varintBufferEncode(input) {
  return Buffer.from(varint.encode(bufferToNumber(input)));
}

function varintBufferDecode(input) {
  return numberToBuffer(varint.decode(input));
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = once;

function once(fn) {
  return function () {
    if (fn === null) return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, arguments);
  };
}

module.exports = exports["default"];

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isFunction = __webpack_require__(86),
    isLength = __webpack_require__(35);
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */


function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root = __webpack_require__(32);
/** Built-in value references. */


var _Symbol = root.Symbol;
module.exports = _Symbol;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var freeGlobal = __webpack_require__(33);
/** Detect free variable `self`. */


var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
module.exports = root;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global && global.Object === Object && global;
module.exports = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = _typeof(value);

  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;
module.exports = isArray;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function () {};

    module.paths = []; // module.parent = undefined by default

    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
      enumerable: true,
      get: function get() {
        return module.l;
      }
    });
    Object.defineProperty(module, "id", {
      enumerable: true,
      get: function get() {
        return module.i;
      }
    });
    module.webpackPolyfill = 1;
  }

  return module;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = onlyOnce;

function onlyOnce(fn) {
  return function () {
    if (fn === null) throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, arguments);
  };
}

module.exports = exports["default"];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-unused-vars */
// Converts path or url to an array starting at CID

function cidArray(path) {
  if (path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1);
  } // skip /ipxs/ prefix


  if (path.match(/^\/ip[fn]s\//)) {
    path = path.substring(6);
  } // skip ipxs:// protocol


  if (path.match(/^ip[fn]s:\/\//)) {
    path = path.substring(7);
  }

  return path.split('/');
}

function removeLeadingSlash(url) {
  if (url[0] === '/') {
    url = url.substring(1);
  }

  return url;
}

function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }

  return url;
}

function removeSlashFromBothEnds(url) {
  url = removeLeadingSlash(url);
  url = removeTrailingSlash(url);
  return url;
}

function joinURLParts() {
  for (var _len = arguments.length, urls = new Array(_len), _key = 0; _key < _len; _key++) {
    urls[_key] = arguments[_key];
  }

  urls = urls.filter(function (url) {
    return url.length > 0;
  });
  urls = [''].concat(urls.map(function (url) {
    return removeSlashFromBothEnds(url);
  }));
  return urls.join('/');
}

module.exports = {
  cidArray: cidArray,
  removeLeadingSlash: removeLeadingSlash,
  removeTrailingSlash: removeTrailingSlash,
  removeSlashFromBothEnds: removeSlashFromBothEnds,
  joinURLParts: joinURLParts
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(41);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global Response */


var stream = __webpack_require__(42);

var toBlob = __webpack_require__(55);

var debug = __webpack_require__(26);

var log = debug('ipfs:http:response');

var resolver = __webpack_require__(60);

var pathUtils = __webpack_require__(39);

var detectContentType = __webpack_require__(116); // TODO: pass path and add Etag and X-Ipfs-Path + tests


var header = function header() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var statusText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'OK';
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    status: status,
    statusText: statusText,
    headers: headers
  };
};

var response = function response(ipfsNode, ipfsPath) {
  // handle hash resolve error (simple hash, test for directory now)
  var handleResolveError = function handleResolveError(node, path, error) {
    if (error) {
      var errorString = error.toString();
      return new Promise(function (resolve, reject) {
        // switch case with true feels so wrong.
        switch (true) {
          case errorString.includes('dag node is a directory'):
            resolver.directory(node, path, error.cid).then(function (content) {
              // dir render
              if (typeof content === 'string') {
                resolve(new Response(content, header(200, 'OK', {
                  'Content-Type': 'text/html'
                })));
              } // redirect to dir entry point (index)


              resolve(Response.redirect(pathUtils.joinURLParts(path, content[0].Name)));
            })["catch"](function (error) {
              log(error);
              resolve(new Response(errorString, header(500, error.toString())));
            });
            break;

          case errorString.startsWith('Error: no link named'):
            resolve(new Response(errorString, header(404, errorString)));
            break;

          case errorString.startsWith('Error: multihash length inconsistent'):
          case errorString.startsWith('Error: Non-base58 character'):
            resolve(new Response(errorString, header(400, errorString)));
            break;

          default:
            log(error);
            resolve(new Response(errorString, header(500, errorString)));
        }
      });
    }
  };

  return new Promise(function (resolve, reject) {
    // remove trailing slash for files if needed
    if (ipfsPath.endsWith('/')) {
      resolve(Response.redirect(pathUtils.removeTrailingSlash(ipfsPath)));
    }

    resolver.cid(ipfsNode, ipfsPath).then(function (resolvedData) {
      var readableStream = ipfsNode.catReadableStream(resolvedData.cid);
      var responseStream = new stream.PassThrough({
        highWaterMark: 1
      });
      readableStream.pipe(responseStream);
      readableStream.once('error', function (error) {
        if (error) {
          log(error);
          resolve(new Response(error.toString(), header(500, 'Error fetching the file')));
        }
      }); // return only after first chunk being checked

      var contentTypeDetected = false;
      readableStream.on('data', function (chunk) {
        // check mime on first chunk
        if (contentTypeDetected) {
          return;
        }

        contentTypeDetected = true; // return Response with mime type

        var contentType = detectContentType(ipfsPath, chunk);

        if (typeof Blob === 'undefined') {
          if (contentType) {
            resolve(new Response(responseStream, header(200, 'OK', {
              'Content-Type': contentType
            })));
          } else {
            resolve(new Response(responseStream, header()));
          }
        } else {
          toBlob(responseStream, function (err, blob) {
            if (err) {
              resolve(new Response(err.toString(), header(500, 'Error fetching the file')));
            }

            if (contentType) {
              resolve(new Response(blob, header(200, 'OK', {
                'Content-Type': contentType
              })));
            } else {
              resolve(new Response(blob, header()));
            }
          });
        }
      });
    })["catch"](function (error) {
      log(error);
      resolve(handleResolveError(ipfsNode, ipfsPath, error));
    });
  });
};

module.exports = {
  getResponse: response,
  resolver: resolver
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
module.exports = Stream;

var EE = __webpack_require__(9).EventEmitter;

var inherits = __webpack_require__(4);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(10);
Stream.Writable = __webpack_require__(51);
Stream.Duplex = __webpack_require__(52);
Stream.Transform = __webpack_require__(53);
Stream.PassThrough = __webpack_require__(54); // Backwards-compat with node 0.4.x

Stream.Stream = Stream; // old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function (dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain); // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.

  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;

  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }

  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;
    if (typeof dest.destroy === 'function') dest.destroy();
  } // don't leave dangling pipes when there are errors.


  function onerror(er) {
    cleanup();

    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror); // remove all the event listeners that were added.

  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);
    source.removeListener('end', onend);
    source.removeListener('close', onclose);
    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);
    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);
  dest.on('close', cleanup);
  dest.emit('pipe', source); // Allow for unix-like usage: A.pipe(B).pipe(C)

  return dest;
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42


  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

  for (var i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Buffer = __webpack_require__(5).Buffer;

var util = __webpack_require__(47);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = {
      data: v,
      next: null
    };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = {
      data: v,
      next: this.head
    };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;

    while (p = p.next) {
      ret += s + p.data;
    }

    return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;

    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }

    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({
      length: this.length
    });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero

  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;

    switch (args.length) {
      case 0:
        callback();
        break;

      case 1:
        callback(args[0]);
        break;

      case 2:
        callback(args[0], args[1]);
        break;

      case 3:
        callback(args[0], args[1], args[2]);
        break;

      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];

      if (task) {
        currentlyRunningATask = true;

        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function registerImmediate(handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;

      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };

      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    var messagePrefix = "setImmediate$" + Math.random() + "$";

    var onGlobalMessage = function onGlobalMessage(event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function registerImmediate(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function registerImmediate(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function registerImmediate(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");

      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };

      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function registerImmediate(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? void 0 : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module exports.
 */
module.exports = deprecate;
/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */


function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }

  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.


module.exports = PassThrough;

var Transform = __webpack_require__(25);
/*<replacement>*/


var util = __webpack_require__(6);

util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(11);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(3);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10).Transform;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10).PassThrough;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global Blob */
var once = __webpack_require__(56);

module.exports = function getBlob(stream, mimeType, cb) {
  if (typeof mimeType === 'function') return getBlob(stream, null, mimeType);
  cb = once(cb);
  var chunks = [];
  stream.on('data', function (chunk) {
    chunks.push(chunk);
  }).on('end', function () {
    var blob = mimeType ? new Blob(chunks, {
      type: mimeType
    }) : new Blob(chunks);
    cb(null, blob);
  }).on('error', cb);
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var wrappy = __webpack_require__(57);

module.exports = wrappy(once);
module.exports.strict = wrappy(onceStrict);
once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function value() {
      return once(this);
    },
    configurable: true
  });
  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function value() {
      return onceStrict(this);
    },
    configurable: true
  });
});

function once(fn) {
  var f = function f() {
    if (f.called) return f.value;
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  f.called = false;
  return f;
}

function onceStrict(fn) {
  var f = function f() {
    if (f.called) throw new Error(f.onceError);
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f;
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy;

function wrappy(fn, cb) {
  if (fn && cb) return wrappy(fn)(cb);
  if (typeof fn !== 'function') throw new TypeError('need wrapper function');
  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });
  return wrapper;

  function wrapper() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    var ret = fn.apply(this, args);
    var cb = args[args.length - 1];

    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }

    return ret;
  }
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug["default"] = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(59);
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Disabled?
      if (!debug.enabled) {
        return;
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
      return '-' + namespace;
    }))).join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Helpers.
 */
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};

  var type = _typeof(val);

  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options["long"] ? fmtLong(val) : fmtShort(val);
  }

  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */


function parse(str) {
  str = String(str);

  if (str.length > 100) {
    return;
  }

  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);

  if (!match) {
    return;
  }

  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();

  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;

    case 'weeks':
    case 'week':
    case 'w':
      return n * w;

    case 'days':
    case 'day':
    case 'd':
      return n * d;

    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;

    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;

    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;

    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;

    default:
      return undefined;
  }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */


function fmtShort(ms) {
  var msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }

  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }

  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }

  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }

  return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */


function fmtLong(ms) {
  var msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }

  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }

  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }

  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }

  return ms + ' ms';
}
/**
 * Pluralization helper.
 */


function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mh = __webpack_require__(12);

var promisify = __webpack_require__(66);

var CID = __webpack_require__(67);

var debug = __webpack_require__(26);

var tryEach = __webpack_require__(81);

var waterfall = __webpack_require__(112);

var log = debug('jsipfs:http:response:resolver');
log.error = debug('jsipfs:http:response:resolver:error');

var dirView = __webpack_require__(113);

var INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml'];

var findIndexFile = function findIndexFile(ipfs, path, callback) {
  return tryEach(INDEX_HTML_FILES.map(function (file) {
    return function (cb) {
      waterfall([function (cb) {
        return ipfs.files.stat("".concat(path, "/").concat(file), cb);
      }, function (stats, cb) {
        return cb(null, {
          name: file,
          cid: new CID(stats.hash)
        });
      }], cb);
    };
  }), callback);
};

var directory = promisify(function (ipfs, path, cid, callback) {
  // Test if it is a Website
  findIndexFile(ipfs, path, function (err, res) {
    if (err) {
      if (err.message.includes('does not exist')) {
        // not a website, just show a directory listing
        return ipfs.dag.get(cid, function (err, result) {
          if (err) {
            return callback(err);
          }

          return callback(null, dirView.render(path, result.value.Links));
        });
      }

      return callback(err);
    }

    callback(err, [{
      Name: res.name
    }]);
  });
});
var cid = promisify(function (ipfs, path, callback) {
  ipfs.files.stat(path, function (err, stats) {
    if (err) {
      return callback(err);
    }

    var cid = new CID(stats.hash);

    if (stats.type.includes('directory')) {
      var _err = new Error('This dag node is a directory');

      _err.cid = cid;
      _err.fileName = stats.name;
      _err.dagDirType = stats.type;
      return callback(_err);
    }

    callback(err, {
      cid: cid
    });
  });
});
var multihash = promisify(function (ipfs, path, callback) {
  // deprecated, use 'cid' instead
  // (left for backward-compatibility)
  cid(ipfs, path).then(function (result) {
    callback(null, {
      multihash: mh.toB58String(result.cid.multihash)
    });
  })["catch"](function (err) {
    callback(err);
  });
});
module.exports = {
  directory: directory,
  cid: cid,
  multihash: multihash
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var basex = __webpack_require__(27);

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
module.exports = basex(ALPHABET);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint quote-props: off */

/* eslint key-spacing: off */


exports.names = Object.freeze({
  'id': 0x0,
  'sha1': 0x11,
  'sha2-256': 0x12,
  'sha2-512': 0x13,
  'dbl-sha2-256': 0x56,
  'sha3-224': 0x17,
  'sha3-256': 0x16,
  'sha3-384': 0x15,
  'sha3-512': 0x14,
  'shake-128': 0x18,
  'shake-256': 0x19,
  'keccak-224': 0x1A,
  'keccak-256': 0x1B,
  'keccak-384': 0x1C,
  'keccak-512': 0x1D,
  'murmur3-128': 0x22,
  'murmur3-32': 0x23,
  'blake2b-8': 0xb201,
  'blake2b-16': 0xb202,
  'blake2b-24': 0xb203,
  'blake2b-32': 0xb204,
  'blake2b-40': 0xb205,
  'blake2b-48': 0xb206,
  'blake2b-56': 0xb207,
  'blake2b-64': 0xb208,
  'blake2b-72': 0xb209,
  'blake2b-80': 0xb20a,
  'blake2b-88': 0xb20b,
  'blake2b-96': 0xb20c,
  'blake2b-104': 0xb20d,
  'blake2b-112': 0xb20e,
  'blake2b-120': 0xb20f,
  'blake2b-128': 0xb210,
  'blake2b-136': 0xb211,
  'blake2b-144': 0xb212,
  'blake2b-152': 0xb213,
  'blake2b-160': 0xb214,
  'blake2b-168': 0xb215,
  'blake2b-176': 0xb216,
  'blake2b-184': 0xb217,
  'blake2b-192': 0xb218,
  'blake2b-200': 0xb219,
  'blake2b-208': 0xb21a,
  'blake2b-216': 0xb21b,
  'blake2b-224': 0xb21c,
  'blake2b-232': 0xb21d,
  'blake2b-240': 0xb21e,
  'blake2b-248': 0xb21f,
  'blake2b-256': 0xb220,
  'blake2b-264': 0xb221,
  'blake2b-272': 0xb222,
  'blake2b-280': 0xb223,
  'blake2b-288': 0xb224,
  'blake2b-296': 0xb225,
  'blake2b-304': 0xb226,
  'blake2b-312': 0xb227,
  'blake2b-320': 0xb228,
  'blake2b-328': 0xb229,
  'blake2b-336': 0xb22a,
  'blake2b-344': 0xb22b,
  'blake2b-352': 0xb22c,
  'blake2b-360': 0xb22d,
  'blake2b-368': 0xb22e,
  'blake2b-376': 0xb22f,
  'blake2b-384': 0xb230,
  'blake2b-392': 0xb231,
  'blake2b-400': 0xb232,
  'blake2b-408': 0xb233,
  'blake2b-416': 0xb234,
  'blake2b-424': 0xb235,
  'blake2b-432': 0xb236,
  'blake2b-440': 0xb237,
  'blake2b-448': 0xb238,
  'blake2b-456': 0xb239,
  'blake2b-464': 0xb23a,
  'blake2b-472': 0xb23b,
  'blake2b-480': 0xb23c,
  'blake2b-488': 0xb23d,
  'blake2b-496': 0xb23e,
  'blake2b-504': 0xb23f,
  'blake2b-512': 0xb240,
  'blake2s-8': 0xb241,
  'blake2s-16': 0xb242,
  'blake2s-24': 0xb243,
  'blake2s-32': 0xb244,
  'blake2s-40': 0xb245,
  'blake2s-48': 0xb246,
  'blake2s-56': 0xb247,
  'blake2s-64': 0xb248,
  'blake2s-72': 0xb249,
  'blake2s-80': 0xb24a,
  'blake2s-88': 0xb24b,
  'blake2s-96': 0xb24c,
  'blake2s-104': 0xb24d,
  'blake2s-112': 0xb24e,
  'blake2s-120': 0xb24f,
  'blake2s-128': 0xb250,
  'blake2s-136': 0xb251,
  'blake2s-144': 0xb252,
  'blake2s-152': 0xb253,
  'blake2s-160': 0xb254,
  'blake2s-168': 0xb255,
  'blake2s-176': 0xb256,
  'blake2s-184': 0xb257,
  'blake2s-192': 0xb258,
  'blake2s-200': 0xb259,
  'blake2s-208': 0xb25a,
  'blake2s-216': 0xb25b,
  'blake2s-224': 0xb25c,
  'blake2s-232': 0xb25d,
  'blake2s-240': 0xb25e,
  'blake2s-248': 0xb25f,
  'blake2s-256': 0xb260,
  'Skein256-8': 0xb301,
  'Skein256-16': 0xb302,
  'Skein256-24': 0xb303,
  'Skein256-32': 0xb304,
  'Skein256-40': 0xb305,
  'Skein256-48': 0xb306,
  'Skein256-56': 0xb307,
  'Skein256-64': 0xb308,
  'Skein256-72': 0xb309,
  'Skein256-80': 0xb30a,
  'Skein256-88': 0xb30b,
  'Skein256-96': 0xb30c,
  'Skein256-104': 0xb30d,
  'Skein256-112': 0xb30e,
  'Skein256-120': 0xb30f,
  'Skein256-128': 0xb310,
  'Skein256-136': 0xb311,
  'Skein256-144': 0xb312,
  'Skein256-152': 0xb313,
  'Skein256-160': 0xb314,
  'Skein256-168': 0xb315,
  'Skein256-176': 0xb316,
  'Skein256-184': 0xb317,
  'Skein256-192': 0xb318,
  'Skein256-200': 0xb319,
  'Skein256-208': 0xb31a,
  'Skein256-216': 0xb31b,
  'Skein256-224': 0xb31c,
  'Skein256-232': 0xb31d,
  'Skein256-240': 0xb31e,
  'Skein256-248': 0xb31f,
  'Skein256-256': 0xb320,
  'Skein512-8': 0xb321,
  'Skein512-16': 0xb322,
  'Skein512-24': 0xb323,
  'Skein512-32': 0xb324,
  'Skein512-40': 0xb325,
  'Skein512-48': 0xb326,
  'Skein512-56': 0xb327,
  'Skein512-64': 0xb328,
  'Skein512-72': 0xb329,
  'Skein512-80': 0xb32a,
  'Skein512-88': 0xb32b,
  'Skein512-96': 0xb32c,
  'Skein512-104': 0xb32d,
  'Skein512-112': 0xb32e,
  'Skein512-120': 0xb32f,
  'Skein512-128': 0xb330,
  'Skein512-136': 0xb331,
  'Skein512-144': 0xb332,
  'Skein512-152': 0xb333,
  'Skein512-160': 0xb334,
  'Skein512-168': 0xb335,
  'Skein512-176': 0xb336,
  'Skein512-184': 0xb337,
  'Skein512-192': 0xb338,
  'Skein512-200': 0xb339,
  'Skein512-208': 0xb33a,
  'Skein512-216': 0xb33b,
  'Skein512-224': 0xb33c,
  'Skein512-232': 0xb33d,
  'Skein512-240': 0xb33e,
  'Skein512-248': 0xb33f,
  'Skein512-256': 0xb340,
  'Skein512-264': 0xb341,
  'Skein512-272': 0xb342,
  'Skein512-280': 0xb343,
  'Skein512-288': 0xb344,
  'Skein512-296': 0xb345,
  'Skein512-304': 0xb346,
  'Skein512-312': 0xb347,
  'Skein512-320': 0xb348,
  'Skein512-328': 0xb349,
  'Skein512-336': 0xb34a,
  'Skein512-344': 0xb34b,
  'Skein512-352': 0xb34c,
  'Skein512-360': 0xb34d,
  'Skein512-368': 0xb34e,
  'Skein512-376': 0xb34f,
  'Skein512-384': 0xb350,
  'Skein512-392': 0xb351,
  'Skein512-400': 0xb352,
  'Skein512-408': 0xb353,
  'Skein512-416': 0xb354,
  'Skein512-424': 0xb355,
  'Skein512-432': 0xb356,
  'Skein512-440': 0xb357,
  'Skein512-448': 0xb358,
  'Skein512-456': 0xb359,
  'Skein512-464': 0xb35a,
  'Skein512-472': 0xb35b,
  'Skein512-480': 0xb35c,
  'Skein512-488': 0xb35d,
  'Skein512-496': 0xb35e,
  'Skein512-504': 0xb35f,
  'Skein512-512': 0xb360,
  'Skein1024-8': 0xb361,
  'Skein1024-16': 0xb362,
  'Skein1024-24': 0xb363,
  'Skein1024-32': 0xb364,
  'Skein1024-40': 0xb365,
  'Skein1024-48': 0xb366,
  'Skein1024-56': 0xb367,
  'Skein1024-64': 0xb368,
  'Skein1024-72': 0xb369,
  'Skein1024-80': 0xb36a,
  'Skein1024-88': 0xb36b,
  'Skein1024-96': 0xb36c,
  'Skein1024-104': 0xb36d,
  'Skein1024-112': 0xb36e,
  'Skein1024-120': 0xb36f,
  'Skein1024-128': 0xb370,
  'Skein1024-136': 0xb371,
  'Skein1024-144': 0xb372,
  'Skein1024-152': 0xb373,
  'Skein1024-160': 0xb374,
  'Skein1024-168': 0xb375,
  'Skein1024-176': 0xb376,
  'Skein1024-184': 0xb377,
  'Skein1024-192': 0xb378,
  'Skein1024-200': 0xb379,
  'Skein1024-208': 0xb37a,
  'Skein1024-216': 0xb37b,
  'Skein1024-224': 0xb37c,
  'Skein1024-232': 0xb37d,
  'Skein1024-240': 0xb37e,
  'Skein1024-248': 0xb37f,
  'Skein1024-256': 0xb380,
  'Skein1024-264': 0xb381,
  'Skein1024-272': 0xb382,
  'Skein1024-280': 0xb383,
  'Skein1024-288': 0xb384,
  'Skein1024-296': 0xb385,
  'Skein1024-304': 0xb386,
  'Skein1024-312': 0xb387,
  'Skein1024-320': 0xb388,
  'Skein1024-328': 0xb389,
  'Skein1024-336': 0xb38a,
  'Skein1024-344': 0xb38b,
  'Skein1024-352': 0xb38c,
  'Skein1024-360': 0xb38d,
  'Skein1024-368': 0xb38e,
  'Skein1024-376': 0xb38f,
  'Skein1024-384': 0xb390,
  'Skein1024-392': 0xb391,
  'Skein1024-400': 0xb392,
  'Skein1024-408': 0xb393,
  'Skein1024-416': 0xb394,
  'Skein1024-424': 0xb395,
  'Skein1024-432': 0xb396,
  'Skein1024-440': 0xb397,
  'Skein1024-448': 0xb398,
  'Skein1024-456': 0xb399,
  'Skein1024-464': 0xb39a,
  'Skein1024-472': 0xb39b,
  'Skein1024-480': 0xb39c,
  'Skein1024-488': 0xb39d,
  'Skein1024-496': 0xb39e,
  'Skein1024-504': 0xb39f,
  'Skein1024-512': 0xb3a0,
  'Skein1024-520': 0xb3a1,
  'Skein1024-528': 0xb3a2,
  'Skein1024-536': 0xb3a3,
  'Skein1024-544': 0xb3a4,
  'Skein1024-552': 0xb3a5,
  'Skein1024-560': 0xb3a6,
  'Skein1024-568': 0xb3a7,
  'Skein1024-576': 0xb3a8,
  'Skein1024-584': 0xb3a9,
  'Skein1024-592': 0xb3aa,
  'Skein1024-600': 0xb3ab,
  'Skein1024-608': 0xb3ac,
  'Skein1024-616': 0xb3ad,
  'Skein1024-624': 0xb3ae,
  'Skein1024-632': 0xb3af,
  'Skein1024-640': 0xb3b0,
  'Skein1024-648': 0xb3b1,
  'Skein1024-656': 0xb3b2,
  'Skein1024-664': 0xb3b3,
  'Skein1024-672': 0xb3b4,
  'Skein1024-680': 0xb3b5,
  'Skein1024-688': 0xb3b6,
  'Skein1024-696': 0xb3b7,
  'Skein1024-704': 0xb3b8,
  'Skein1024-712': 0xb3b9,
  'Skein1024-720': 0xb3ba,
  'Skein1024-728': 0xb3bb,
  'Skein1024-736': 0xb3bc,
  'Skein1024-744': 0xb3bd,
  'Skein1024-752': 0xb3be,
  'Skein1024-760': 0xb3bf,
  'Skein1024-768': 0xb3c0,
  'Skein1024-776': 0xb3c1,
  'Skein1024-784': 0xb3c2,
  'Skein1024-792': 0xb3c3,
  'Skein1024-800': 0xb3c4,
  'Skein1024-808': 0xb3c5,
  'Skein1024-816': 0xb3c6,
  'Skein1024-824': 0xb3c7,
  'Skein1024-832': 0xb3c8,
  'Skein1024-840': 0xb3c9,
  'Skein1024-848': 0xb3ca,
  'Skein1024-856': 0xb3cb,
  'Skein1024-864': 0xb3cc,
  'Skein1024-872': 0xb3cd,
  'Skein1024-880': 0xb3ce,
  'Skein1024-888': 0xb3cf,
  'Skein1024-896': 0xb3d0,
  'Skein1024-904': 0xb3d1,
  'Skein1024-912': 0xb3d2,
  'Skein1024-920': 0xb3d3,
  'Skein1024-928': 0xb3d4,
  'Skein1024-936': 0xb3d5,
  'Skein1024-944': 0xb3d6,
  'Skein1024-952': 0xb3d7,
  'Skein1024-960': 0xb3d8,
  'Skein1024-968': 0xb3d9,
  'Skein1024-976': 0xb3da,
  'Skein1024-984': 0xb3db,
  'Skein1024-992': 0xb3dc,
  'Skein1024-1000': 0xb3dd,
  'Skein1024-1008': 0xb3de,
  'Skein1024-1016': 0xb3df,
  'Skein1024-1024': 0xb3e0
});
exports.codes = Object.freeze({
  0x11: 'sha1',
  0x12: 'sha2-256',
  0x13: 'sha2-512',
  0x56: 'dbl-sha2-256',
  0x17: 'sha3-224',
  0x16: 'sha3-256',
  0x15: 'sha3-384',
  0x14: 'sha3-512',
  0x18: 'shake-128',
  0x19: 'shake-256',
  0x1A: 'keccak-224',
  0x1B: 'keccak-256',
  0x1C: 'keccak-384',
  0x1D: 'keccak-512',
  0x22: 'murmur3-128',
  0x23: 'murmur3-32',
  // blake2
  0xb201: 'blake2b-8',
  0xb202: 'blake2b-16',
  0xb203: 'blake2b-24',
  0xb204: 'blake2b-32',
  0xb205: 'blake2b-40',
  0xb206: 'blake2b-48',
  0xb207: 'blake2b-56',
  0xb208: 'blake2b-64',
  0xb209: 'blake2b-72',
  0xb20a: 'blake2b-80',
  0xb20b: 'blake2b-88',
  0xb20c: 'blake2b-96',
  0xb20d: 'blake2b-104',
  0xb20e: 'blake2b-112',
  0xb20f: 'blake2b-120',
  0xb210: 'blake2b-128',
  0xb211: 'blake2b-136',
  0xb212: 'blake2b-144',
  0xb213: 'blake2b-152',
  0xb214: 'blake2b-160',
  0xb215: 'blake2b-168',
  0xb216: 'blake2b-176',
  0xb217: 'blake2b-184',
  0xb218: 'blake2b-192',
  0xb219: 'blake2b-200',
  0xb21a: 'blake2b-208',
  0xb21b: 'blake2b-216',
  0xb21c: 'blake2b-224',
  0xb21d: 'blake2b-232',
  0xb21e: 'blake2b-240',
  0xb21f: 'blake2b-248',
  0xb220: 'blake2b-256',
  0xb221: 'blake2b-264',
  0xb222: 'blake2b-272',
  0xb223: 'blake2b-280',
  0xb224: 'blake2b-288',
  0xb225: 'blake2b-296',
  0xb226: 'blake2b-304',
  0xb227: 'blake2b-312',
  0xb228: 'blake2b-320',
  0xb229: 'blake2b-328',
  0xb22a: 'blake2b-336',
  0xb22b: 'blake2b-344',
  0xb22c: 'blake2b-352',
  0xb22d: 'blake2b-360',
  0xb22e: 'blake2b-368',
  0xb22f: 'blake2b-376',
  0xb230: 'blake2b-384',
  0xb231: 'blake2b-392',
  0xb232: 'blake2b-400',
  0xb233: 'blake2b-408',
  0xb234: 'blake2b-416',
  0xb235: 'blake2b-424',
  0xb236: 'blake2b-432',
  0xb237: 'blake2b-440',
  0xb238: 'blake2b-448',
  0xb239: 'blake2b-456',
  0xb23a: 'blake2b-464',
  0xb23b: 'blake2b-472',
  0xb23c: 'blake2b-480',
  0xb23d: 'blake2b-488',
  0xb23e: 'blake2b-496',
  0xb23f: 'blake2b-504',
  0xb240: 'blake2b-512',
  0xb241: 'blake2s-8',
  0xb242: 'blake2s-16',
  0xb243: 'blake2s-24',
  0xb244: 'blake2s-32',
  0xb245: 'blake2s-40',
  0xb246: 'blake2s-48',
  0xb247: 'blake2s-56',
  0xb248: 'blake2s-64',
  0xb249: 'blake2s-72',
  0xb24a: 'blake2s-80',
  0xb24b: 'blake2s-88',
  0xb24c: 'blake2s-96',
  0xb24d: 'blake2s-104',
  0xb24e: 'blake2s-112',
  0xb24f: 'blake2s-120',
  0xb250: 'blake2s-128',
  0xb251: 'blake2s-136',
  0xb252: 'blake2s-144',
  0xb253: 'blake2s-152',
  0xb254: 'blake2s-160',
  0xb255: 'blake2s-168',
  0xb256: 'blake2s-176',
  0xb257: 'blake2s-184',
  0xb258: 'blake2s-192',
  0xb259: 'blake2s-200',
  0xb25a: 'blake2s-208',
  0xb25b: 'blake2s-216',
  0xb25c: 'blake2s-224',
  0xb25d: 'blake2s-232',
  0xb25e: 'blake2s-240',
  0xb25f: 'blake2s-248',
  0xb260: 'blake2s-256',
  // skein
  0xb301: 'Skein256-8',
  0xb302: 'Skein256-16',
  0xb303: 'Skein256-24',
  0xb304: 'Skein256-32',
  0xb305: 'Skein256-40',
  0xb306: 'Skein256-48',
  0xb307: 'Skein256-56',
  0xb308: 'Skein256-64',
  0xb309: 'Skein256-72',
  0xb30a: 'Skein256-80',
  0xb30b: 'Skein256-88',
  0xb30c: 'Skein256-96',
  0xb30d: 'Skein256-104',
  0xb30e: 'Skein256-112',
  0xb30f: 'Skein256-120',
  0xb310: 'Skein256-128',
  0xb311: 'Skein256-136',
  0xb312: 'Skein256-144',
  0xb313: 'Skein256-152',
  0xb314: 'Skein256-160',
  0xb315: 'Skein256-168',
  0xb316: 'Skein256-176',
  0xb317: 'Skein256-184',
  0xb318: 'Skein256-192',
  0xb319: 'Skein256-200',
  0xb31a: 'Skein256-208',
  0xb31b: 'Skein256-216',
  0xb31c: 'Skein256-224',
  0xb31d: 'Skein256-232',
  0xb31e: 'Skein256-240',
  0xb31f: 'Skein256-248',
  0xb320: 'Skein256-256',
  0xb321: 'Skein512-8',
  0xb322: 'Skein512-16',
  0xb323: 'Skein512-24',
  0xb324: 'Skein512-32',
  0xb325: 'Skein512-40',
  0xb326: 'Skein512-48',
  0xb327: 'Skein512-56',
  0xb328: 'Skein512-64',
  0xb329: 'Skein512-72',
  0xb32a: 'Skein512-80',
  0xb32b: 'Skein512-88',
  0xb32c: 'Skein512-96',
  0xb32d: 'Skein512-104',
  0xb32e: 'Skein512-112',
  0xb32f: 'Skein512-120',
  0xb330: 'Skein512-128',
  0xb331: 'Skein512-136',
  0xb332: 'Skein512-144',
  0xb333: 'Skein512-152',
  0xb334: 'Skein512-160',
  0xb335: 'Skein512-168',
  0xb336: 'Skein512-176',
  0xb337: 'Skein512-184',
  0xb338: 'Skein512-192',
  0xb339: 'Skein512-200',
  0xb33a: 'Skein512-208',
  0xb33b: 'Skein512-216',
  0xb33c: 'Skein512-224',
  0xb33d: 'Skein512-232',
  0xb33e: 'Skein512-240',
  0xb33f: 'Skein512-248',
  0xb340: 'Skein512-256',
  0xb341: 'Skein512-264',
  0xb342: 'Skein512-272',
  0xb343: 'Skein512-280',
  0xb344: 'Skein512-288',
  0xb345: 'Skein512-296',
  0xb346: 'Skein512-304',
  0xb347: 'Skein512-312',
  0xb348: 'Skein512-320',
  0xb349: 'Skein512-328',
  0xb34a: 'Skein512-336',
  0xb34b: 'Skein512-344',
  0xb34c: 'Skein512-352',
  0xb34d: 'Skein512-360',
  0xb34e: 'Skein512-368',
  0xb34f: 'Skein512-376',
  0xb350: 'Skein512-384',
  0xb351: 'Skein512-392',
  0xb352: 'Skein512-400',
  0xb353: 'Skein512-408',
  0xb354: 'Skein512-416',
  0xb355: 'Skein512-424',
  0xb356: 'Skein512-432',
  0xb357: 'Skein512-440',
  0xb358: 'Skein512-448',
  0xb359: 'Skein512-456',
  0xb35a: 'Skein512-464',
  0xb35b: 'Skein512-472',
  0xb35c: 'Skein512-480',
  0xb35d: 'Skein512-488',
  0xb35e: 'Skein512-496',
  0xb35f: 'Skein512-504',
  0xb360: 'Skein512-512',
  0xb361: 'Skein1024-8',
  0xb362: 'Skein1024-16',
  0xb363: 'Skein1024-24',
  0xb364: 'Skein1024-32',
  0xb365: 'Skein1024-40',
  0xb366: 'Skein1024-48',
  0xb367: 'Skein1024-56',
  0xb368: 'Skein1024-64',
  0xb369: 'Skein1024-72',
  0xb36a: 'Skein1024-80',
  0xb36b: 'Skein1024-88',
  0xb36c: 'Skein1024-96',
  0xb36d: 'Skein1024-104',
  0xb36e: 'Skein1024-112',
  0xb36f: 'Skein1024-120',
  0xb370: 'Skein1024-128',
  0xb371: 'Skein1024-136',
  0xb372: 'Skein1024-144',
  0xb373: 'Skein1024-152',
  0xb374: 'Skein1024-160',
  0xb375: 'Skein1024-168',
  0xb376: 'Skein1024-176',
  0xb377: 'Skein1024-184',
  0xb378: 'Skein1024-192',
  0xb379: 'Skein1024-200',
  0xb37a: 'Skein1024-208',
  0xb37b: 'Skein1024-216',
  0xb37c: 'Skein1024-224',
  0xb37d: 'Skein1024-232',
  0xb37e: 'Skein1024-240',
  0xb37f: 'Skein1024-248',
  0xb380: 'Skein1024-256',
  0xb381: 'Skein1024-264',
  0xb382: 'Skein1024-272',
  0xb383: 'Skein1024-280',
  0xb384: 'Skein1024-288',
  0xb385: 'Skein1024-296',
  0xb386: 'Skein1024-304',
  0xb387: 'Skein1024-312',
  0xb388: 'Skein1024-320',
  0xb389: 'Skein1024-328',
  0xb38a: 'Skein1024-336',
  0xb38b: 'Skein1024-344',
  0xb38c: 'Skein1024-352',
  0xb38d: 'Skein1024-360',
  0xb38e: 'Skein1024-368',
  0xb38f: 'Skein1024-376',
  0xb390: 'Skein1024-384',
  0xb391: 'Skein1024-392',
  0xb392: 'Skein1024-400',
  0xb393: 'Skein1024-408',
  0xb394: 'Skein1024-416',
  0xb395: 'Skein1024-424',
  0xb396: 'Skein1024-432',
  0xb397: 'Skein1024-440',
  0xb398: 'Skein1024-448',
  0xb399: 'Skein1024-456',
  0xb39a: 'Skein1024-464',
  0xb39b: 'Skein1024-472',
  0xb39c: 'Skein1024-480',
  0xb39d: 'Skein1024-488',
  0xb39e: 'Skein1024-496',
  0xb39f: 'Skein1024-504',
  0xb3a0: 'Skein1024-512',
  0xb3a1: 'Skein1024-520',
  0xb3a2: 'Skein1024-528',
  0xb3a3: 'Skein1024-536',
  0xb3a4: 'Skein1024-544',
  0xb3a5: 'Skein1024-552',
  0xb3a6: 'Skein1024-560',
  0xb3a7: 'Skein1024-568',
  0xb3a8: 'Skein1024-576',
  0xb3a9: 'Skein1024-584',
  0xb3aa: 'Skein1024-592',
  0xb3ab: 'Skein1024-600',
  0xb3ac: 'Skein1024-608',
  0xb3ad: 'Skein1024-616',
  0xb3ae: 'Skein1024-624',
  0xb3af: 'Skein1024-632',
  0xb3b0: 'Skein1024-640',
  0xb3b1: 'Skein1024-648',
  0xb3b2: 'Skein1024-656',
  0xb3b3: 'Skein1024-664',
  0xb3b4: 'Skein1024-672',
  0xb3b5: 'Skein1024-680',
  0xb3b6: 'Skein1024-688',
  0xb3b7: 'Skein1024-696',
  0xb3b8: 'Skein1024-704',
  0xb3b9: 'Skein1024-712',
  0xb3ba: 'Skein1024-720',
  0xb3bb: 'Skein1024-728',
  0xb3bc: 'Skein1024-736',
  0xb3bd: 'Skein1024-744',
  0xb3be: 'Skein1024-752',
  0xb3bf: 'Skein1024-760',
  0xb3c0: 'Skein1024-768',
  0xb3c1: 'Skein1024-776',
  0xb3c2: 'Skein1024-784',
  0xb3c3: 'Skein1024-792',
  0xb3c4: 'Skein1024-800',
  0xb3c5: 'Skein1024-808',
  0xb3c6: 'Skein1024-816',
  0xb3c7: 'Skein1024-824',
  0xb3c8: 'Skein1024-832',
  0xb3c9: 'Skein1024-840',
  0xb3ca: 'Skein1024-848',
  0xb3cb: 'Skein1024-856',
  0xb3cc: 'Skein1024-864',
  0xb3cd: 'Skein1024-872',
  0xb3ce: 'Skein1024-880',
  0xb3cf: 'Skein1024-888',
  0xb3d0: 'Skein1024-896',
  0xb3d1: 'Skein1024-904',
  0xb3d2: 'Skein1024-912',
  0xb3d3: 'Skein1024-920',
  0xb3d4: 'Skein1024-928',
  0xb3d5: 'Skein1024-936',
  0xb3d6: 'Skein1024-944',
  0xb3d7: 'Skein1024-952',
  0xb3d8: 'Skein1024-960',
  0xb3d9: 'Skein1024-968',
  0xb3da: 'Skein1024-976',
  0xb3db: 'Skein1024-984',
  0xb3dc: 'Skein1024-992',
  0xb3dd: 'Skein1024-1000',
  0xb3de: 'Skein1024-1008',
  0xb3df: 'Skein1024-1016',
  0xb3e0: 'Skein1024-1024'
});
exports.defaultLengths = Object.freeze({
  0x11: 20,
  0x12: 32,
  0x13: 64,
  0x56: 32,
  0x17: 28,
  0x16: 32,
  0x15: 48,
  0x14: 64,
  0x18: 32,
  0x19: 64,
  0x1A: 28,
  0x1B: 32,
  0x1C: 48,
  0x1D: 64,
  0x22: 32,
  0xb201: 0x01,
  0xb202: 0x02,
  0xb203: 0x03,
  0xb204: 0x04,
  0xb205: 0x05,
  0xb206: 0x06,
  0xb207: 0x07,
  0xb208: 0x08,
  0xb209: 0x09,
  0xb20a: 0x0a,
  0xb20b: 0x0b,
  0xb20c: 0x0c,
  0xb20d: 0x0d,
  0xb20e: 0x0e,
  0xb20f: 0x0f,
  0xb210: 0x10,
  0xb211: 0x11,
  0xb212: 0x12,
  0xb213: 0x13,
  0xb214: 0x14,
  0xb215: 0x15,
  0xb216: 0x16,
  0xb217: 0x17,
  0xb218: 0x18,
  0xb219: 0x19,
  0xb21a: 0x1a,
  0xb21b: 0x1b,
  0xb21c: 0x1c,
  0xb21d: 0x1d,
  0xb21e: 0x1e,
  0xb21f: 0x1f,
  0xb220: 0x20,
  0xb221: 0x21,
  0xb222: 0x22,
  0xb223: 0x23,
  0xb224: 0x24,
  0xb225: 0x25,
  0xb226: 0x26,
  0xb227: 0x27,
  0xb228: 0x28,
  0xb229: 0x29,
  0xb22a: 0x2a,
  0xb22b: 0x2b,
  0xb22c: 0x2c,
  0xb22d: 0x2d,
  0xb22e: 0x2e,
  0xb22f: 0x2f,
  0xb230: 0x30,
  0xb231: 0x31,
  0xb232: 0x32,
  0xb233: 0x33,
  0xb234: 0x34,
  0xb235: 0x35,
  0xb236: 0x36,
  0xb237: 0x37,
  0xb238: 0x38,
  0xb239: 0x39,
  0xb23a: 0x3a,
  0xb23b: 0x3b,
  0xb23c: 0x3c,
  0xb23d: 0x3d,
  0xb23e: 0x3e,
  0xb23f: 0x3f,
  0xb240: 0x40,
  0xb241: 0x01,
  0xb242: 0x02,
  0xb243: 0x03,
  0xb244: 0x04,
  0xb245: 0x05,
  0xb246: 0x06,
  0xb247: 0x07,
  0xb248: 0x08,
  0xb249: 0x09,
  0xb24a: 0x0a,
  0xb24b: 0x0b,
  0xb24c: 0x0c,
  0xb24d: 0x0d,
  0xb24e: 0x0e,
  0xb24f: 0x0f,
  0xb250: 0x10,
  0xb251: 0x11,
  0xb252: 0x12,
  0xb253: 0x13,
  0xb254: 0x14,
  0xb255: 0x15,
  0xb256: 0x16,
  0xb257: 0x17,
  0xb258: 0x18,
  0xb259: 0x19,
  0xb25a: 0x1a,
  0xb25b: 0x1b,
  0xb25c: 0x1c,
  0xb25d: 0x1d,
  0xb25e: 0x1e,
  0xb25f: 0x1f,
  0xb260: 0x20,
  0xb301: 0x01,
  0xb302: 0x02,
  0xb303: 0x03,
  0xb304: 0x04,
  0xb305: 0x05,
  0xb306: 0x06,
  0xb307: 0x07,
  0xb308: 0x08,
  0xb309: 0x09,
  0xb30a: 0x0a,
  0xb30b: 0x0b,
  0xb30c: 0x0c,
  0xb30d: 0x0d,
  0xb30e: 0x0e,
  0xb30f: 0x0f,
  0xb310: 0x10,
  0xb311: 0x11,
  0xb312: 0x12,
  0xb313: 0x13,
  0xb314: 0x14,
  0xb315: 0x15,
  0xb316: 0x16,
  0xb317: 0x17,
  0xb318: 0x18,
  0xb319: 0x19,
  0xb31a: 0x1a,
  0xb31b: 0x1b,
  0xb31c: 0x1c,
  0xb31d: 0x1d,
  0xb31e: 0x1e,
  0xb31f: 0x1f,
  0xb320: 0x20,
  0xb321: 0x01,
  0xb322: 0x02,
  0xb323: 0x03,
  0xb324: 0x04,
  0xb325: 0x05,
  0xb326: 0x06,
  0xb327: 0x07,
  0xb328: 0x08,
  0xb329: 0x09,
  0xb32a: 0x0a,
  0xb32b: 0x0b,
  0xb32c: 0x0c,
  0xb32d: 0x0d,
  0xb32e: 0x0e,
  0xb32f: 0x0f,
  0xb330: 0x10,
  0xb331: 0x11,
  0xb332: 0x12,
  0xb333: 0x13,
  0xb334: 0x14,
  0xb335: 0x15,
  0xb336: 0x16,
  0xb337: 0x17,
  0xb338: 0x18,
  0xb339: 0x19,
  0xb33a: 0x1a,
  0xb33b: 0x1b,
  0xb33c: 0x1c,
  0xb33d: 0x1d,
  0xb33e: 0x1e,
  0xb33f: 0x1f,
  0xb340: 0x20,
  0xb341: 0x21,
  0xb342: 0x22,
  0xb343: 0x23,
  0xb344: 0x24,
  0xb345: 0x25,
  0xb346: 0x26,
  0xb347: 0x27,
  0xb348: 0x28,
  0xb349: 0x29,
  0xb34a: 0x2a,
  0xb34b: 0x2b,
  0xb34c: 0x2c,
  0xb34d: 0x2d,
  0xb34e: 0x2e,
  0xb34f: 0x2f,
  0xb350: 0x30,
  0xb351: 0x31,
  0xb352: 0x32,
  0xb353: 0x33,
  0xb354: 0x34,
  0xb355: 0x35,
  0xb356: 0x36,
  0xb357: 0x37,
  0xb358: 0x38,
  0xb359: 0x39,
  0xb35a: 0x3a,
  0xb35b: 0x3b,
  0xb35c: 0x3c,
  0xb35d: 0x3d,
  0xb35e: 0x3e,
  0xb35f: 0x3f,
  0xb360: 0x40,
  0xb361: 0x01,
  0xb362: 0x02,
  0xb363: 0x03,
  0xb364: 0x04,
  0xb365: 0x05,
  0xb366: 0x06,
  0xb367: 0x07,
  0xb368: 0x08,
  0xb369: 0x09,
  0xb36a: 0x0a,
  0xb36b: 0x0b,
  0xb36c: 0x0c,
  0xb36d: 0x0d,
  0xb36e: 0x0e,
  0xb36f: 0x0f,
  0xb370: 0x10,
  0xb371: 0x11,
  0xb372: 0x12,
  0xb373: 0x13,
  0xb374: 0x14,
  0xb375: 0x15,
  0xb376: 0x16,
  0xb377: 0x17,
  0xb378: 0x18,
  0xb379: 0x19,
  0xb37a: 0x1a,
  0xb37b: 0x1b,
  0xb37c: 0x1c,
  0xb37d: 0x1d,
  0xb37e: 0x1e,
  0xb37f: 0x1f,
  0xb380: 0x20,
  0xb381: 0x21,
  0xb382: 0x22,
  0xb383: 0x23,
  0xb384: 0x24,
  0xb385: 0x25,
  0xb386: 0x26,
  0xb387: 0x27,
  0xb388: 0x28,
  0xb389: 0x29,
  0xb38a: 0x2a,
  0xb38b: 0x2b,
  0xb38c: 0x2c,
  0xb38d: 0x2d,
  0xb38e: 0x2e,
  0xb38f: 0x2f,
  0xb390: 0x30,
  0xb391: 0x31,
  0xb392: 0x32,
  0xb393: 0x33,
  0xb394: 0x34,
  0xb395: 0x35,
  0xb396: 0x36,
  0xb397: 0x37,
  0xb398: 0x38,
  0xb399: 0x39,
  0xb39a: 0x3a,
  0xb39b: 0x3b,
  0xb39c: 0x3c,
  0xb39d: 0x3d,
  0xb39e: 0x3e,
  0xb39f: 0x3f,
  0xb3a0: 0x40,
  0xb3a1: 0x41,
  0xb3a2: 0x42,
  0xb3a3: 0x43,
  0xb3a4: 0x44,
  0xb3a5: 0x45,
  0xb3a6: 0x46,
  0xb3a7: 0x47,
  0xb3a8: 0x48,
  0xb3a9: 0x49,
  0xb3aa: 0x4a,
  0xb3ab: 0x4b,
  0xb3ac: 0x4c,
  0xb3ad: 0x4d,
  0xb3ae: 0x4e,
  0xb3af: 0x4f,
  0xb3b0: 0x50,
  0xb3b1: 0x51,
  0xb3b2: 0x52,
  0xb3b3: 0x53,
  0xb3b4: 0x54,
  0xb3b5: 0x55,
  0xb3b6: 0x56,
  0xb3b7: 0x57,
  0xb3b8: 0x58,
  0xb3b9: 0x59,
  0xb3ba: 0x5a,
  0xb3bb: 0x5b,
  0xb3bc: 0x5c,
  0xb3bd: 0x5d,
  0xb3be: 0x5e,
  0xb3bf: 0x5f,
  0xb3c0: 0x60,
  0xb3c1: 0x61,
  0xb3c2: 0x62,
  0xb3c3: 0x63,
  0xb3c4: 0x64,
  0xb3c5: 0x65,
  0xb3c6: 0x66,
  0xb3c7: 0x67,
  0xb3c8: 0x68,
  0xb3c9: 0x69,
  0xb3ca: 0x6a,
  0xb3cb: 0x6b,
  0xb3cc: 0x6c,
  0xb3cd: 0x6d,
  0xb3ce: 0x6e,
  0xb3cf: 0x6f,
  0xb3d0: 0x70,
  0xb3d1: 0x71,
  0xb3d2: 0x72,
  0xb3d3: 0x73,
  0xb3d4: 0x74,
  0xb3d5: 0x75,
  0xb3d6: 0x76,
  0xb3d7: 0x77,
  0xb3d8: 0x78,
  0xb3d9: 0x79,
  0xb3da: 0x7a,
  0xb3db: 0x7b,
  0xb3dc: 0x7c,
  0xb3dd: 0x7d,
  0xb3de: 0x7e,
  0xb3df: 0x7f,
  0xb3e0: 0x80
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = encode;
var MSB = 0x80,
    REST = 0x7F,
    MSBALL = ~REST,
    INT = Math.pow(2, 31);

function encode(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;

  while (num >= INT) {
    out[offset++] = num & 0xFF | MSB;
    num /= 128;
  }

  while (num & MSBALL) {
    out[offset++] = num & 0xFF | MSB;
    num >>>= 7;
  }

  out[offset] = num | 0;
  encode.bytes = offset - oldOffset + 1;
  return out;
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = read;
var MSB = 0x80,
    REST = 0x7F;

function read(buf, offset) {
  var res = 0,
      offset = offset || 0,
      shift = 0,
      counter = offset,
      b,
      l = buf.length;

  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError('Could not decode varint');
    }

    b = buf[counter++];
    res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB);

  read.bytes = counter - offset;
  return res;
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);

module.exports = function (value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** PROMISIFY CALLBACK-STYLE FUNCTIONS TO ES6 PROMISES
*
* EXAMPLE:
* const fn = promisify( (callback) => callback(null, "Hello world!") );
* fn((err, str) => console.log(str));
* fn().then((str) => console.log(str));
* //Both functions, will log 'Hello world!'
*
* Note: The function you pass, may have any arguments you want, but the latest
* have to be the callback, which you will call with: next(err, value)
*
* @param method: Function/Array/Map = The function(s) to promisify
* @param options: Map =
*  "context" (default is function): The context which to apply the called function
*  "replace" (default is falsy): When passed an array/map, if to replace the original object
*
* @return: A promise if passed a function, otherwise the object with the promises
*
* @license: MIT
* @version: 1.0.3
* @author: Manuel Di Iorio
**/
var createCallback = function createCallback(method, context) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var lastIndex = args.length - 1;
    var lastArg = args && args.length > 0 ? args[lastIndex] : null;
    var cb = typeof lastArg === 'function' ? lastArg : null;

    if (cb) {
      return method.apply(context, args);
    }

    return new Promise(function (resolve, reject) {
      args.push(function (err, val) {
        if (err) return reject(err);
        resolve(val);
      });
      method.apply(context, args);
    });
  };
};

if (false) {} // Browserify this module

module.exports = function (methods, options) {
  options = options || {};
  var type = Object.prototype.toString.call(methods);

  if (type === "[object Object]" || type === "[object Array]") {
    var obj = options.replace ? methods : {};

    for (var key in methods) {
      if (methods.hasOwnProperty(key)) obj[key] = createCallback(methods[key]);
    }

    return obj;
  }

  return createCallback(methods, options.context || methods);
}; // Browserify this module


if (false) {}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mh = __webpack_require__(12);

var multibase = __webpack_require__(68);

var multicodec = __webpack_require__(74);

var codecs = __webpack_require__(14);

var CIDUtil = __webpack_require__(79);

var withIs = __webpack_require__(80);
/**
 * @typedef {Object} SerializedCID
 * @param {string} codec
 * @param {number} version
 * @param {Buffer} multihash
 */

/**
 * Test if the given input is a CID.
 * @function isCID
 * @memberof CID
 * @static
 * @param {any} other
 * @returns {bool}
 */

/**
 * Class representing a CID `<mbase><version><mcodec><mhash>`
 * , as defined in [ipld/cid](https://github.com/multiformats/cid).
 * @class CID
 */


var CID =
/*#__PURE__*/
function () {
  /**
   * Create a new CID.
   *
   * The algorithm for argument input is roughly:
   * ```
   * if (cid)
   *   -> create a copy
   * else if (str)
   *   if (1st char is on multibase table) -> CID String
   *   else -> bs58 encoded multihash
   * else if (Buffer)
   *   if (1st byte is 0 or 1) -> CID
   *   else -> multihash
   * else if (Number)
   *   -> construct CID by parts
   * ```
   *
   * @param {string|Buffer|CID} version
   * @param {string} [codec]
   * @param {Buffer} [multihash]
   * @param {string} [multibaseName]
   *
   * @example
   * new CID(<version>, <codec>, <multihash>, <multibaseName>)
   * new CID(<cidStr>)
   * new CID(<cid.buffer>)
   * new CID(<multihash>)
   * new CID(<bs58 encoded multihash>)
   * new CID(<cid>)
   */
  function CID(version, codec, multihash, multibaseName) {
    _classCallCheck(this, CID);

    if (_CID.isCID(version)) {
      // version is an exising CID instance
      var cid = version;
      this.version = cid.version;
      this.codec = cid.codec;
      this.multihash = Buffer.from(cid.multihash); // Default guard for when a CID < 0.7 is passed with no multibaseName

      this.multibaseName = cid.multibaseName || (cid.version === 0 ? 'base58btc' : 'base32');
      return;
    }

    if (typeof version === 'string') {
      // e.g. 'base32' or false
      var baseName = multibase.isEncoded(version);

      if (baseName) {
        // version is a CID String encoded with multibase, so v1
        var _cid = multibase.decode(version);

        this.version = parseInt(_cid.slice(0, 1).toString('hex'), 16);
        this.codec = multicodec.getCodec(_cid.slice(1));
        this.multihash = multicodec.rmPrefix(_cid.slice(1));
        this.multibaseName = baseName;
      } else {
        // version is a base58btc string multihash, so v0
        this.version = 0;
        this.codec = 'dag-pb';
        this.multihash = mh.fromB58String(version);
        this.multibaseName = 'base58btc';
      }

      CID.validateCID(this);
      Object.defineProperty(this, 'string', {
        value: version
      });
      return;
    }

    if (Buffer.isBuffer(version)) {
      var firstByte = version.slice(0, 1);
      var v = parseInt(firstByte.toString('hex'), 16);

      if (v === 1) {
        // version is a CID buffer
        var _cid2 = version;
        this.version = v;
        this.codec = multicodec.getCodec(_cid2.slice(1));
        this.multihash = multicodec.rmPrefix(_cid2.slice(1));
        this.multibaseName = 'base32';
      } else {
        // version is a raw multihash buffer, so v0
        this.version = 0;
        this.codec = 'dag-pb';
        this.multihash = version;
        this.multibaseName = 'base58btc';
      }

      CID.validateCID(this);
      return;
    } // otherwise, assemble the CID from the parameters

    /**
     * @type {number}
     */


    this.version = version;
    /**
     * @type {string}
     */

    this.codec = codec;
    /**
     * @type {Buffer}
     */

    this.multihash = multihash;
    /**
     * @type {string}
     */

    this.multibaseName = multibaseName || (version === 0 ? 'base58btc' : 'base32');
    CID.validateCID(this);
  }
  /**
   * The CID as a `Buffer`
   *
   * @return {Buffer}
   * @readonly
   *
   * @memberOf CID
   */


  _createClass(CID, [{
    key: "toV0",

    /**
     * Convert to a CID of version `0`.
     *
     * @returns {CID}
     */
    value: function toV0() {
      if (this.codec !== 'dag-pb') {
        throw new Error('Cannot convert a non dag-pb CID to CIDv0');
      }

      var _mh$decode = mh.decode(this.multihash),
          name = _mh$decode.name,
          length = _mh$decode.length;

      if (name !== 'sha2-256') {
        throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
      }

      if (length !== 32) {
        throw new Error('Cannot convert non 32 byte multihash CID to CIDv0');
      }

      return new _CID(0, this.codec, this.multihash);
    }
    /**
     * Convert to a CID of version `1`.
     *
     * @returns {CID}
     */

  }, {
    key: "toV1",
    value: function toV1() {
      return new _CID(1, this.codec, this.multihash);
    }
    /**
     * Encode the CID into a string.
     *
     * @param {string} [base=this.multibaseName] - Base encoding to use.
     * @returns {string}
     */

  }, {
    key: "toBaseEncodedString",
    value: function toBaseEncodedString() {
      var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.multibaseName;

      if (this.string && base === this.multibaseName) {
        return this.string;
      }

      var str = null;

      if (this.version === 0) {
        if (base !== 'base58btc') {
          throw new Error('not supported with CIDv0, to support different bases, please migrate the instance do CIDv1, you can do that through cid.toV1()');
        }

        str = mh.toB58String(this.multihash);
      } else if (this.version === 1) {
        str = multibase.encode(base, this.buffer).toString();
      } else {
        throw new Error('unsupported version');
      }

      if (base === this.multibaseName) {
        // cache the string value
        Object.defineProperty(this, 'string', {
          value: str
        });
      }

      return str;
    }
  }, {
    key: "toString",
    value: function toString(base) {
      return this.toBaseEncodedString(base);
    }
    /**
     * Serialize to a plain object.
     *
     * @returns {SerializedCID}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        codec: this.codec,
        version: this.version,
        hash: this.multihash
      };
    }
    /**
     * Compare equality with another CID.
     *
     * @param {CID} other
     * @returns {bool}
     */

  }, {
    key: "equals",
    value: function equals(other) {
      return this.codec === other.codec && this.version === other.version && this.multihash.equals(other.multihash);
    }
    /**
     * Test if the given input is a valid CID object.
     * Throws if it is not.
     *
     * @param {any} other
     * @returns {void}
     */

  }, {
    key: "buffer",
    get: function get() {
      var buffer = this._buffer;

      if (!buffer) {
        if (this.version === 0) {
          buffer = this.multihash;
        } else if (this.version === 1) {
          buffer = Buffer.concat([Buffer.from('01', 'hex'), multicodec.getCodeVarint(this.codec), this.multihash]);
        } else {
          throw new Error('unsupported version');
        } // Cache this buffer so it doesn't have to be recreated


        Object.defineProperty(this, '_buffer', {
          value: buffer
        });
      }

      return buffer;
    }
    /**
     * Get the prefix of the CID.
     *
     * @returns {Buffer}
     * @readonly
     */

  }, {
    key: "prefix",
    get: function get() {
      return Buffer.concat([Buffer.from("0".concat(this.version), 'hex'), multicodec.getCodeVarint(this.codec), mh.prefix(this.multihash)]);
    }
  }], [{
    key: "validateCID",
    value: function validateCID(other) {
      var errorMsg = CIDUtil.checkCIDComponents(other);

      if (errorMsg) {
        throw new Error(errorMsg);
      }
    }
  }]);

  return CID;
}();

var _CID = withIs(CID, {
  className: 'CID',
  symbolName: '@ipld/js-cid/CID'
});

_CID.codecs = codecs;
module.exports = _CID;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Implementation of the [multibase](https://github.com/multiformats/multibase) specification.
 * @module Multibase
 */


var constants = __webpack_require__(69);

exports = module.exports = multibase;
exports.encode = encode;
exports.decode = decode;
exports.isEncoded = isEncoded;
exports.names = Object.freeze(Object.keys(constants.names));
exports.codes = Object.freeze(Object.keys(constants.codes));
var errNotSupported = new Error('Unsupported encoding');
/**
 * Create a new buffer with the multibase varint+code.
 *
 * @param {string|number} nameOrCode - The multibase name or code number.
 * @param {Buffer} buf - The data to be prefixed with multibase.
 * @memberof Multibase
 * @returns {Buffer}
 */

function multibase(nameOrCode, buf) {
  if (!buf) {
    throw new Error('requires an encoded buffer');
  }

  var base = getBase(nameOrCode);
  var codeBuf = Buffer.from(base.code);
  var name = base.name;
  validEncode(name, buf);
  return Buffer.concat([codeBuf, buf]);
}
/**
 * Encode data with the specified base and add the multibase prefix.
 *
 * @param {string|number} nameOrCode - The multibase name or code number.
 * @param {Buffer} buf - The data to be encoded.
 * @returns {Buffer}
 * @memberof Multibase
 */


function encode(nameOrCode, buf) {
  var base = getBase(nameOrCode);
  var name = base.name;
  return multibase(name, Buffer.from(base.encode(buf)));
}
/**
 * Takes a buffer or string encoded with multibase header, decodes it and
 * returns the decoded buffer
 *
 * @param {Buffer|string} bufOrString
 * @returns {Buffer}
 * @memberof Multibase
 *
 */


function decode(bufOrString) {
  if (Buffer.isBuffer(bufOrString)) {
    bufOrString = bufOrString.toString();
  }

  var code = bufOrString.substring(0, 1);
  bufOrString = bufOrString.substring(1, bufOrString.length);

  if (typeof bufOrString === 'string') {
    bufOrString = Buffer.from(bufOrString);
  }

  var base = getBase(code);
  return Buffer.from(base.decode(bufOrString.toString()));
}
/**
 * Is the given data multibase encoded?
 *
 * @param {Buffer|string} bufOrString
 * @returns {boolean}
 * @memberof Multibase
 */


function isEncoded(bufOrString) {
  if (Buffer.isBuffer(bufOrString)) {
    bufOrString = bufOrString.toString();
  } // Ensure bufOrString is a string


  if (Object.prototype.toString.call(bufOrString) !== '[object String]') {
    return false;
  }

  var code = bufOrString.substring(0, 1);

  try {
    var base = getBase(code);
    return base.name;
  } catch (err) {
    return false;
  }
}
/**
 * @param {string} name
 * @param {Buffer} buf
 * @private
 * @returns {undefined}
 */


function validEncode(name, buf) {
  var base = getBase(name);
  base.decode(buf.toString());
}

function getBase(nameOrCode) {
  var base;

  if (constants.names[nameOrCode]) {
    base = constants.names[nameOrCode];
  } else if (constants.codes[nameOrCode]) {
    base = constants.codes[nameOrCode];
  } else {
    throw errNotSupported;
  }

  if (!base.isImplemented()) {
    throw new Error('Base ' + nameOrCode + ' is not implemented yet');
  }

  return base;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Base = __webpack_require__(70);

var baseX = __webpack_require__(27);

var base16 = __webpack_require__(71);

var base32 = __webpack_require__(72);

var base64 = __webpack_require__(73); // name, code, implementation, alphabet


var constants = [['base1', '1', '', '1'], ['base2', '0', baseX, '01'], ['base8', '7', baseX, '01234567'], ['base10', '9', baseX, '0123456789'], ['base16', 'f', base16, '0123456789abcdef'], ['base32', 'b', base32, 'abcdefghijklmnopqrstuvwxyz234567'], ['base32pad', 'c', base32, 'abcdefghijklmnopqrstuvwxyz234567='], ['base32hex', 'v', base32, '0123456789abcdefghijklmnopqrstuv'], ['base32hexpad', 't', base32, '0123456789abcdefghijklmnopqrstuv='], ['base32z', 'h', base32, 'ybndrfg8ejkmcpqxot1uwisza345h769'], ['base58flickr', 'Z', baseX, '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'], ['base58btc', 'z', baseX, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'], ['base64', 'm', base64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'], ['base64pad', 'M', base64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='], ['base64url', 'u', base64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'], ['base64urlpad', 'U', base64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=']];
var names = constants.reduce(function (prev, tupple) {
  prev[tupple[0]] = new Base(tupple[0], tupple[1], tupple[2], tupple[3]);
  return prev;
}, {});
var codes = constants.reduce(function (prev, tupple) {
  prev[tupple[1]] = names[tupple[0]];
  return prev;
}, {});
module.exports = {
  names: names,
  codes: codes
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Base =
/*#__PURE__*/
function () {
  function Base(name, code, implementation, alphabet) {
    _classCallCheck(this, Base);

    this.name = name;
    this.code = code;
    this.alphabet = alphabet;

    if (implementation && alphabet) {
      this.engine = implementation(alphabet);
    }
  }

  _createClass(Base, [{
    key: "encode",
    value: function encode(stringOrBuffer) {
      return this.engine.encode(stringOrBuffer);
    }
  }, {
    key: "decode",
    value: function decode(stringOrBuffer) {
      return this.engine.decode(stringOrBuffer);
    }
  }, {
    key: "isImplemented",
    value: function isImplemented() {
      return this.engine;
    }
  }]);

  return Base;
}();

module.exports = Base;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

module.exports = function base16(alphabet) {
  return {
    encode: function encode(input) {
      if (typeof input === 'string') {
        return Buffer.from(input).toString('hex');
      }

      return input.toString('hex');
    },
    decode: function decode(input) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _char = _step.value;

          if (alphabet.indexOf(_char) < 0) {
            throw new Error('invalid base16 character');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Buffer.from(input, 'hex');
    }
  };
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

function _decode(input, alphabet) {
  input = input.replace(new RegExp('=', 'g'), '');
  var length = input.length;
  var bits = 0;
  var value = 0;
  var index = 0;
  var output = new Uint8Array(length * 5 / 8 | 0);

  for (var i = 0; i < length; i++) {
    value = value << 5 | alphabet.indexOf(input[i]);
    bits += 5;

    if (bits >= 8) {
      output[index++] = value >>> bits - 8 & 255;
      bits -= 8;
    }
  }

  return output.buffer;
}

function _encode(buffer, alphabet) {
  var length = buffer.byteLength;
  var view = new Uint8Array(buffer);
  var padding = alphabet.indexOf('=') === alphabet.length - 1;

  if (padding) {
    alphabet = alphabet.substring(0, alphabet.length - 2);
  }

  var bits = 0;
  var value = 0;
  var output = '';

  for (var i = 0; i < length; i++) {
    value = value << 8 | view[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[value >>> bits - 5 & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[value << 5 - bits & 31];
  }

  if (padding) {
    while (output.length % 8 !== 0) {
      output += '=';
    }
  }

  return output;
}

module.exports = function base32(alphabet) {
  return {
    encode: function encode(input) {
      if (typeof input === 'string') {
        return _encode(Buffer.from(input), alphabet);
      }

      return _encode(input, alphabet);
    },
    decode: function decode(input) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _char = _step.value;

          if (alphabet.indexOf(_char) < 0) {
            throw new Error('invalid base32 character');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _decode(input, alphabet);
    }
  };
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

module.exports = function base64(alphabet) {
  // The alphabet is only used to know:
  //   1. If padding is enabled (must contain '=')
  //   2. If the output must be url-safe (must contain '-' and '_')
  //   3. If the input of the output function is valid
  // The alphabets from RFC 4648 are always used.
  var padding = alphabet.indexOf('=') > -1;
  var url = alphabet.indexOf('-') > -1 && alphabet.indexOf('_') > -1;
  return {
    encode: function encode(input) {
      var output = '';

      if (typeof input === 'string') {
        output = Buffer.from(input).toString('base64');
      } else {
        output = input.toString('base64');
      }

      if (url) {
        output = output.replace(/\+/g, '-').replace(/\//g, '_');
      }

      var pad = output.indexOf('=');

      if (pad > 0 && !padding) {
        output = output.substring(0, pad);
      }

      return output;
    },
    decode: function decode(input) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _char = _step.value;

          if (alphabet.indexOf(_char) < 0) {
            throw new Error('invalid base64 character');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Buffer.from(input, 'base64');
    }
  };
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Implementation of the multicodec specification.
 *
 * @module multicodec
 * @example
 * const multicodec = require('multicodec')
 *
 * const prefixedProtobuf = multicodec.addPrefix('protobuf', protobufBuffer)
 * // prefixedProtobuf 0x50...
 *
 */


var varint = __webpack_require__(13);

var codecNameToCodeVarint = __webpack_require__(75);

var codeToCodecName = __webpack_require__(76);

var util = __webpack_require__(28);

exports = module.exports;
/**
 * Prefix a buffer with a multicodec-packed.
 *
 * @param {string|number} multicodecStrOrCode
 * @param {Buffer} data
 * @returns {Buffer}
 */

exports.addPrefix = function (multicodecStrOrCode, data) {
  var prefix;

  if (Buffer.isBuffer(multicodecStrOrCode)) {
    prefix = util.varintBufferEncode(multicodecStrOrCode);
  } else {
    if (codecNameToCodeVarint[multicodecStrOrCode]) {
      prefix = codecNameToCodeVarint[multicodecStrOrCode];
    } else {
      throw new Error('multicodec not recognized');
    }
  }

  return Buffer.concat([prefix, data]);
};
/**
 * Decapsulate the multicodec-packed prefix from the data.
 *
 * @param {Buffer} data
 * @returns {Buffer}
 */


exports.rmPrefix = function (data) {
  varint.decode(data);
  return data.slice(varint.decode.bytes);
};
/**
 * Get the codec of the prefixed data.
 * @param {Buffer} prefixedData
 * @returns {string}
 */


exports.getCodec = function (prefixedData) {
  var code = util.varintBufferDecode(prefixedData);
  var codecName = codeToCodecName[code.toString('hex')];

  if (codecName === undefined) {
    throw new Error('Code `0x' + code.toString('hex') + '` not found');
  }

  return codecName;
};
/**
 * Get the name of the codec.
 * @param {number} codec
 * @returns {string}
 */


exports.getName = function (codec) {
  return codeToCodecName[codec.toString(16)];
};
/**
 * Get the code of the codec
 * @param {string} name
 * @returns {number}
 */


exports.getNumber = function (name) {
  var code = codecNameToCodeVarint[name];

  if (code === undefined) {
    throw new Error('Codec `' + name + '` not found');
  }

  return util.varintBufferDecode(code)[0];
};
/**
 * Get the code of the prefixed data.
 * @param {Buffer} prefixedData
 * @returns {number}
 */


exports.getCode = function (prefixedData) {
  return varint.decode(prefixedData);
};
/**
 * Get the code as varint of a codec name.
 * @param {string} codecName
 * @returns {Buffer}
 */


exports.getCodeVarint = function (codecName) {
  var code = codecNameToCodeVarint[codecName];

  if (code === undefined) {
    throw new Error('Codec `' + codecName + '` not found');
  }

  return code;
};
/**
 * Get the varint of a code.
 * @param {Number} code
 * @returns {Array.<number>}
 */


exports.getVarint = function (code) {
  return varint.encode(code);
}; // Make the constants top-level constants


var constants = __webpack_require__(77);

Object.assign(exports, constants); // Human friendly names for printing, e.g. in error messages

exports.print = __webpack_require__(78);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseTable = __webpack_require__(14);

var varintBufferEncode = __webpack_require__(28).varintBufferEncode; // this creates a map for codecName -> codeVarintBuffer


var varintTable = {};
module.exports = varintTable;

for (var encodingName in baseTable) {
  var code = baseTable[encodingName];
  varintTable[encodingName] = varintBufferEncode(code);
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseTable = __webpack_require__(14); // this creates a map for code as hexString -> codecName


var nameTable = {};
module.exports = nameTable;

for (var encodingName in baseTable) {
  var code = baseTable[encodingName];
  nameTable[code.toString('hex')] = encodingName;
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// THIS FILE IS GENERATED, DO NO EDIT MANUALLY
// For more information see the README.md

/* eslint-disable dot-notation */


module.exports = Object.freeze({
  // serialization
  PROTOBUF: 0x50,
  CBOR: 0x51,
  RLP: 0x60,
  BENCODE: 0x63,
  // multiformat
  MULTICODEC: 0x30,
  MULTIHASH: 0x31,
  MULTIADDR: 0x32,
  MULTIBASE: 0x33,
  // multihash
  IDENTITY: 0x00,
  SHA1: 0x11,
  SHA2_256: 0x12,
  SHA2_512: 0x13,
  SHA3_512: 0x14,
  SHA3_384: 0x15,
  SHA3_256: 0x16,
  SHA3_224: 0x17,
  SHAKE_128: 0x18,
  SHAKE_256: 0x19,
  KECCAK_224: 0x1a,
  KECCAK_256: 0x1b,
  KECCAK_384: 0x1c,
  KECCAK_512: 0x1d,
  MURMUR3_128: 0x22,
  MURMUR3_32: 0x23,
  DBL_SHA2_256: 0x56,
  MD4: 0xd4,
  MD5: 0xd5,
  BMT: 0xd6,
  X11: 0x1100,
  BLAKE2B_8: 0xb201,
  BLAKE2B_16: 0xb202,
  BLAKE2B_24: 0xb203,
  BLAKE2B_32: 0xb204,
  BLAKE2B_40: 0xb205,
  BLAKE2B_48: 0xb206,
  BLAKE2B_56: 0xb207,
  BLAKE2B_64: 0xb208,
  BLAKE2B_72: 0xb209,
  BLAKE2B_80: 0xb20a,
  BLAKE2B_88: 0xb20b,
  BLAKE2B_96: 0xb20c,
  BLAKE2B_104: 0xb20d,
  BLAKE2B_112: 0xb20e,
  BLAKE2B_120: 0xb20f,
  BLAKE2B_128: 0xb210,
  BLAKE2B_136: 0xb211,
  BLAKE2B_144: 0xb212,
  BLAKE2B_152: 0xb213,
  BLAKE2B_160: 0xb214,
  BLAKE2B_168: 0xb215,
  BLAKE2B_176: 0xb216,
  BLAKE2B_184: 0xb217,
  BLAKE2B_192: 0xb218,
  BLAKE2B_200: 0xb219,
  BLAKE2B_208: 0xb21a,
  BLAKE2B_216: 0xb21b,
  BLAKE2B_224: 0xb21c,
  BLAKE2B_232: 0xb21d,
  BLAKE2B_240: 0xb21e,
  BLAKE2B_248: 0xb21f,
  BLAKE2B_256: 0xb220,
  BLAKE2B_264: 0xb221,
  BLAKE2B_272: 0xb222,
  BLAKE2B_280: 0xb223,
  BLAKE2B_288: 0xb224,
  BLAKE2B_296: 0xb225,
  BLAKE2B_304: 0xb226,
  BLAKE2B_312: 0xb227,
  BLAKE2B_320: 0xb228,
  BLAKE2B_328: 0xb229,
  BLAKE2B_336: 0xb22a,
  BLAKE2B_344: 0xb22b,
  BLAKE2B_352: 0xb22c,
  BLAKE2B_360: 0xb22d,
  BLAKE2B_368: 0xb22e,
  BLAKE2B_376: 0xb22f,
  BLAKE2B_384: 0xb230,
  BLAKE2B_392: 0xb231,
  BLAKE2B_400: 0xb232,
  BLAKE2B_408: 0xb233,
  BLAKE2B_416: 0xb234,
  BLAKE2B_424: 0xb235,
  BLAKE2B_432: 0xb236,
  BLAKE2B_440: 0xb237,
  BLAKE2B_448: 0xb238,
  BLAKE2B_456: 0xb239,
  BLAKE2B_464: 0xb23a,
  BLAKE2B_472: 0xb23b,
  BLAKE2B_480: 0xb23c,
  BLAKE2B_488: 0xb23d,
  BLAKE2B_496: 0xb23e,
  BLAKE2B_504: 0xb23f,
  BLAKE2B_512: 0xb240,
  BLAKE2S_8: 0xb241,
  BLAKE2S_16: 0xb242,
  BLAKE2S_24: 0xb243,
  BLAKE2S_32: 0xb244,
  BLAKE2S_40: 0xb245,
  BLAKE2S_48: 0xb246,
  BLAKE2S_56: 0xb247,
  BLAKE2S_64: 0xb248,
  BLAKE2S_72: 0xb249,
  BLAKE2S_80: 0xb24a,
  BLAKE2S_88: 0xb24b,
  BLAKE2S_96: 0xb24c,
  BLAKE2S_104: 0xb24d,
  BLAKE2S_112: 0xb24e,
  BLAKE2S_120: 0xb24f,
  BLAKE2S_128: 0xb250,
  BLAKE2S_136: 0xb251,
  BLAKE2S_144: 0xb252,
  BLAKE2S_152: 0xb253,
  BLAKE2S_160: 0xb254,
  BLAKE2S_168: 0xb255,
  BLAKE2S_176: 0xb256,
  BLAKE2S_184: 0xb257,
  BLAKE2S_192: 0xb258,
  BLAKE2S_200: 0xb259,
  BLAKE2S_208: 0xb25a,
  BLAKE2S_216: 0xb25b,
  BLAKE2S_224: 0xb25c,
  BLAKE2S_232: 0xb25d,
  BLAKE2S_240: 0xb25e,
  BLAKE2S_248: 0xb25f,
  BLAKE2S_256: 0xb260,
  SKEIN256_8: 0xb301,
  SKEIN256_16: 0xb302,
  SKEIN256_24: 0xb303,
  SKEIN256_32: 0xb304,
  SKEIN256_40: 0xb305,
  SKEIN256_48: 0xb306,
  SKEIN256_56: 0xb307,
  SKEIN256_64: 0xb308,
  SKEIN256_72: 0xb309,
  SKEIN256_80: 0xb30a,
  SKEIN256_88: 0xb30b,
  SKEIN256_96: 0xb30c,
  SKEIN256_104: 0xb30d,
  SKEIN256_112: 0xb30e,
  SKEIN256_120: 0xb30f,
  SKEIN256_128: 0xb310,
  SKEIN256_136: 0xb311,
  SKEIN256_144: 0xb312,
  SKEIN256_152: 0xb313,
  SKEIN256_160: 0xb314,
  SKEIN256_168: 0xb315,
  SKEIN256_176: 0xb316,
  SKEIN256_184: 0xb317,
  SKEIN256_192: 0xb318,
  SKEIN256_200: 0xb319,
  SKEIN256_208: 0xb31a,
  SKEIN256_216: 0xb31b,
  SKEIN256_224: 0xb31c,
  SKEIN256_232: 0xb31d,
  SKEIN256_240: 0xb31e,
  SKEIN256_248: 0xb31f,
  SKEIN256_256: 0xb320,
  SKEIN512_8: 0xb321,
  SKEIN512_16: 0xb322,
  SKEIN512_24: 0xb323,
  SKEIN512_32: 0xb324,
  SKEIN512_40: 0xb325,
  SKEIN512_48: 0xb326,
  SKEIN512_56: 0xb327,
  SKEIN512_64: 0xb328,
  SKEIN512_72: 0xb329,
  SKEIN512_80: 0xb32a,
  SKEIN512_88: 0xb32b,
  SKEIN512_96: 0xb32c,
  SKEIN512_104: 0xb32d,
  SKEIN512_112: 0xb32e,
  SKEIN512_120: 0xb32f,
  SKEIN512_128: 0xb330,
  SKEIN512_136: 0xb331,
  SKEIN512_144: 0xb332,
  SKEIN512_152: 0xb333,
  SKEIN512_160: 0xb334,
  SKEIN512_168: 0xb335,
  SKEIN512_176: 0xb336,
  SKEIN512_184: 0xb337,
  SKEIN512_192: 0xb338,
  SKEIN512_200: 0xb339,
  SKEIN512_208: 0xb33a,
  SKEIN512_216: 0xb33b,
  SKEIN512_224: 0xb33c,
  SKEIN512_232: 0xb33d,
  SKEIN512_240: 0xb33e,
  SKEIN512_248: 0xb33f,
  SKEIN512_256: 0xb340,
  SKEIN512_264: 0xb341,
  SKEIN512_272: 0xb342,
  SKEIN512_280: 0xb343,
  SKEIN512_288: 0xb344,
  SKEIN512_296: 0xb345,
  SKEIN512_304: 0xb346,
  SKEIN512_312: 0xb347,
  SKEIN512_320: 0xb348,
  SKEIN512_328: 0xb349,
  SKEIN512_336: 0xb34a,
  SKEIN512_344: 0xb34b,
  SKEIN512_352: 0xb34c,
  SKEIN512_360: 0xb34d,
  SKEIN512_368: 0xb34e,
  SKEIN512_376: 0xb34f,
  SKEIN512_384: 0xb350,
  SKEIN512_392: 0xb351,
  SKEIN512_400: 0xb352,
  SKEIN512_408: 0xb353,
  SKEIN512_416: 0xb354,
  SKEIN512_424: 0xb355,
  SKEIN512_432: 0xb356,
  SKEIN512_440: 0xb357,
  SKEIN512_448: 0xb358,
  SKEIN512_456: 0xb359,
  SKEIN512_464: 0xb35a,
  SKEIN512_472: 0xb35b,
  SKEIN512_480: 0xb35c,
  SKEIN512_488: 0xb35d,
  SKEIN512_496: 0xb35e,
  SKEIN512_504: 0xb35f,
  SKEIN512_512: 0xb360,
  SKEIN1024_8: 0xb361,
  SKEIN1024_16: 0xb362,
  SKEIN1024_24: 0xb363,
  SKEIN1024_32: 0xb364,
  SKEIN1024_40: 0xb365,
  SKEIN1024_48: 0xb366,
  SKEIN1024_56: 0xb367,
  SKEIN1024_64: 0xb368,
  SKEIN1024_72: 0xb369,
  SKEIN1024_80: 0xb36a,
  SKEIN1024_88: 0xb36b,
  SKEIN1024_96: 0xb36c,
  SKEIN1024_104: 0xb36d,
  SKEIN1024_112: 0xb36e,
  SKEIN1024_120: 0xb36f,
  SKEIN1024_128: 0xb370,
  SKEIN1024_136: 0xb371,
  SKEIN1024_144: 0xb372,
  SKEIN1024_152: 0xb373,
  SKEIN1024_160: 0xb374,
  SKEIN1024_168: 0xb375,
  SKEIN1024_176: 0xb376,
  SKEIN1024_184: 0xb377,
  SKEIN1024_192: 0xb378,
  SKEIN1024_200: 0xb379,
  SKEIN1024_208: 0xb37a,
  SKEIN1024_216: 0xb37b,
  SKEIN1024_224: 0xb37c,
  SKEIN1024_232: 0xb37d,
  SKEIN1024_240: 0xb37e,
  SKEIN1024_248: 0xb37f,
  SKEIN1024_256: 0xb380,
  SKEIN1024_264: 0xb381,
  SKEIN1024_272: 0xb382,
  SKEIN1024_280: 0xb383,
  SKEIN1024_288: 0xb384,
  SKEIN1024_296: 0xb385,
  SKEIN1024_304: 0xb386,
  SKEIN1024_312: 0xb387,
  SKEIN1024_320: 0xb388,
  SKEIN1024_328: 0xb389,
  SKEIN1024_336: 0xb38a,
  SKEIN1024_344: 0xb38b,
  SKEIN1024_352: 0xb38c,
  SKEIN1024_360: 0xb38d,
  SKEIN1024_368: 0xb38e,
  SKEIN1024_376: 0xb38f,
  SKEIN1024_384: 0xb390,
  SKEIN1024_392: 0xb391,
  SKEIN1024_400: 0xb392,
  SKEIN1024_408: 0xb393,
  SKEIN1024_416: 0xb394,
  SKEIN1024_424: 0xb395,
  SKEIN1024_432: 0xb396,
  SKEIN1024_440: 0xb397,
  SKEIN1024_448: 0xb398,
  SKEIN1024_456: 0xb399,
  SKEIN1024_464: 0xb39a,
  SKEIN1024_472: 0xb39b,
  SKEIN1024_480: 0xb39c,
  SKEIN1024_488: 0xb39d,
  SKEIN1024_496: 0xb39e,
  SKEIN1024_504: 0xb39f,
  SKEIN1024_512: 0xb3a0,
  SKEIN1024_520: 0xb3a1,
  SKEIN1024_528: 0xb3a2,
  SKEIN1024_536: 0xb3a3,
  SKEIN1024_544: 0xb3a4,
  SKEIN1024_552: 0xb3a5,
  SKEIN1024_560: 0xb3a6,
  SKEIN1024_568: 0xb3a7,
  SKEIN1024_576: 0xb3a8,
  SKEIN1024_584: 0xb3a9,
  SKEIN1024_592: 0xb3aa,
  SKEIN1024_600: 0xb3ab,
  SKEIN1024_608: 0xb3ac,
  SKEIN1024_616: 0xb3ad,
  SKEIN1024_624: 0xb3ae,
  SKEIN1024_632: 0xb3af,
  SKEIN1024_640: 0xb3b0,
  SKEIN1024_648: 0xb3b1,
  SKEIN1024_656: 0xb3b2,
  SKEIN1024_664: 0xb3b3,
  SKEIN1024_672: 0xb3b4,
  SKEIN1024_680: 0xb3b5,
  SKEIN1024_688: 0xb3b6,
  SKEIN1024_696: 0xb3b7,
  SKEIN1024_704: 0xb3b8,
  SKEIN1024_712: 0xb3b9,
  SKEIN1024_720: 0xb3ba,
  SKEIN1024_728: 0xb3bb,
  SKEIN1024_736: 0xb3bc,
  SKEIN1024_744: 0xb3bd,
  SKEIN1024_752: 0xb3be,
  SKEIN1024_760: 0xb3bf,
  SKEIN1024_768: 0xb3c0,
  SKEIN1024_776: 0xb3c1,
  SKEIN1024_784: 0xb3c2,
  SKEIN1024_792: 0xb3c3,
  SKEIN1024_800: 0xb3c4,
  SKEIN1024_808: 0xb3c5,
  SKEIN1024_816: 0xb3c6,
  SKEIN1024_824: 0xb3c7,
  SKEIN1024_832: 0xb3c8,
  SKEIN1024_840: 0xb3c9,
  SKEIN1024_848: 0xb3ca,
  SKEIN1024_856: 0xb3cb,
  SKEIN1024_864: 0xb3cc,
  SKEIN1024_872: 0xb3cd,
  SKEIN1024_880: 0xb3ce,
  SKEIN1024_888: 0xb3cf,
  SKEIN1024_896: 0xb3d0,
  SKEIN1024_904: 0xb3d1,
  SKEIN1024_912: 0xb3d2,
  SKEIN1024_920: 0xb3d3,
  SKEIN1024_928: 0xb3d4,
  SKEIN1024_936: 0xb3d5,
  SKEIN1024_944: 0xb3d6,
  SKEIN1024_952: 0xb3d7,
  SKEIN1024_960: 0xb3d8,
  SKEIN1024_968: 0xb3d9,
  SKEIN1024_976: 0xb3da,
  SKEIN1024_984: 0xb3db,
  SKEIN1024_992: 0xb3dc,
  SKEIN1024_1000: 0xb3dd,
  SKEIN1024_1008: 0xb3de,
  SKEIN1024_1016: 0xb3df,
  SKEIN1024_1024: 0xb3e0,
  // multiaddr
  IP4: 0x04,
  TCP: 0x06,
  DCCP: 0x21,
  IP6: 0x29,
  IP6ZONE: 0x2a,
  DNS: 0x35,
  DNS4: 0x36,
  DNS6: 0x37,
  DNSADDR: 0x38,
  SCTP: 0x84,
  UDP: 0x0111,
  P2P_WEBRTC_STAR: 0x0113,
  P2P_WEBRTC_DIRECT: 0x0114,
  P2P_STARDUST: 0x0115,
  P2P_CIRCUIT: 0x0122,
  UDT: 0x012d,
  UTP: 0x012e,
  UNIX: 0x0190,
  P2P: 0x01a5,
  IPFS: 0x01a5,
  HTTPS: 0x01bb,
  ONION: 0x01bc,
  ONION3: 0x01bd,
  GARLIC64: 0x01be,
  GARLIC32: 0x01bf,
  QUIC: 0x01cc,
  WS: 0x01dd,
  WSS: 0x01de,
  P2P_WEBSOCKET_STAR: 0x01df,
  HTTP: 0x01e0,
  // ipld
  RAW: 0x55,
  DAG_PB: 0x70,
  DAG_CBOR: 0x71,
  LIBP2P_KEY: 0x72,
  GIT_RAW: 0x78,
  TORRENT_INFO: 0x7b,
  TORRENT_FILE: 0x7c,
  LEOFCOIN_BLOCK: 0x81,
  LEOFCOIN_TX: 0x82,
  LEOFCOIN_PR: 0x83,
  ETH_BLOCK: 0x90,
  ETH_BLOCK_LIST: 0x91,
  ETH_TX_TRIE: 0x92,
  ETH_TX: 0x93,
  ETH_TX_RECEIPT_TRIE: 0x94,
  ETH_TX_RECEIPT: 0x95,
  ETH_STATE_TRIE: 0x96,
  ETH_ACCOUNT_SNAPSHOT: 0x97,
  ETH_STORAGE_TRIE: 0x98,
  BITCOIN_BLOCK: 0xb0,
  BITCOIN_TX: 0xb1,
  ZCASH_BLOCK: 0xc0,
  ZCASH_TX: 0xc1,
  STELLAR_BLOCK: 0xd0,
  STELLAR_TX: 0xd1,
  DECRED_BLOCK: 0xe0,
  DECRED_TX: 0xe1,
  DASH_BLOCK: 0xf0,
  DASH_TX: 0xf1,
  SWARM_MANIFEST: 0xfa,
  SWARM_FEED: 0xfb,
  DAG_JSON: 0x0129,
  // namespace
  PATH: 0x2f,
  IPLD_NS: 0xe2,
  IPFS_NS: 0xe3,
  SWARM_NS: 0xe4,
  // key
  ED25519_PUB: 0xed,
  // holochain
  HOLOCHAIN_ADR_V0: 0x807124,
  HOLOCHAIN_ADR_V1: 0x817124,
  HOLOCHAIN_KEY_V0: 0x947124,
  HOLOCHAIN_KEY_V1: 0x957124,
  HOLOCHAIN_SIG_V0: 0xa27124,
  HOLOCHAIN_SIG_V1: 0xa37124
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// THIS FILE IS GENERATED, DO NO EDIT MANUALLY
// For more information see the README.md

/* eslint-disable dot-notation */


module.exports = Object.freeze({
  // serialization
  0x50: 'protobuf',
  0x51: 'cbor',
  0x60: 'rlp',
  0x63: 'bencode',
  // multiformat
  0x30: 'multicodec',
  0x31: 'multihash',
  0x32: 'multiaddr',
  0x33: 'multibase',
  // multihash
  0x00: 'identity',
  0x11: 'sha1',
  0x12: 'sha2-256',
  0x13: 'sha2-512',
  0x14: 'sha3-512',
  0x15: 'sha3-384',
  0x16: 'sha3-256',
  0x17: 'sha3-224',
  0x18: 'shake-128',
  0x19: 'shake-256',
  0x1a: 'keccak-224',
  0x1b: 'keccak-256',
  0x1c: 'keccak-384',
  0x1d: 'keccak-512',
  0x22: 'murmur3-128',
  0x23: 'murmur3-32',
  0x56: 'dbl-sha2-256',
  0xd4: 'md4',
  0xd5: 'md5',
  0xd6: 'bmt',
  0x1100: 'x11',
  0xb201: 'blake2b-8',
  0xb202: 'blake2b-16',
  0xb203: 'blake2b-24',
  0xb204: 'blake2b-32',
  0xb205: 'blake2b-40',
  0xb206: 'blake2b-48',
  0xb207: 'blake2b-56',
  0xb208: 'blake2b-64',
  0xb209: 'blake2b-72',
  0xb20a: 'blake2b-80',
  0xb20b: 'blake2b-88',
  0xb20c: 'blake2b-96',
  0xb20d: 'blake2b-104',
  0xb20e: 'blake2b-112',
  0xb20f: 'blake2b-120',
  0xb210: 'blake2b-128',
  0xb211: 'blake2b-136',
  0xb212: 'blake2b-144',
  0xb213: 'blake2b-152',
  0xb214: 'blake2b-160',
  0xb215: 'blake2b-168',
  0xb216: 'blake2b-176',
  0xb217: 'blake2b-184',
  0xb218: 'blake2b-192',
  0xb219: 'blake2b-200',
  0xb21a: 'blake2b-208',
  0xb21b: 'blake2b-216',
  0xb21c: 'blake2b-224',
  0xb21d: 'blake2b-232',
  0xb21e: 'blake2b-240',
  0xb21f: 'blake2b-248',
  0xb220: 'blake2b-256',
  0xb221: 'blake2b-264',
  0xb222: 'blake2b-272',
  0xb223: 'blake2b-280',
  0xb224: 'blake2b-288',
  0xb225: 'blake2b-296',
  0xb226: 'blake2b-304',
  0xb227: 'blake2b-312',
  0xb228: 'blake2b-320',
  0xb229: 'blake2b-328',
  0xb22a: 'blake2b-336',
  0xb22b: 'blake2b-344',
  0xb22c: 'blake2b-352',
  0xb22d: 'blake2b-360',
  0xb22e: 'blake2b-368',
  0xb22f: 'blake2b-376',
  0xb230: 'blake2b-384',
  0xb231: 'blake2b-392',
  0xb232: 'blake2b-400',
  0xb233: 'blake2b-408',
  0xb234: 'blake2b-416',
  0xb235: 'blake2b-424',
  0xb236: 'blake2b-432',
  0xb237: 'blake2b-440',
  0xb238: 'blake2b-448',
  0xb239: 'blake2b-456',
  0xb23a: 'blake2b-464',
  0xb23b: 'blake2b-472',
  0xb23c: 'blake2b-480',
  0xb23d: 'blake2b-488',
  0xb23e: 'blake2b-496',
  0xb23f: 'blake2b-504',
  0xb240: 'blake2b-512',
  0xb241: 'blake2s-8',
  0xb242: 'blake2s-16',
  0xb243: 'blake2s-24',
  0xb244: 'blake2s-32',
  0xb245: 'blake2s-40',
  0xb246: 'blake2s-48',
  0xb247: 'blake2s-56',
  0xb248: 'blake2s-64',
  0xb249: 'blake2s-72',
  0xb24a: 'blake2s-80',
  0xb24b: 'blake2s-88',
  0xb24c: 'blake2s-96',
  0xb24d: 'blake2s-104',
  0xb24e: 'blake2s-112',
  0xb24f: 'blake2s-120',
  0xb250: 'blake2s-128',
  0xb251: 'blake2s-136',
  0xb252: 'blake2s-144',
  0xb253: 'blake2s-152',
  0xb254: 'blake2s-160',
  0xb255: 'blake2s-168',
  0xb256: 'blake2s-176',
  0xb257: 'blake2s-184',
  0xb258: 'blake2s-192',
  0xb259: 'blake2s-200',
  0xb25a: 'blake2s-208',
  0xb25b: 'blake2s-216',
  0xb25c: 'blake2s-224',
  0xb25d: 'blake2s-232',
  0xb25e: 'blake2s-240',
  0xb25f: 'blake2s-248',
  0xb260: 'blake2s-256',
  0xb301: 'skein256-8',
  0xb302: 'skein256-16',
  0xb303: 'skein256-24',
  0xb304: 'skein256-32',
  0xb305: 'skein256-40',
  0xb306: 'skein256-48',
  0xb307: 'skein256-56',
  0xb308: 'skein256-64',
  0xb309: 'skein256-72',
  0xb30a: 'skein256-80',
  0xb30b: 'skein256-88',
  0xb30c: 'skein256-96',
  0xb30d: 'skein256-104',
  0xb30e: 'skein256-112',
  0xb30f: 'skein256-120',
  0xb310: 'skein256-128',
  0xb311: 'skein256-136',
  0xb312: 'skein256-144',
  0xb313: 'skein256-152',
  0xb314: 'skein256-160',
  0xb315: 'skein256-168',
  0xb316: 'skein256-176',
  0xb317: 'skein256-184',
  0xb318: 'skein256-192',
  0xb319: 'skein256-200',
  0xb31a: 'skein256-208',
  0xb31b: 'skein256-216',
  0xb31c: 'skein256-224',
  0xb31d: 'skein256-232',
  0xb31e: 'skein256-240',
  0xb31f: 'skein256-248',
  0xb320: 'skein256-256',
  0xb321: 'skein512-8',
  0xb322: 'skein512-16',
  0xb323: 'skein512-24',
  0xb324: 'skein512-32',
  0xb325: 'skein512-40',
  0xb326: 'skein512-48',
  0xb327: 'skein512-56',
  0xb328: 'skein512-64',
  0xb329: 'skein512-72',
  0xb32a: 'skein512-80',
  0xb32b: 'skein512-88',
  0xb32c: 'skein512-96',
  0xb32d: 'skein512-104',
  0xb32e: 'skein512-112',
  0xb32f: 'skein512-120',
  0xb330: 'skein512-128',
  0xb331: 'skein512-136',
  0xb332: 'skein512-144',
  0xb333: 'skein512-152',
  0xb334: 'skein512-160',
  0xb335: 'skein512-168',
  0xb336: 'skein512-176',
  0xb337: 'skein512-184',
  0xb338: 'skein512-192',
  0xb339: 'skein512-200',
  0xb33a: 'skein512-208',
  0xb33b: 'skein512-216',
  0xb33c: 'skein512-224',
  0xb33d: 'skein512-232',
  0xb33e: 'skein512-240',
  0xb33f: 'skein512-248',
  0xb340: 'skein512-256',
  0xb341: 'skein512-264',
  0xb342: 'skein512-272',
  0xb343: 'skein512-280',
  0xb344: 'skein512-288',
  0xb345: 'skein512-296',
  0xb346: 'skein512-304',
  0xb347: 'skein512-312',
  0xb348: 'skein512-320',
  0xb349: 'skein512-328',
  0xb34a: 'skein512-336',
  0xb34b: 'skein512-344',
  0xb34c: 'skein512-352',
  0xb34d: 'skein512-360',
  0xb34e: 'skein512-368',
  0xb34f: 'skein512-376',
  0xb350: 'skein512-384',
  0xb351: 'skein512-392',
  0xb352: 'skein512-400',
  0xb353: 'skein512-408',
  0xb354: 'skein512-416',
  0xb355: 'skein512-424',
  0xb356: 'skein512-432',
  0xb357: 'skein512-440',
  0xb358: 'skein512-448',
  0xb359: 'skein512-456',
  0xb35a: 'skein512-464',
  0xb35b: 'skein512-472',
  0xb35c: 'skein512-480',
  0xb35d: 'skein512-488',
  0xb35e: 'skein512-496',
  0xb35f: 'skein512-504',
  0xb360: 'skein512-512',
  0xb361: 'skein1024-8',
  0xb362: 'skein1024-16',
  0xb363: 'skein1024-24',
  0xb364: 'skein1024-32',
  0xb365: 'skein1024-40',
  0xb366: 'skein1024-48',
  0xb367: 'skein1024-56',
  0xb368: 'skein1024-64',
  0xb369: 'skein1024-72',
  0xb36a: 'skein1024-80',
  0xb36b: 'skein1024-88',
  0xb36c: 'skein1024-96',
  0xb36d: 'skein1024-104',
  0xb36e: 'skein1024-112',
  0xb36f: 'skein1024-120',
  0xb370: 'skein1024-128',
  0xb371: 'skein1024-136',
  0xb372: 'skein1024-144',
  0xb373: 'skein1024-152',
  0xb374: 'skein1024-160',
  0xb375: 'skein1024-168',
  0xb376: 'skein1024-176',
  0xb377: 'skein1024-184',
  0xb378: 'skein1024-192',
  0xb379: 'skein1024-200',
  0xb37a: 'skein1024-208',
  0xb37b: 'skein1024-216',
  0xb37c: 'skein1024-224',
  0xb37d: 'skein1024-232',
  0xb37e: 'skein1024-240',
  0xb37f: 'skein1024-248',
  0xb380: 'skein1024-256',
  0xb381: 'skein1024-264',
  0xb382: 'skein1024-272',
  0xb383: 'skein1024-280',
  0xb384: 'skein1024-288',
  0xb385: 'skein1024-296',
  0xb386: 'skein1024-304',
  0xb387: 'skein1024-312',
  0xb388: 'skein1024-320',
  0xb389: 'skein1024-328',
  0xb38a: 'skein1024-336',
  0xb38b: 'skein1024-344',
  0xb38c: 'skein1024-352',
  0xb38d: 'skein1024-360',
  0xb38e: 'skein1024-368',
  0xb38f: 'skein1024-376',
  0xb390: 'skein1024-384',
  0xb391: 'skein1024-392',
  0xb392: 'skein1024-400',
  0xb393: 'skein1024-408',
  0xb394: 'skein1024-416',
  0xb395: 'skein1024-424',
  0xb396: 'skein1024-432',
  0xb397: 'skein1024-440',
  0xb398: 'skein1024-448',
  0xb399: 'skein1024-456',
  0xb39a: 'skein1024-464',
  0xb39b: 'skein1024-472',
  0xb39c: 'skein1024-480',
  0xb39d: 'skein1024-488',
  0xb39e: 'skein1024-496',
  0xb39f: 'skein1024-504',
  0xb3a0: 'skein1024-512',
  0xb3a1: 'skein1024-520',
  0xb3a2: 'skein1024-528',
  0xb3a3: 'skein1024-536',
  0xb3a4: 'skein1024-544',
  0xb3a5: 'skein1024-552',
  0xb3a6: 'skein1024-560',
  0xb3a7: 'skein1024-568',
  0xb3a8: 'skein1024-576',
  0xb3a9: 'skein1024-584',
  0xb3aa: 'skein1024-592',
  0xb3ab: 'skein1024-600',
  0xb3ac: 'skein1024-608',
  0xb3ad: 'skein1024-616',
  0xb3ae: 'skein1024-624',
  0xb3af: 'skein1024-632',
  0xb3b0: 'skein1024-640',
  0xb3b1: 'skein1024-648',
  0xb3b2: 'skein1024-656',
  0xb3b3: 'skein1024-664',
  0xb3b4: 'skein1024-672',
  0xb3b5: 'skein1024-680',
  0xb3b6: 'skein1024-688',
  0xb3b7: 'skein1024-696',
  0xb3b8: 'skein1024-704',
  0xb3b9: 'skein1024-712',
  0xb3ba: 'skein1024-720',
  0xb3bb: 'skein1024-728',
  0xb3bc: 'skein1024-736',
  0xb3bd: 'skein1024-744',
  0xb3be: 'skein1024-752',
  0xb3bf: 'skein1024-760',
  0xb3c0: 'skein1024-768',
  0xb3c1: 'skein1024-776',
  0xb3c2: 'skein1024-784',
  0xb3c3: 'skein1024-792',
  0xb3c4: 'skein1024-800',
  0xb3c5: 'skein1024-808',
  0xb3c6: 'skein1024-816',
  0xb3c7: 'skein1024-824',
  0xb3c8: 'skein1024-832',
  0xb3c9: 'skein1024-840',
  0xb3ca: 'skein1024-848',
  0xb3cb: 'skein1024-856',
  0xb3cc: 'skein1024-864',
  0xb3cd: 'skein1024-872',
  0xb3ce: 'skein1024-880',
  0xb3cf: 'skein1024-888',
  0xb3d0: 'skein1024-896',
  0xb3d1: 'skein1024-904',
  0xb3d2: 'skein1024-912',
  0xb3d3: 'skein1024-920',
  0xb3d4: 'skein1024-928',
  0xb3d5: 'skein1024-936',
  0xb3d6: 'skein1024-944',
  0xb3d7: 'skein1024-952',
  0xb3d8: 'skein1024-960',
  0xb3d9: 'skein1024-968',
  0xb3da: 'skein1024-976',
  0xb3db: 'skein1024-984',
  0xb3dc: 'skein1024-992',
  0xb3dd: 'skein1024-1000',
  0xb3de: 'skein1024-1008',
  0xb3df: 'skein1024-1016',
  0xb3e0: 'skein1024-1024',
  // multiaddr
  0x04: 'ip4',
  0x06: 'tcp',
  0x21: 'dccp',
  0x29: 'ip6',
  0x2a: 'ip6zone',
  0x35: 'dns',
  0x36: 'dns4',
  0x37: 'dns6',
  0x38: 'dnsaddr',
  0x84: 'sctp',
  0x0111: 'udp',
  0x0113: 'p2p-webrtc-star',
  0x0114: 'p2p-webrtc-direct',
  0x0115: 'p2p-stardust',
  0x0122: 'p2p-circuit',
  0x012d: 'udt',
  0x012e: 'utp',
  0x0190: 'unix',
  0x01a5: 'p2p',
  0x01bb: 'https',
  0x01bc: 'onion',
  0x01bd: 'onion3',
  0x01be: 'garlic64',
  0x01bf: 'garlic32',
  0x01cc: 'quic',
  0x01dd: 'ws',
  0x01de: 'wss',
  0x01df: 'p2p-websocket-star',
  0x01e0: 'http',
  // ipld
  0x55: 'raw',
  0x70: 'dag-pb',
  0x71: 'dag-cbor',
  0x72: 'libp2p-key',
  0x78: 'git-raw',
  0x7b: 'torrent-info',
  0x7c: 'torrent-file',
  0x81: 'leofcoin-block',
  0x82: 'leofcoin-tx',
  0x83: 'leofcoin-pr',
  0x90: 'eth-block',
  0x91: 'eth-block-list',
  0x92: 'eth-tx-trie',
  0x93: 'eth-tx',
  0x94: 'eth-tx-receipt-trie',
  0x95: 'eth-tx-receipt',
  0x96: 'eth-state-trie',
  0x97: 'eth-account-snapshot',
  0x98: 'eth-storage-trie',
  0xb0: 'bitcoin-block',
  0xb1: 'bitcoin-tx',
  0xc0: 'zcash-block',
  0xc1: 'zcash-tx',
  0xd0: 'stellar-block',
  0xd1: 'stellar-tx',
  0xe0: 'decred-block',
  0xe1: 'decred-tx',
  0xf0: 'dash-block',
  0xf1: 'dash-tx',
  0xfa: 'swarm-manifest',
  0xfb: 'swarm-feed',
  0x0129: 'dag-json',
  // namespace
  0x2f: 'path',
  0xe2: 'ipld-ns',
  0xe3: 'ipfs-ns',
  0xe4: 'swarm-ns',
  // key
  0xed: 'ed25519-pub',
  // holochain
  0x807124: 'holochain-adr-v0',
  0x817124: 'holochain-adr-v1',
  0x947124: 'holochain-key-v0',
  0x957124: 'holochain-key-v1',
  0xa27124: 'holochain-sig-v0',
  0xa37124: 'holochain-sig-v1'
});

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var mh = __webpack_require__(12);

var CIDUtil = {
  /**
   * Test if the given input is a valid CID object.
   * Returns an error message if it is not.
   * Returns undefined if it is a valid CID.
   *
   * @param {any} other
   * @returns {string}
   */
  checkCIDComponents: function checkCIDComponents(other) {
    if (other == null) {
      return 'null values are not valid CIDs';
    }

    if (!(other.version === 0 || other.version === 1)) {
      return 'Invalid version, must be a number equal to 1 or 0';
    }

    if (typeof other.codec !== 'string') {
      return 'codec must be string';
    }

    if (other.version === 0) {
      if (other.codec !== 'dag-pb') {
        return "codec must be 'dag-pb' for CIDv0";
      }

      if (other.multibaseName !== 'base58btc') {
        return "multibaseName must be 'base58btc' for CIDv0";
      }
    }

    if (!Buffer.isBuffer(other.multihash)) {
      return 'multihash must be a Buffer';
    }

    try {
      mh.validate(other.multihash);
    } catch (err) {
      var errorMsg = err.message;

      if (!errorMsg) {
        // Just in case mh.validate() throws an error with empty error message
        errorMsg = 'Multihash validation failed';
      }

      return errorMsg;
    }
  }
};
module.exports = CIDUtil;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0).Buffer))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function withIs(Class, _ref) {
  var className = _ref.className,
      symbolName = _ref.symbolName;
  var symbol = Symbol["for"](symbolName);

  var ClassIsWrapper = _defineProperty({}, className,
  /*#__PURE__*/
  function (_Class) {
    _inherits(_class, _Class);

    function _class() {
      var _getPrototypeOf2;

      var _this2;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
      Object.defineProperty(_assertThisInitialized(_this2), symbol, {
        value: true
      });
      return _this2;
    }

    _createClass(_class, [{
      key: Symbol.toStringTag,
      get: function get() {
        return className;
      }
    }]);

    return _class;
  }(Class))[className];

  ClassIsWrapper["is".concat(className)] = function (obj) {
    return !!(obj && obj[symbol]);
  };

  return ClassIsWrapper;
}

function withIsProto(Class, _ref2) {
  var className = _ref2.className,
      symbolName = _ref2.symbolName,
      withoutNew = _ref2.withoutNew;
  var symbol = Symbol["for"](symbolName);
  /* eslint-disable object-shorthand */

  var ClassIsWrapper = _defineProperty({}, className, function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (withoutNew && !(this instanceof ClassIsWrapper)) {
      return _construct(ClassIsWrapper, args);
    }

    var _this = Class.call.apply(Class, [this].concat(args)) || this;

    if (_this && !_this[symbol]) {
      Object.defineProperty(_this, symbol, {
        value: true
      });
    }

    return _this;
  })[className];
  /* eslint-enable object-shorthand */


  ClassIsWrapper.prototype = Object.create(Class.prototype);
  ClassIsWrapper.prototype.constructor = ClassIsWrapper;
  Object.defineProperty(ClassIsWrapper.prototype, Symbol.toStringTag, {
    get: function get() {
      return className;
    }
  });

  ClassIsWrapper["is".concat(className)] = function (obj) {
    return !!(obj && obj[symbol]);
  };

  return ClassIsWrapper;
}

module.exports = withIs;
module.exports.proto = withIsProto;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = tryEach;

var _noop = __webpack_require__(15);

var _noop2 = _interopRequireDefault(_noop);

var _eachSeries = __webpack_require__(82);

var _eachSeries2 = _interopRequireDefault(_eachSeries);

var _wrapAsync = __webpack_require__(18);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

var _slice = __webpack_require__(8);

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
/**
 * It runs each task in series but stops whenever any of the functions were
 * successful. If one of the tasks were successful, the `callback` will be
 * passed the result of the successful task. If all tasks fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name tryEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to
 * run, each function is passed a `callback(err, result)` it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback which is called when one
 * of the tasks has succeeded, or all have failed. It receives the `err` and
 * `result` arguments of the last attempt at completing the `task`. Invoked with
 * (err, results).
 * @example
 * async.tryEach([
 *     function getDataFromFirstWebsite(callback) {
 *         // Try getting the data from the first website
 *         callback(err, data);
 *     },
 *     function getDataFromSecondWebsite(callback) {
 *         // First website failed,
 *         // Try getting the data from the backup website
 *         callback(err, data);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     Now do something with the data.
 * });
 *
 */


function tryEach(tasks, callback) {
  var error = null;
  var result;
  callback = callback || _noop2["default"];
  (0, _eachSeries2["default"])(tasks, function (task, callback) {
    (0, _wrapAsync2["default"])(task)(function (err, res
    /*, ...args*/
    ) {
      if (arguments.length > 2) {
        result = (0, _slice2["default"])(arguments, 1);
      } else {
        result = res;
      }

      error = err;
      callback(!err);
    });
  }, function () {
    callback(error, result);
  });
}

module.exports = exports['default'];

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _eachLimit = __webpack_require__(83);

var _eachLimit2 = _interopRequireDefault(_eachLimit);

var _doLimit = __webpack_require__(111);

var _doLimit2 = _interopRequireDefault(_doLimit);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfSeries`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */


exports["default"] = (0, _doLimit2["default"])(_eachLimit2["default"], 1);
module.exports = exports['default'];

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = eachLimit;

var _eachOfLimit = __webpack_require__(84);

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _withoutIndex = __webpack_require__(107);

var _withoutIndex2 = _interopRequireDefault(_withoutIndex);

var _wrapAsync = __webpack_require__(18);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfLimit`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */


function eachLimit(coll, limit, iteratee, callback) {
  (0, _eachOfLimit2["default"])(limit)(coll, (0, _withoutIndex2["default"])((0, _wrapAsync2["default"])(iteratee)), callback);
}

module.exports = exports['default'];

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _eachOfLimit;

var _noop = __webpack_require__(15);

var _noop2 = _interopRequireDefault(_noop);

var _once = __webpack_require__(29);

var _once2 = _interopRequireDefault(_once);

var _iterator = __webpack_require__(85);

var _iterator2 = _interopRequireDefault(_iterator);

var _onlyOnce = __webpack_require__(38);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _breakLoop = __webpack_require__(106);

var _breakLoop2 = _interopRequireDefault(_breakLoop);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _eachOfLimit(limit) {
  return function (obj, iteratee, callback) {
    callback = (0, _once2["default"])(callback || _noop2["default"]);

    if (limit <= 0 || !obj) {
      return callback(null);
    }

    var nextElem = (0, _iterator2["default"])(obj);
    var done = false;
    var running = 0;
    var looping = false;

    function iterateeCallback(err, value) {
      running -= 1;

      if (err) {
        done = true;
        callback(err);
      } else if (value === _breakLoop2["default"] || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }

    function replenish() {
      looping = true;

      while (running < limit && !done) {
        var elem = nextElem();

        if (elem === null) {
          done = true;

          if (running <= 0) {
            callback(null);
          }

          return;
        }

        running += 1;
        iteratee(elem.value, elem.key, (0, _onlyOnce2["default"])(iterateeCallback));
      }

      looping = false;
    }

    replenish();
  };
}

module.exports = exports['default'];

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = iterator;

var _isArrayLike = __webpack_require__(30);

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _getIterator = __webpack_require__(89);

var _getIterator2 = _interopRequireDefault(_getIterator);

var _keys = __webpack_require__(90);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? {
      value: coll[i],
      key: i
    } : null;
  };
}

function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done) return null;
    i++;
    return {
      value: item.value,
      key: i
    };
  };
}

function createObjectIterator(obj) {
  var okeys = (0, _keys2["default"])(obj);
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    return i < len ? {
      value: obj[key],
      key: key
    } : null;
  };
}

function iterator(coll) {
  if ((0, _isArrayLike2["default"])(coll)) {
    return createArrayIterator(coll);
  }

  var iterator = (0, _getIterator2["default"])(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

module.exports = exports['default'];

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(16),
    isObject = __webpack_require__(34);
/** `Object#toString` result references. */


var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction(value) {
  if (!isObject(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(31);
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/** Built-in value references. */

var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }

  return result;
}

module.exports = getRawTag;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used for built-in method references. */
var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (coll) {
  return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;
module.exports = exports['default'];

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayLikeKeys = __webpack_require__(91),
    baseKeys = __webpack_require__(102),
    isArrayLike = __webpack_require__(30);
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */


function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseTimes = __webpack_require__(92),
    isArguments = __webpack_require__(93),
    isArray = __webpack_require__(36),
    isBuffer = __webpack_require__(95),
    isIndex = __webpack_require__(97),
    isTypedArray = __webpack_require__(98);
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }

  return result;
}

module.exports = arrayLikeKeys;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

module.exports = baseTimes;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsArguments = __webpack_require__(94),
    isObjectLike = __webpack_require__(17);
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
module.exports = isArguments;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(16),
    isObjectLike = __webpack_require__(17);
/** `Object#toString` result references. */


var argsTag = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var root = __webpack_require__(32),
    stubFalse = __webpack_require__(96);
/** Detect free variable `exports`. */


var freeExports = ( false ? undefined : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && ( false ? undefined : _typeof(module)) == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? root.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */

var isBuffer = nativeIsBuffer || stubFalse;
module.exports = isBuffer;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(37)(module)))

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/** Used to detect unsigned integer values. */

var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */

function isIndex(value, length) {
  var type = _typeof(value);

  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsTypedArray = __webpack_require__(99),
    baseUnary = __webpack_require__(100),
    nodeUtil = __webpack_require__(101);
/* Node.js helper references. */


var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */

var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
module.exports = isTypedArray;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(16),
    isLength = __webpack_require__(35),
    isObjectLike = __webpack_require__(17);
/** `Object#toString` result references. */


var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

module.exports = baseUnary;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var freeGlobal = __webpack_require__(33);
/** Detect free variable `exports`. */


var freeExports = ( false ? undefined : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && ( false ? undefined : _typeof(module)) == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */

var freeProcess = moduleExports && freeGlobal.process;
/** Used to access faster Node.js helpers. */

var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    } // Legacy `process.binding('util')` for Node.js < 10.


    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

module.exports = nodeUtil;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(37)(module)))

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isPrototype = __webpack_require__(103),
    nativeKeys = __webpack_require__(104);
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}

module.exports = baseKeys;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used for built-in method references. */
var objectProto = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}

module.exports = isPrototype;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var overArg = __webpack_require__(105);
/* Built-in method references for those with the same name as other `lodash` methods. */


var nativeKeys = overArg(Object.keys, Object);
module.exports = nativeKeys;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // A temporary value used to identify if the loop should be broken.
// See #1064, #1293

exports["default"] = {};
module.exports = exports["default"];

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _withoutIndex;

function _withoutIndex(iteratee) {
  return function (value, index, callback) {
    return iteratee(value, callback);
  };
}

module.exports = exports["default"];

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = asyncify;

var _isObject = __webpack_require__(34);

var _isObject2 = _interopRequireDefault(_isObject);

var _initialParams = __webpack_require__(109);

var _initialParams2 = _interopRequireDefault(_initialParams);

var _setImmediate = __webpack_require__(110);

var _setImmediate2 = _interopRequireDefault(_setImmediate);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */


function asyncify(func) {
  return (0, _initialParams2["default"])(function (args, callback) {
    var result;

    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    } // if result is Promise object


    if ((0, _isObject2["default"])(result) && typeof result.then === 'function') {
      result.then(function (value) {
        invokeCallback(callback, null, value);
      }, function (err) {
        invokeCallback(callback, err.message ? err : new Error(err));
      });
    } else {
      callback(null, result);
    }
  });
}

function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (e) {
    (0, _setImmediate2["default"])(rethrow, e);
  }
}

function rethrow(error) {
  throw error;
}

module.exports = exports['default'];

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (fn) {
  return function ()
  /*...args, callback*/
  {
    var args = (0, _slice2["default"])(arguments);
    var callback = args.pop();
    fn.call(this, args, callback);
  };
};

var _slice = __webpack_require__(8);

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = exports['default'];

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, process) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasNextTick = exports.hasSetImmediate = undefined;
exports.fallback = fallback;
exports.wrap = wrap;

var _slice = __webpack_require__(8);

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = exports.hasNextTick = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
  setTimeout(fn, 0);
}

function wrap(defer) {
  return function (fn
  /*, ...args*/
  ) {
    var args = (0, _slice2["default"])(arguments, 1);
    defer(function () {
      fn.apply(null, args);
    });
  };
}

var _defer;

if (hasSetImmediate) {
  _defer = setImmediate;
} else if (hasNextTick) {
  _defer = process.nextTick;
} else {
  _defer = fallback;
}

exports["default"] = wrap(_defer);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23).setImmediate, __webpack_require__(2)))

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = doLimit;

function doLimit(fn, limit) {
  return function (iterable, iteratee, callback) {
    return fn(iterable, limit, iteratee, callback);
  };
}

module.exports = exports["default"];

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (tasks, callback) {
  callback = (0, _once2["default"])(callback || _noop2["default"]);
  if (!(0, _isArray2["default"])(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
  if (!tasks.length) return callback();
  var taskIndex = 0;

  function nextTask(args) {
    var task = (0, _wrapAsync2["default"])(tasks[taskIndex++]);
    args.push((0, _onlyOnce2["default"])(next));
    task.apply(null, args);
  }

  function next(err
  /*, ...args*/
  ) {
    if (err || taskIndex === tasks.length) {
      return callback.apply(null, arguments);
    }

    nextTask((0, _slice2["default"])(arguments, 1));
  }

  nextTask([]);
};

var _isArray = __webpack_require__(36);

var _isArray2 = _interopRequireDefault(_isArray);

var _noop = __webpack_require__(15);

var _noop2 = _interopRequireDefault(_noop);

var _once = __webpack_require__(29);

var _once2 = _interopRequireDefault(_once);

var _slice = __webpack_require__(8);

var _slice2 = _interopRequireDefault(_slice);

var _onlyOnce = __webpack_require__(38);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = __webpack_require__(18);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = exports['default'];
/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var filesize = __webpack_require__(114);

var mainStyle = __webpack_require__(115);

var pathUtil = __webpack_require__(39);

function getParentHref(path) {
  var parts = pathUtil.cidArray(path).slice();

  if (parts.length > 1) {
    // drop the last segment in a safe way that works for both paths and urls
    return path.replace("/".concat(parts.pop()), '');
  }

  return path;
}

function buildFilesList(path, links) {
  var rows = links.map(function (link) {
    var row = ["<div class=\"ipfs-icon ipfs-_blank\">&nbsp;</div>", "<a href=\"".concat(path).concat(path.endsWith('/') ? '' : '/').concat(link.Name, "\">").concat(link.Name, "</a>"), filesize(link.Tsize)];
    row = row.map(function (cell) {
      return "<td>".concat(cell, "</td>");
    }).join('');
    return "<tr>".concat(row, "</tr>");
  });
  return rows.join('');
}

function buildTable(path, links) {
  return "\n    <table class=\"table table-striped\">\n      <tbody>\n        <tr>\n          <td class=\"narrow\">\n            <div class=\"ipfs-icon ipfs-_blank\">&nbsp;</div>\n          </td>\n          <td class=\"padding\">\n            <a href=\"".concat(getParentHref(path), "\">..</a>\n          </td>\n          <td></td>\n        </tr>\n        ").concat(buildFilesList(path, links), "\n      </tbody>\n    </table>\n  ");
}

function render(path, links) {
  return "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <title>".concat(path, "</title>\n      <style>").concat(mainStyle, "</style>\n    </head>\n    <body>\n      <div id=\"header\" class=\"row\">\n        <div class=\"col-xs-2\">\n          <div id=\"logo\" class=\"ipfs-logo\"></div>\n        </div>\n      </div>\n      <br>\n      <div class=\"col-xs-12\">\n        <div class=\"panel panel-default\">\n          <div class=\"panel-heading\">\n            <strong>Index of ").concat(path, "</strong>\n          </div>\n          ").concat(buildTable(path, links), "\n        </div>\n      </div>\n    </body>\n    </html>\n  ");
}

exports = module.exports;
exports.render = render;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
/**
 * filesize
 *
 * @copyright 2018 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.6.1
 */

(function (global) {
  var b = /^(b|B)$/,
      symbol = {
    iec: {
      bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
      bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    },
    jedec: {
      bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
      bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    }
  },
      fullform = {
    iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
    jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
  };
  /**
   * filesize
   *
   * @method filesize
   * @param  {Mixed}   arg        String, Int or Float to transform
   * @param  {Object}  descriptor [Optional] Flags
   * @return {String}             Readable file size String
   */

  function filesize(arg) {
    var descriptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var result = [],
        val = 0,
        e = void 0,
        base = void 0,
        bits = void 0,
        ceil = void 0,
        full = void 0,
        fullforms = void 0,
        neg = void 0,
        num = void 0,
        output = void 0,
        round = void 0,
        unix = void 0,
        separator = void 0,
        spacer = void 0,
        standard = void 0,
        symbols = void 0;

    if (isNaN(arg)) {
      throw new Error("Invalid arguments");
    }

    bits = descriptor.bits === true;
    unix = descriptor.unix === true;
    base = descriptor.base || 2;
    round = descriptor.round !== void 0 ? descriptor.round : unix ? 1 : 2;
    separator = descriptor.separator !== void 0 ? descriptor.separator || "" : "";
    spacer = descriptor.spacer !== void 0 ? descriptor.spacer : unix ? "" : " ";
    symbols = descriptor.symbols || descriptor.suffixes || {};
    standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
    output = descriptor.output || "string";
    full = descriptor.fullform === true;
    fullforms = descriptor.fullforms instanceof Array ? descriptor.fullforms : [];
    e = descriptor.exponent !== void 0 ? descriptor.exponent : -1;
    num = Number(arg);
    neg = num < 0;
    ceil = base > 2 ? 1000 : 1024; // Flipping a negative number to determine the size

    if (neg) {
      num = -num;
    } // Determining the exponent


    if (e === -1 || isNaN(e)) {
      e = Math.floor(Math.log(num) / Math.log(ceil));

      if (e < 0) {
        e = 0;
      }
    } // Exceeding supported length, time to reduce & multiply


    if (e > 8) {
      e = 8;
    } // Zero is now a special case because bytes divide by 1


    if (num === 0) {
      result[0] = 0;
      result[1] = unix ? "" : symbol[standard][bits ? "bits" : "bytes"][e];
    } else {
      val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));

      if (bits) {
        val = val * 8;

        if (val >= ceil && e < 8) {
          val = val / ceil;
          e++;
        }
      }

      result[0] = Number(val.toFixed(e > 0 ? round : 0));
      result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

      if (unix) {
        result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

        if (b.test(result[1])) {
          result[0] = Math.floor(result[0]);
          result[1] = "";
        }
      }
    } // Decorating a 'diff'


    if (neg) {
      result[0] = -result[0];
    } // Applying custom symbol


    result[1] = symbols[result[1]] || result[1]; // Returning Array, Object, or String (default)

    if (output === "array") {
      return result;
    }

    if (output === "exponent") {
      return e;
    }

    if (output === "object") {
      return {
        value: result[0],
        suffix: result[1],
        symbol: result[1]
      };
    }

    if (full) {
      result[1] = fullforms[e] ? fullforms[e] : fullform[standard][e] + (bits ? "bit" : "byte") + (result[0] === 1 ? "" : "s");
    }

    if (separator.length > 0) {
      result[0] = result[0].toString().replace(".", separator);
    }

    return result.join(spacer);
  } // Partial application for functional programming


  filesize.partial = function (opt) {
    return function (arg) {
      return filesize(arg, opt);
    };
  }; // CommonJS, AMD, script tag


  if (true) {
    module.exports = filesize;
  } else {}
})(typeof window !== "undefined" ? window : global);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{margin:0}a{background-color:transparent}a:active,a:hover{outline:0}strong{font-weight:700}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}table{border-spacing:0;border-collapse:collapse}td{padding:0} @media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}tr{page-break-inside:avoid}.table{border-collapse:collapse!important}.table td{background-color:#fff!important}}@font-face{font-family:'Glyphicons Halflings';src:url(../fonts/glyphicons-halflings-regular.eot);src:url(../fonts/glyphicons-halflings-regular.eot?#iefix) format('embedded-opentype'),url(../fonts/glyphicons-halflings-regular.woff2) format('woff2'),url(../fonts/glyphicons-halflings-regular.woff) format('woff'),url(../fonts/glyphicons-halflings-regular.ttf) format('truetype'),url(../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format('svg')}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}a{color:#337ab7;text-decoration:none}a:focus,a:hover{color:#23527c;text-decoration:underline}a:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.row{margin-right:-15px;margin-left:-15px}.col-xs-12,.col-xs-2{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xs-12,.col-xs-2{float:left}.col-xs-12{width:100%}.col-xs-2{width:16.66666667%}table{background-color:transparent}.table{width:100%;max-width:100%;margin-bottom:20px}.table>tbody>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table{margin-bottom:0}.panel>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table:last-child>tbody:last-child>tr:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child{border-bottom-left-radius:3px}.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child{border-bottom-right-radius:3px}.panel>.table>tbody:first-child>tr:first-child td{border-top:0}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.row:after,.row:before{display:table;content:\" \"}.row:after{clear:both}@-ms-viewport{width:device-width}.ipfs-_blank{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWBJREFUeNqEUj1LxEAQnd1MVA4lyIEWx6UIKEGUExGsbC3tLfwJ/hT/g7VlCnubqxXBwg/Q4hQP/LhKL5nZuBsvuGfW5MGyuzM7jzdvVuR5DgYnZ+f99ai7Vt5t9K9unu4HLweI3qWYxI6PDosdy0fhcntxO44CcOBzPA7mfEyuHwf7ntQk4jcnywOxIlfxOCNYaLVgb6cXbkTdhJXq2SIlNMC0xIqhHczDbi8OVzpLSUa0WebRfmigLHqj1EcPZnwf7gbDIrYVRyEinurj6jTBHyI7pqVrFQqEbt6TEmZ9v1NRAJNC1xTYxIQh/MmRUlmFQE3qWOW1nqB2TWk1/3tgJV0waVvkFIEeZbHq4ElyKzAmEXOx6gnEVJuWBzmkRJBRPYGZBDsVaOlpSgVJE2yVaAe/0kx/3azBRO0VsbMFZE3CDSZKweZfYIVg+DZ6v7h9GDVOwZPw/PoxKu/fAgwALbDAXf7DdQkAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-_page{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmhJREFUeNpsUztv01AYPfdhOy/XTZ80VV1VoCqlA2zQqUgwMEErWBALv4GJDfEDmOEHsFTqVCTExAiiSI2QEKJKESVFFBWo04TESRzfy2c7LY/kLtf2d8+555zvM9NaI1ora5svby9OnbUEBxgDlIKiWjXQeLy19/X17sEtcPY2rtHS96/Hu0RvXXLz+cUzM87zShsI29DpHCYt4E6Box4IZzTnbDx7V74GjhOSfwgE0H2638K9h08A3iHGVbjTw7g6YmAyw/BgecHNGGJjvfQhIfmfIFDAXJpjuugi7djIFVI4P0plctgJQ0xnFe5eOO02OwEp2VkhSCnC8WOCdqgwnzFx4/IyppwRVN+XYXsecqZA1pB48ekAnw9/4GZx3L04N/GoTwEjX4cNH5vlPfjtAIYp8cWrQutxrC5Mod3VsXVTMFSqtaE+gl9dhaUxE2tXZiF7nYiiatJ3v5s8R/1yOCNLOuwjkELiTbmC9dJHpIaGASsDkoFQGJQwHWMcHWJYOmUj1OjvQotuytt5nHMLEGkCyx6QU384jwkUAd2sxJbS/QShZtg/8rHzzQOzSaFhxQrA6YgQMQHojCUlgnCAAvKFBoXXaHfArSCZDE0gyWJgFIKmvUFKO4MUNIk2a4+hODtDUVuJ/J732AKS6ZtImdTyAQQB3bZN8l9t75IFh0JMUdVKsohsUPqRgnka0tYgggYpCHkKGTsHI5NOMojB4iTICCepvX53AIEfQta1iUCmoTiBmdEri2RgddKFhuJoqb/af/yw/d3zTNM6UkaOfis62aUgddAbnz+rXuPY+Vnzjt9/CzAAbmLjCrfBiRgAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-aac{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNp0Uk1PE0EYftruVlvAUkhVEPoBcsEoLRJBY01MPHjCs3cvogcT/4qJJN5NvHhoohcOnPw4YEGIkCh+oLGBKm3Z7nZ3dme2vjOhTcjiJJvZzPvOM8/HG2q325Dr3kLp7Y1ibpIxjs4KhQBZfvV6s7K5Vb0bjeof5ZlcGysP1a51mifODybvzE8mzCbrAoTDIThMoGXZiZ4YSiurf+Z1XeuCqJ7Oj+sK3jQcNAmg8xkGQ71mYejcAB49vpmeuzJccl0+dUj6KIAvfHCPg3N+uAv4vg9BOxcCmfEzuP/genpmeqhEMgude10Jwm+DuUIyUdTlqu2byoMfX/dRermBeExHsTiWNi3+lMpzRwDki8zxCIATmzbevfmClukiP5NFhJgwkjeRTeLShdOoVJqnAgwkgCAZ6+UdLC9twjQZ8pdzioFkZBHY3q6B3l4dJEEEPOCeD4cYVH7Xsf15F+FImC775INAJBJSkVoWo0QY9YqgiR4ZZzRaGBkdwK3bFxGLRZUfB3Rm2x4x9CGtsUxH9QYkKICDFuLxKAozGZwdTqBRs2FbLlXbiPdECMCHadj/AaDXZNFqedCIvnRcS4UpRo7+hC5zUmw8Ope9wUFinvpmZ7NKt2RTmB4hKZo6n8qP4Oq1HBkKlVYAQBrUlziB0XQSif4YmQhksgNIJk9iaLhPaV9b/Um+uJSCdzyDbGZQRSkvjo+n4JNxubGUSsCj+ZCpODYjkGMAND2k7exUsfhkCd+29yguB88Wl7FW/o6tT7/gcXqAgGv7hhx1LWBireHVn79YP6ChQ3njb/eFlfWqGqT3H3ZlGIhGI2i2UO/U/wkwAAmoalcxlNA1AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-ai{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAk5JREFUeNpsU01vElEUPTPzZqBAQaSFQiJYUmlKYhoTF41L3Tbu/Q/+AvsX3Bp/gPsuWLrqyqQ7TUxMtAvF1tYGoXwNw7wv7zwYgtKX3Lw379575p5z77O01ohW+/DVh8zj7aYKhflGdG9ZsGwLNydffgVfr19YHvsEa+Zu/nxndob5StQK+dyzvZzyw/gKlmMj7IygFM+xvNcanp4/t5dAomXHBy2UUBOO2MAl/B9/cPb6PULuoHx0WM0e3GvpUOxD3wZAJWutZqYUYmqpSg5OMgH3YQObL59W0/ullpryR3HegkKEqiWBSGV4R3vQ7sIhScTZFTpHx3A215B5sluVY/WWMg7+ATB/lcLsKpTonHzD+OMFEuTz8ikkt9Kwt9YJZB38cpBdoQAZJdLvCGByfoPB6Xdk90pYy6Xg3c/DaWwArg09DaG5lCsUFN0pckZAojdC8m4auBqaALuSgez7VB1RtDSUWOQvUaBLFUzJBMJ2DwmPgd1Jwm0WoSgJfjDvrTKxtwAIyEkAOQ5hU//Zdg5uowDlUNMnwZLW0sSuUuACYhwQRwFvJxupCjEYUUccOkoaKmdOlZnY1TkgAcXAhxhOwLsDsHoN3u4O5JTDfVCH6I9nfjId3gIgSUATFJk/hVevGtOMwS0XwQ3AzB/FrlKg8Q27I2javVoZrFgwD4qVipAEyMlnaFArzaj/D0DiMXlJAFQyK2r8fnMMRZp4lQ1MaSL5tU/1kqAkMCh2tYI+7+kh70cjPbr4bEZ51jZr8TJnB9PJXpz3V4ABAPOQVJn2Q60GAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-aiff{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAohJREFUeNpkU9tqE1EUXZmZpE3aTBLbJFPTtFURtSCthr7UCyKKFJ/9An3og6Ag/oXfoUj7og9asCBYKT6UIPHaWtpq7NU2aZK5z5wZ9xxMpMwZDuewz9prr32ZiO/7CNaDx3OLt6fOjBqGg/aKRCIInp8+KzfKH7fudnVF58nE16el+/yU2mBFSWZKpWJKVc0OgUBo02K4NDmU6o75Mx+Wdu9IUXFeiOA/pn1xHeYaugVDdzpbp91qGlAKGTx8dC19/Wpxhjnsxj/RRwk85hGJC9d1O6fneWAuoztDYSSLe9OT6SuXB2ccx73Z9uukwDwfls1g0xZIY/Ad/Gnyt/XVfbyYrSDRE8PExHB6/8B6QuaxIwRBFMt0iIAiMx+LCys8jfGJEUik2WpZOD2SQf9oDtVqQwopCAiY66FS/om3b75CVS2MlU7AJ2WiJBCZjZ2dJuRkDJZFwFAR7UCBja3fNfxY2YEoCtRCj9em3Tpds6FpJseGCBxS0GgYGBzqw62p84gnYnAI2CSbSbPhEpFAaE2zODaUAlWWwDoS5DheGqbWpVE/0CmqCY9qkEyINBceb2uADRNQ8bSWAVVzIFKomCQim+0luS4yKYlsHlRyZo7EsSEC23K5vAsXh/H92zZkuRvxeBS5nEx2yp2KqhxPoV5TYS/8CtdApylM9sZQKKSQzyeRTseRV2QoAzIYY8jme5DN9fI0dQoUIjANGydP9VM7PZw9p/AiBpNYrdbw/t0yTJqRtdU9UrfJCUMpSJIgbWzsYe51BcViHzLHeqCRqhZ1YX1tFwNfZBxS9O3NWkAcHqR606k/n/3coKAoV/Y7vQ/OYCZevlrmv3c0GsFh06u3/f4KMABvSWfDHmbK2gAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-avi{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm1JREFUeNpsU8tu00AUPXZcN0nzTpq2KQ3pAwkIAnWHqCoeexBb+AQ+ABZ8A2s+AIkdm266QUJIFWKBkHg1KpRHi5omJGkbJ3bGHj+4M1EQrTvSyGPPueeec++1EgQBxHp+/9mbyuriRZdxjJaiKBD3W+u1+p9a856max+gDO8ebT+WT20Ezi9NZi/crqadvn2MQBAGfpCOpqNru2937vxPIpY6Onjccx3Twck9MBiSU0ncfHirXFmZX3Md9wqCUwiEVN/zaQfHt0vfbBe5uQyuPVgpl5Zn11ybL4/i/lkICOw5niQRGQShoiqI6Bo43W2ub8n3hRtLZT7gTynk6gkCX9gAOxpAnxhHZDwC1/aI1EViJolu/QhKRMHZ1UX0Gr1USIEn5FPWHy+/wTokkrQOq2vBaHZBN4hmY9Jwfr4An/teiEB45ZZDwDiMhoExT0N+sYDCuUkkplLIlXP4/XEXdo+RUhdhBSSfUwtVTUG8MIHK9QVqI7D/uY6vr2pwmCPrkz+Tk9gwARWQ9WxppbXZhNnpw+ya4A5HZi6L4lIR8WyCcL6sTZiAWjWgAmpxkn5+kqTamK6WkCwmERmLDLvjB0ML9ikWXPLFuozYOap3L8HYN6DHdbS/d5CeTVBndBz87FCBLYkNTyIjBQemnIEsSY5lYrK1+UoWcToLMjEHAyIQ2BCBSx/NVh+ZUhrqmEqBebS3WyhdLg0zt/ugAaIklsSGLHCLa6zDMGhZ2HjyGsnpFPqNHnY2fmHv3R5SMymYbROszSQ2ROAY9qHiofvlxSc5xsKKqqnY3diRE9h4X5d/pzg7lnM4ivsrwADe9Wg/CQJgFAAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-bmp{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmZJREFUeNp0U+1rUlEY/13v9YV0vq2wttI5CdpL9aEGBZUDv0df668I6n+or0UQ/RuuD0EgVDAZrsKF4AR1a6COKW5qXvXec27PuVeda3bgcF6e8/ye5/d7niMZhgExnK9fbTrm5pbBGMZDkgCyq+VyhTUaT6Eo2ZHJePPWXJXRhez3B1yxmM/QdctXUSCgtV4Py4CvY3cky4e1x5DlLCaGbbzjXDcousG5OQe5HPRSCQPK4PpsEM/XH4WvhS4noeu3JwHGGRiULhsMoKZS4I0GtEIB9mgULJGA0+9DPBpBT7sffvf1W/Lg6OgJufw8C0CRGEXWazUwiiyFQjA8bsjVKjaJzovMD/Q5gxyJhG2cvyeXe2cAuADQNGBmBvLaGuTFRaDfh31lBTWi9pumjbK0B4JQul3vOQpM8JdskOLrdCvDcDjAsjtg5TIkoiKLaokMNR2cnZbqNAMycqG7XbHKR2fMzwO/dsxSwu0BiBJsNsv2LwAJAJCI5ux2gXYbqNetcz5PoORI1cDS0n8AxGW7A+zvEYBKZ2ZlcsEtJLbedMjePBaCTQMghx45ulyWkzxMVUQ2RMQhLfFO16YAqCrixPnm6iqKrRb2W23EfF4cUNSrHg90cr7hDyB33MTnSmUKALVs4uIlROjxg+AsPhGVl3fuIl2tIOB0Ya91gkOi9mxhAal0ekork1ic/kGLBORMxy2K1qS9V1ZQbNThIj2EGh+2tsyOnSai8r1UxMNIBB+LRTTULr4Uds0K1tU/uOLxIrmbNz8XXSrnASSpubG9fbKRyVh1n/zSw29t9oC1b47MfwUYAAUsLiWr4QUJAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-c{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAcxJREFUeNqEUk1rE0EYfmZnkgoJCaGNCehuJTalhJZSUZB66a0HwXsP/Qn+FM+9+hty0LNYCr2I7UVLIW0Fc0hpQpSS7O7MrO9MspuvVV8YMnk/nn2e5x0WRRFMvP/w6WSz5jbi/9NxfP693Wp3DrJCnMW5d28P7a+IE15lufR8o1ZEStwPhkWHsWbrZ+eNEPxsuubEF6m0TBv2Q4liPofXuzveulttSqW2UwH+GjqC0horpSL2njU89+FyMwjlTlxOJMTa9ZQHzDQIjgwdom9zLzfXPc75kbnOAswBJTlC2XrqQRMLxhi442DgB4UFBhgPpm3B5pgBHNUUxQKAHs8pHf3TEuFMetM9IKr/i2mWMwC0SnuSFTG2YKyppwKYVdGO7TFhzBqGIenVeLCUtfURgErucx5ECKREKBU4d3B718PHz6cICGT/1Qs8qpQtGOdyhtGEARWDQFqQJSeDL98u4VbLaKw9IRAJPwjtoJGlVAoDQ800+fRFTTYXcjlcXN2g++s36p5Lzzlve1iEROa8BGH1EbrSAeqrjxEqicHQt8/YSDHMpaNs7wJAp9vvfb287idboAVkRAa5fBYXP9rxO4Mgf0xvPPdHgAEA8OoGd40i1j0AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-cpp{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfJJREFUeNqEUs9PE0EU/mZ2WgqpXX+QIDFdalVslh8NlAOQaOKFAwfvHvwT/FM8e/U/MOnBmwcj8WD0ACEGghIkbU0baaEthe3OTJ0ZWV26q37JZt68ee/b9733yGAwgMbL12/fz+azbnAPY2Nrt7Zfqz9JMrYZ+J4/e2pOFjiciRvXlgp5GzHonXk2o6S8V6k/TjBrM/xGA4MLyeOSPZ8jkx7D+uqCU3Amy1yIYizB36AlCSkwfjWDR4uu40yMl/s+XwjeWThQQ4Z6QNSnSkYykcDXasP4lmfvOZTSF9q8TDBEFPbN5bOqCglCCCxK0TvvZyIV4CIxbgpC+4gm/PUmFCIE8iJPyME/e8Lon9j4HvyHYLjKSwRCSEUgf9+15mFbx8QS6CZJMzJ9SlBCwX3fJDLG4PX7ykcwkmQmJtpEhWa7g1dvNlSwjwelebz7tAXLolh0p/Fxe9fErK2WDFGEgKjxfNjegX0lDTc/heNuF99/HGEslcKXwyoazWNDdlCr6+DoJgrBzdI0T9rYO6yg2zszMlaKM3Dv5OBzbuyZuzm1B16U4Nzz2f3cFOx0Gq12F9cztpExncsqYoaHpSIKtx0zJdVIFpHQ6py29muNk1uTN829o/6SHEnh80HFaE6NjmLnWxUJy1LyTltB3k8BBgBeEeQTiWRskAAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-css{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAk1JREFUeNpsUktvUlEQ/u5DoCLl/RAKKKUvWmIxjYntQtcu3LvwJ/hTXLt16coFC2PsojEaMKZtCqFaTdGmjbS0CG3By+vei3OOBSGXSU7uzNyZ78z3zRF6vR6YvXzzPrMUCyf68bB9zO+VfpROn5hkOdfPPX/2lH/lfiLidztX5mN2jLGG0rKLENIE8liWpdzwP7HvqJqujmvudFU4bFY8Wk1FZsOBtKppd8YCDNu77CZevd3gflfTUFcUhP0ePLibiIR9rjSBpgwAfe4dVcV6dhtep4PH5msylGYLrzeybErcT85FYiH/CyPAf74gObC2vMhzsiRhPhpC6eQUM+EA1pJzILEnjRSuJsju7MJqsUCSRei6Dp3yXqcdGlHZ/rLPazQWGCn8+6YW4pAkEW0SjzUzanWlCa/LgcR0lNfovTEi6lcIkzesnM/R8RlN0INGp3h4DHoDsE5YRvQyiKiRSMzikRAOS2WoqoZWu41K7RwzlOOAVDMMMHhIGvFlRxJFrKYW0ep0IYgC3SDh4b1lTJjNfENsrazOAMAw680mPuW+8lFno1P4XDigRhOiwQAyJK7TbsNS/PaA7giAIAhYz2yRgBIfsVA8wIetPG6FAqhdNrC5u0f+TUyHgyMTDDToEt/ftQsEvW4EPG5OZcrvw0mlimarTXkPfpXPcNlQoGtjACgpryQXsPNtH/nvRXqBJpoKHMzGNkNB0Odls7LNyAYKpUq1dt1iuvB7fRDp9kr9D1xOFwkpoksXusmXaZWFn0coV89r/b6/AgwAkUENaQaRxswAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-dat{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfVJREFUeNqMU01PE1EUPe/Na0uptmlASg3MoiZgCA3hQ8PHAjbqwsS9C3+CP8W1W/+BSReyYUPwI4QAVkAgUEgIbVIg1FZb2pl5b3zv2cHBjsaTTOa+e989OffcGeK6LhTevFv+OJoZHPHOfrz/sl86KpWfhxnLe7lXL1/oN/MSZqonOXU/k0AA6lfNhEFIrlAsP2PMyPtr1AscLpyg5pbtIHErhqez4+awmc45nI8FEvwNaiQuBHqTcSxMjJhmX0/Osp1xr878FxWEzwMinxAzEA4xFIpnOjedHTKpYbxW4U2CP4j8uWxmUKsghMCgFI2mFe9QgHZj0Ba4yhFF+KvGJToIRLuPC/efnjD6+26wB1Lq/xgbSCBXKeWJG/OTdky8cWTdT3C9RmWSGk2XCLlWo4xTNbfN5qh7PpXM72GjZeHt0gpq9QbmH4whGb+NpU/reDQ7hcWVVXxvXOHxzCQopQEKXKEbL6o1ZIcy+LC5g62DY2zsHeC0fA4zndIrHOjvg2XbAQRSfsuy9XxC2qzi/H5B6/68W0AsGkW0KyJPBLbDO0fg3JX/CUM81i0bD6WKe6j9qOPJ3EMcF0tSNsFA6g6alqW+VtZBUL78Vtk+Oqne7U9rs5qOQCjSheJFBeFIFOfVujSUYu3rIc4uqxWv76cAAwCwbvRb3SgYxQAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-dmg{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAn9JREFUeNpsU01rE1EUPe9lkk47yWTStCmtNhFSWxos2EXVhSsRcasuxYV05V8Qf4DgD/AvCK5EV1oFI7iUBqmCNdDvppq2mWSSzEzy3vPOpFFq+uDNfR/3nnvueXeYUgrBWH1/9/NE7k5BKRnuRcfF2qdnmJq9DeF9tQ+2isuMsxXGWHh/a1mEVsPJSI5fSU3OPEj291IIlN49RXz0KqzEQjIeZS/L5Y/3wPGhDxIM/i/A7fZWgVG0t5EaG0ZUa0JGM8gvPrZmLt58QYwv91mfAqCIE0sAqgumBFITGQzpUYhuF0KfRa7waDyXXXolpVrsh/0tgSLDr5I+wUZo1UHCSkAficPzY6juFSmbRPrC/azjq+fkcO00gAqoU7B0ETKkfWbuCTjTYeq5oESAauexcTScX+ZACWFm0YQSLZKhHdr67+/wW0e0dgjYo3sCEXXybYtBDVSHLp2es3IpsILS24c42lkBg6DzRjgRzCDZ/xr0GNRJwwYiWgzt+hYMawleu0V3wbkT+kUirOc7IGJAz68R/Qak1BAlx3hqASPGBJRXpXOv58dkz3eAgQoOm4hyj57NgZm0MHvpBmK6QdUdg/DAg9cRkhicBSDaKJdeo1bdxmR2DtWDDUxl51HZ+QHTysD3XdQO95Gfv06aeGcAdBrY3Chi8lwO3768QWX7J5q1XWyVSxgajiOXLyBG2hzurRKV9lmt7ISNkkjo6HhNyjoK+2gXRsKE57ZIE2ot10Z1fz0Ue4ABVw3NMjnW14rInh8jTYywoTg3EOFpOM4mXNfH9PQUfGlrAwBOs3I8ljbtuMWhRWzIIPrkn+GcYcgIWEowbZ+0qB334/4IMADESjqbnHbH0gAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-doc{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAppJREFUeNpsU79PFEEU/mZ39vZu77g7DokcP04BBSUmiEKCSCxs7Ei00JAYO2NlTKyMrX+CJhaGwopSQ0dMtFEsbDRBgiZEQIF4IHcg+2t2Z8eZ5QDlnM1mZ9+8973vfe8NEUJArfSNhzPG0VIfeIiDRSDkw1cWVt3N8rhG6SdSO2Gvn8dfuueqZwuNZqk3Jxg7iNcIfBbgXD6ZC8u5qffzX8eoYeyDxC77uygKhcouovgVUQj1H4YB2ovNuD9+tTTU0zMVBmG/+C8AIYh8F361DL/yE5HnADKYlVdg6MDAmW7cuz5WGuw+PsWDYGAvbL8ECFUt4K7/AHd/I9c7BLaxinD2Ld5Zo7g78RLuRhlBS2cpWbGfStfhfwCEpK0nUjCbWuGsLciSOELPhkq/YgdY3l6HsLfRcLYf+pHNbH0JigEPkLAyMsiEJ7NrqQzM1i7wyhoMZqOhvQs6Z0ovXgdAJACRoulEg5HOwrOroKk0zOY2BDtVpTF0CU6kLkQJXa+BNEoG0lMSsBBKQXWNQktmoGcaYeSaQCIVWOvUYQAiWZFQtk5mSMoSzEILtBrTfEcviC5bwVwQmoh96wA0ic5dB57ngeoaTIPCdb34zDITYNLOOIeVSsW+dQC+7+NSWx6jJ4tY/rWNV7PfcGv0tBoPTM7M4eKJVgx2FTE9u4QPS6x+kHzfw/mOAjarW2hJG3hy8zIceweuY+PRtREMdzbjzcd5WBqPB6xeRGUMGRzHjWvMmxQ7tiOF1JBN6FiTd6Sy9RuFbHpX7MMMqOD088Ii+op5OUAO7jyeRGfBwrF8Cg8mXuDL4neMXzgFwhwZz+hf7a9d5yu3Z6DTPjVQIY9k7erO7Y63Lvc8ErEeyq6JaM6efjai4v4IMABI0DEPqPKkigAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-dotx{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAndJREFUeNpsU01rE1EUPTPzJk0y+WhMStW2qdVWxUVEQUF0I+4ELQiC7lz4N9z0T+hG9wrdZKUgLqulhrbSag1CKpT0g7RpYjqZmffle5NEKdMHlzfvvXvPPffcO4aUEno9f3Vt4dTp+BXOe+fB0u/NbVpv7h89NU1j1TCM8H7+xY9wJwPHZMbOjRadLAvE/2gToJTiTPx89k+OlVd/LT+0TPIPpO/SzyQk40xCMxBSZ9Z3CoAx5DOjeHT7SbE0XSpzwa8OWB9jINELolQg8AR0EgUKn1PIlIWpkUt4cPNxkTOU12trs8p95RiAXpqaztqou8q6SKQJJmZSqGwsodFsIJk1kcyLYv7IeafcLx4HUNkFF4jFTExMZ0B9DrfD4HUEusYhWs4GPEJg5wly/tBYRIOeDhpEwlS34xcyajdQr3UwOT2MlJOEBRuGNHWp9AQRVXDfQiFV/U5GBSiQ5p6ngBEa5z3fiIhC6g6IMDBwOdoHPkYnHPVyhN0tF7E4QSpr94CEOKELffq+y9Bq+DCJ7rWBoQQBVbPR2O6G4OlsLASJMtCZfQqm0NP5IVWnamdAkUxbyuIYtD7wWegb0YAzAVMkkI6NwPM9xEwHloyDGAmk7AKS9rAS0FKOdugbYeAHPu7OPEM+MY7q3hIKqTFQHmC3XcONc/fxdfMDrk/ew/edzyhvvTmBAddocVRqH3Frahau56qpZDho7+PnTgXffi/gbHYmLEvPSIQBp5JU62sYz13G609zKBXvoOMdYn2zgm7Xg2MVML/4Eu3uPgxhk2gXmNl8v/i2pcXTP8tKdTEcbWLZqDQXwu/l6pfwbEnSGsT9FWAA4mdHv2/9YJ4AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-dwg{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoFJREFUeNpsU0tPE2EUPfOg006hD4rQh8WgbCSwkKgbF2owujaCiQsXxpX+D6MmbtXEsHCLmIAbE6NLo8YlGIxREIshIqVl+mQ6j8/zFVCb4UtuZua795577rl3FCEE5Bl79vPd5LHYiOP7cH1AUWi85ytmvlas1bJ9E5ryBntH3BpuP/X9i7ovkluuiE8N9SDepaLpCcRCCqa/VDCaMuIjSWP25Upl6n+QDoCz6Yh7KKzh3sI2LuUimPtRRyaqodj0MDloYiITSTi+mH29Wu0AUf9CsZPJoW5czJl48LmCc5kIKo5Al67B9gUGYxrun+5NnMlFZ+GKiQADj2a7AquseLIvjMv5KMaSBu4sWVir+3i8VIVKYSby0UTdFU8Znu8AYBHQgVOJEN5uOXi4UsdawwU0FSf6TaSoyw6DRvukPkgGWpDKy4F8a3jImCrqFDFn6rhKPR4VGnhvOTAY3WLcjifcQAsqRfhUc/Gq1MKNbBh9nIAMDjEppocxs9HCMktfGTCwP/oOBkUKNk/qF3pDYC6Ktk8RfWzyaaoKrqdDaBDwya8W1m0/CPCR3kFy7CcnmWQRUJqcRJFUKtTnPCeR71LwoeYF92CYyVnCFZpCTrRtCv5to2St8SOrKxiPqEEA4fkYT+mI0rdoeUiH1XZVuQPpsIKqw2QmfifTsnOABiWySlH9uU0Hh2MqjsZV5LtpPSoGeN9rKnhBX7ehoOSLIIPfnGONXGMMWN7xUfVldYDbjM3mrh5HCDgS17DhHgDQcIU+XbBxnDTn1x1UuQcJ9iv7l5Q5e1zLGri92EDJFnoAgHtcfr6wbbVXUqq193+0z97n3UJt1+d51n7aHwEGAAHXJoAuZNlzAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-dxf{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAo5JREFUeNpsU0trE1EYPfNMmtdoH2kDNmJbaVFcaBVFpAsREQpFwY0bu3HjQnTj1mVd+ANcuC3qQixmry6E0kWFVIQ+bKy2tbFJm3emyXTujGca+4DkwsedfLnn3POd77uS67rw1vC79ek7fZEzpu3AYUqS9tKQGZPLpa3VXP0uFCmJ/8t9OLC3q/uJbcs5bkIybvdHoMsSbLKENRmvU2WcNnTjRFD7ML1WGSPJHI6sA4KRWMAWVDPxLYex3iCmfpuIh1QsFSyMxQO4GvXHHwOJ6XWSyIck8v6HQsnjAxFc7vTj2VwBg4aG78VdBHQFCk+dbVcxMdwev9gTSEC455sIBOu2KLsoJFzqasP9vjCeDBlYqzn4VXXwarGKZN7Crd5QfLDT/7KpBM84c9fFUFjFp2wdk6smflRsKKqMa7EgfJJ3Ac2OKlit2pEmBTQfngdpnupoU7BUtRGiiTe7fXiRqmK+KuDn6TpvYogmBRJcrOwIJLIWxmM+dOsyLKryQAaJpjJ1/AxrGO3SqdZt7kKZJrzJWBg5piHENuY8vV6e0UOye1TyftvC5l+gZB8SHJTwpSx4q4JeTUKaxhXoR57h7Rn+3iFolJ3xvPhab6HgJG/pJ7jsNP4sUX+jZiCgEsWd/DjH5IrSYpBUAr0yHpzSoXKOP25a6OBhndh0zcX1qIYM2RIbu6i0KiHD5B/GTMHG03kTGpEL7H80wHFOWwhqDZ+SpkBOtCDYJDhZE4gRcKNbYynAqbCMbXpwpVPFbEng0aKJGbYzK1p4wIegLlcEPmdt+DjXbzcsxFlCynRwwVAwW6hjqeg0Zt521SYCWCJvbe0Un29UDx7Hgrs3IEitHXkw3jOv2fl92D8BBgAJeyqBh90ENQAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-eps{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNp0U01vElEUPfMFCEVArdoSqEA0KV246UJdUJM2Lo2JK/9FjXu3utJqTNz4D9worrsQExbFpAFT0TYp0CZ8pIAiyMfMvBnvm2Foa9uX3Lw7c98979x77hNM0wRf7ufPsq7Z2SQYw2QJAkDxQalUZa3WI8hy3gmZr15bu+z8kILBkCeRCJi6bufKMji0NhwiCQR6iitdatTvQ5LyOLLEiWcYukm3m4Zhmbq1BX13FyoxuH7xAlbvpqKRK1fT0PWbRwEmDEyiy1QVg/V1GO02tO1tKLEY2PIy3KEAlmJRDLXb0TeZL+n9g4MHlLJ5HIBuYnSzXq+DlcsQLk/D9Hoh1WrIUjlPcpsYGQzS3LWoaBhvKeXWMQCDA1D9pt8PaXERUjwOjEZQFhZQp9L2yERiqYRCkPt/z58ogTGqHQLE1BLgUmC6XGD5AlipBIFKkbhanKHGYLBDqQ4ZED0OAbfLlo8OIxwGvhVgyTHlA3xkomjH/gegBgDURMv6faDbBZpN+/tHkUApkdTA/PwZAPxntwdUyjYA/+ZMqJHjLgM9iv/6zRt2GgMaIE21aVIjnSm0DGPfmhzyde0UAE2Dj+p7urKCPvkZku9eJILOSMUnkvVhIo7GYIB3xSKYdhoA1erXGVKXpvFxZwdBonnD68PQ7YEwM4O4xwMPxc8RYE87g4FIcz+kvfmnA0YzIJIy77/m0OCqsTkkCTysKPjJG3viLei63Gm3kCO6UWqcMejjxecMPmxsoFKtYop6UNirYL9Wtc5OHqzznIXHq1na7OfMJROcK8a6O7MjW7nfzZdrd7jzT4ABACh3NGsh3GcdAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-exe{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAo1JREFUeNp0k8tPE1EUxr+ZzvRJO62lUAQaKIQ0FVJFjBBdoIkrDDHuXJi4NnHtX+HCjW408Q/QmHTRaCRRohIJifgiiBICTQu29mHfnc7MHc+MlECKdxZz595zf+c737nD6boOYzxJLC6Nhwej7e/24HkO779s7G6mMjcEwfKZ21+/d+em+RbagaFev28qEpZwzKg3ZckqCPH1nfS8hScIdyhBe6JqTG3PfyTTeLrwFhvbKdy9/xi5QglXL0yGJsKDccZY7LDIAwWHpSferWBh+RN8ni4UylVER8MY6PHj0uSpUK0hxzfTmWsUtnoEwO3rer64jEyxim6/Hy67DXaHExvJX3jw7CX8XjfORUdDlOohhU4fAVjILCPbm9V1yIqK2FgYt+ZmsZcv4lH8Nb5upXD7+hVMjIRQa8qeDg8UTYPU5cTcxSk4nS709XTD53ZhpD+IYMAPj+TBz93fZiz5oHV4AP1fGdlyHZIkIZkrI7GyhnK9CZXy+Aig6p1+HQAY003AcF8AVtGGfLWG9XTO4MLZ5cL0WAixoT4zVmPHADSiMo3hzHA/xgeDWFjbNg8H3A7kKnX0koEcPdTu/ylgRGZgOjNv38zoSXC8BZJDRKOlwGEV0VJVGM0y4joAPO1spXbx6sNHeD1uRIYGUCxVSRlDt1fC8rfvcDnsmJ+dOaLgoAs6AVLZPJJ7WdhEkUyT8GJpBflSBcVKDTvpDBw2GzQqQT1OgaZqUOhtFQUTUKnVTVWNpgy51YLVKph7sqKYkA4A1ScEfT66vm5kC3+ofh6Xz59FQ5bpkvE4QW3M5Apoyorhl9ABIKnFgNdTOh2NkJG6WSf9eRBJtmFwLDJmriUzeaOkYvvcXwEGAIVNH6cDA1DkAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-flv{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmtJREFUeNpsUl1PE0EUPbssLYUCXdpaC9gWoSTgAyFigiRGY+KjvuuTr/4A44MP/gx/gMYfwIsan0RjIjGiJIZgSIGFIoXSD0t3Z3dnd70zpITazuZmJzP3nnvumaMEQQCx3jx69SV3a3KWMxetpSgKxP3m242Do43SQy2k/YRydvds67n8a63k+FRSn7l/bdg5tdsAuM3he/5weDC8vLdqPLgIIpba2niux52mg//DqlsYSg3iztO7mczN3DJ3+ByCLgCBH4hOFEF7cDpzPCRyOpaeLGXSc2PL3HbnW3XaRQCPEgWI2MsRVAVqrwbX9bHxbhOKpiJ/bzpDOr2k68V2BtRNzMtqDEqPejY/4zSGjb54BM0mQ8k4xsDoIMauXxnqYOD7PmwScP31d0SS/eAuh1lrolFpIBQNQw2pqJdqsAlIceB1AJCIkkE/FZskXDQVRXw6IYHiE0nBEcaPXSSvJnGwWkQXAE4acAhbxPMJpOdHweoMhc9b2F8zwKizbdlyPLVH7QLg+JKBYzoorxzjz3oRzUoToaEw9KyO8XQW5AE5jrFT6AbAYVVNxCZ0Ka3So+DSTAoDiej5ywTySbls1OEDobhFlMcXxrHw+AbINEjNXgb7y6BndLhk8cRkHHbD7g4gEhiJFxsdhrDqaamBaDKKerGGSKwPI9kR9EZCaNA5ubE7A5s8IFhsrxQkgJhZoa/06xC5xRz2v+3BOjFlbqcGlquxsondT9vY+2pAJdeZR6fI355CgQCN2A4O1w7gkQ7cdLUOAKdhV6uFSv3kd/n8mT68eC8dKWLnY4FsfeZQh7nVVt0/AQYAsf5g+SvepeQAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-gif{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmVJREFUeNp0U0tPE1EU/trplAqlL0laiw40xASByEJIZFGVnSvj1j+gWxNXJq7VrbrwF7h10cSNhMRHojEuACVBKmH6SJQyJeXRxzzv9dyZPiCtN5lMe8853znf953xcc4hztDzZ1+C6fQMHAfd4/MBFG+p6h/n4OAeAoGNToi/eOm+A50LKRaLh6amoty2vVpZdotNXccMEK3LwZxa2bsDSdrAqePv/mLM5tSdMwYBYqyvw9zdhUn/L59P4OGtG8qlZCoH254/DdCdQBCxqZu+ugqnWoW9swN5ehp2NotgIo6bGQWGtaS8+vQ5V9a0u5S+1gfABEilAqdUgm98HDwUQkDT8JXoPPq+BoM5kCYmFT9jryn1+hkAt7heBx8dhbSwACmTAUwTgdlZ/CVKJaLnI1GD8TikZiPSR8Gxib8chH95mZTxgwWHwH7+gFMswqcokIRbjMO2HDCnZ1VvArpjEmnKZc8+cZJJYGsLsMiZ8AgwEqaY6Mb6RQR33JFhGECzCRyfAFXNu9v+RVNRZWIMuDJNuYMAaDycUFGhCOgtuAtFVDA83G5A8TrFDw+F5QMAxAKJJxz2xnW3RPJGbm+rCyjotZetH4DGzaSSeDA3h4Zl4R0JOEZWTpIzF4n/m995bNdqZwB6m0gFft3Ak6vz+KYWwFsGlqIxXItEcDt1ARMEtKdVgZb+fwA0G2C2hXM0ZTZNRcSf0b1pmXi7uYnjI+Lfanm5fRQsK8BIxKcrK7i/uIgP+Tw+FlREqHN5fx/vyU4uHBE6UO4gDWqk/JFaLuMxcXeFk6TuJ90V0HOk1in7J8AAjmgkPfjU+isAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-h{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbRJREFUeNqMUk1Lw0AQnf0woK0ttVqp0hwqVCl+UBERT94F7x78Cf4Uz179DT14F8WbYHtRkBYRLNqDtdaPZLObuLs1NGlXcWDJZGbey+x7QUEQgIqT07PL5WKhHL5H46J+22q22vsWpbWwdnR4oJ80LNiz2czGUjENhvj4ctIE4Wrj8XmPUlKL9nCYcOFzE9j1OKSTCdjdrtiLdr7KhVgzEvwW6krC92E6k4Kd9bJt57JV5vFK2KfRQRV+RAMkzxglYI1RaDy2dW1rpWRjQo5VGicYIorWVooFvQVCCAjG8Omw1MgG8AM0uSBUDSnCfk/IGCHwf3DCD/7UhOLBrFkDuep/hDUSSCv1iYo4rIfqGwmUSNJjfYbBcQKhZw0aBMA4B48LwBhBt/cON80HmM9NQ6fXg/Wlku4TwmNWDzaQqzHG+0PSKod5cH5Vh2RiAhYKc8DlV1UPSyuFMGygVlMg1/P6BC6DqXQK8jNZDXAYA1f21V34wMXYFaiyVw0rJyzLgs3VMkxOjGtix/V0XWChZ0cI2i/dzvXdfTd0Qf91BMPrhyNzgKfOmxaWypqaDXHfAgwAtCL8XOfF47gAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-hpp{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAehJREFUeNqEUk1v00AUHK/XKf1yZdESVRBXjRSRFqMQVBA5Ic5I3DnwE/gpnLnyG3LgXglx4UDDLZS0RWkDLiRxSusk9u6GXSembmLgWZbX7+2bnZl92mg0goo3b3ffO/ncdvyfjHef6q2Dlvs8Q2ktzr16+SL60jhhZ69bO8X8ClLC7w9XdKJVG8fuM0r1WrJG4gXjgqU1D0MGc2kBTytl+7a9XmWcl1IB/hZKEhccq5aJJ/e3bTu7Wg1CVo7rNLlRhUh4oMnXoDoyhoHGyWmUe+QUbELIa7W8CjAFlMzdzeckCwFN06ATAn8QmDMMMGlMuwWucpoCHNe4jBkAMenjYvRPTyi53JvuwX8AplleAeBcRFrH6rXIxLim9I/pi3QA1RhKaYxdjkN8IwalCMIwWs9ljMkh0wzk+9M7w179C3LZNXxve2h+c3Hu91HeKmD/6zHOLnw83ilB1/V0CeqU3Q81LC/O41b2Btx2N2JVP2riR8eTUxmi0TzBwrKZMsqMoz8MsDh/DWuWhUBKURLKxQIeOMWoptYPnS1c+INZBkwISomOSsmBZS7B+3WOzZvrKGzkMAiGqNy7g+LmRkRfekBnANy2163PZXrSbrQ6vch19Xz8fPDHyL39QzkHBKedXjfu+y3AAGU37INBJto1AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-html{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmBJREFUeNqEUktPE1EU/mY605a+hhZTBNKRDApNrWIRA4nEBUZdmCgLNi4MK5f+FNdu3bFv1J1EXODCR1JJSMTwpqUP6NiCpe10Zjz3hj5Mm3iSybl37jnf+c53jmDbNpi9eb+6Ftcisea909bWNzNb6dwzSXKkhIt/r14+515qBqmDA8HpqKagh53XaopblpIbe+knDpFAhPab2Dw0TKvRK7lmNODzePBgZlK9oUWSpmVNdpIU8T+jaMsyMaD4MDcZVa+NhJMN00w0n6V2nN3yQgdHWZag+LzYPTomIAtT0THVtPGanmb/BbjwLFkvn2IttYGYplKyDzsHh7gdmyAWfh5zVq0Guhg4RAHFUhmfvq3j134aXo8bd+ITnMFOOovU5jbGRoZwNxFn1cxuAIcDW/sZDjA/c4u+BNxOJyxqaenpI3z88gMfPn9Hv98HQZS6RazW6kjExvFi8TGdDSy/W0Emf4LS6R8sv11BmfzSwkPcm74Jo9Ei0GZgmkw8QCOao8OXcaz/5vSZnPdnp3ApqBBLkWJE0Ci7ASzbIhCLLQ1E0iOkBDh9NpUgiUejo8oNuJwyn0YPABtn51UYFFivG3yBGCNZkuDtc/MW+ZQI3OrYpBaARCKufk3B5XIiWyhiL5ODp8+FfFHH+KiKSqWKUL8fC/NznGlPBmz+24dZjKnD0CJDcMoyW0SqXuMtHBFw7rhIAD1ErNUNafxKBNevapwu65NpEQ4FqXIA+RMd6VwBP3cPSERb6gLIFIq61+UqGWaFdcrVt/lmAuWjAi2aiMFwmOYuIJ/N6M28vwIMAMoNDyg4rcU9AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-ics{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhRJREFUeNqEUkFPE0EU/mZ2dra7bLNpi2AxQFKalkJrohICiYkXPagXrx78Df4K48GDBzmQePLMhUODNxQ5ciEkJVqDtJGmMWrCATRbd2ecoS5u3aovmezsvu9973vfPiKlhI4XL7c2r5YL81LIELEghLA3u/udxmHnPmfGW/Wuv+LpwwdneRYBx7PeWK0wOYYhcXxyckGV1fdbnbuMsXcklqPRJQxFMKz4RxDCtVO4s3xlRjWoB0FYjlQPEEBieChwKCRGMx5uLtaKs1P5ei8IKlGa/YkXMXYtlTEDlsnw/mMXhBJcqxSK6vlcpa4PEpCooUyIqs5M6hG1o2CUwqA091cFcYLf/sjzcX75EiQIojI9779CTYR4jwTBf+r7GAwh0AxCiL6JMT/04vQ79u8aI2O/7Jzg69o6Go8ewycUahtBpADhHKLnK/eVbkMdtROWIv80NQ2sPhncA9Htwn+9hZG0rY6DzFwJl+7dhs0ZstUy8rduwPS/wd/ehmi3kwq4zTHiWUgXp+EuL8FvNvFl5Rn4xAS86iyI2kY3n0Mv48ByrOQmancdi8I0Kcj3U5iuA29xAelKCUHrEIayzltagG2E4IwkFaQgSC6lYI09iN0d8It5uNV5nG5sgJdKYC0G8WoTOZvBISFNEBxnsuzD3GX4vfDsszzqAu0jkJQDedCGbB6AWg54pYbPo+NGVPdTgAEAqQq70PytIL0AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-iso{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjlJREFUeNp0kstrU0EUxr/k5qbJzdPYpGkpsUJoA2q1oLjTdiGiIC5cuXHlxv9BEOrStTvBnQvRrSAIsejCrlqpsURq2hCJNQ+TNLm5uc/x3MmzJh34mDNnvvnNzOE4GGOwx8+t9XQkfn0VE0Y5/7Z+kHm+dvOhtd3P9c/xwNZh7nWaMYtNUmX/Fct/vlN7/8J5aRRgyzm8xzpRDjGE2aVH4VTqdnoUYg/XkEhmy+Cx3DhA5tMzdFolvg5Mx3Fx9SmH0JIg79Zo3j4GADMIokJTKtjbfAKXU4Y/2NvSfyH75TFOxa9Cmr0XnlPFl5ReOQ6wNMDsoFX6AElqQlNV1KsOuNwS/AGFjEUIDhmn5+/DMM16/9igBowAzFKIswPJr6MjlxFP3sV04gaP7RzMPe6xvWM1gNUBM2UKYlBau3QghGphg29J3gDlLLilWNdD3gkvIIDRhD9yGe2mCV0V4HFXuCxT5Dlv8Dz3sIkAs03FalDxBMQSt9BRBMhNncuO7dyU28c9tnf8C/Q0ZtR4GImeQSj8APLRH772BWcgiFODffCv/t8H9tO0v3RjV7VqkeeXLlzDfvYjj88uXhl4JwIsrYxmLY/M1gYclIvGE9jZfNPrSCD3/QgLyeWTADV6wW9AryIcCkB0u1Aq/oCPumlufoF72vIheaLDr4wCLIOqrYnULA14PSoqpSJEAUilZrD77Sv3LK+cI0+Be8cAbbmAOrob0agtD491LYfkoqvnyZLsWRkA/gkwABL4S3L78XYyAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-java{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjxJREFUeNp8U01v00AUnNiOEyepQyhQobRBSlVIoRCBEPTAjQsSEneE+An8FM5cuXLNoQduIAE3qopKNJAIIppA2jrOR93aa6/N8yZuUxyxkrXr3ffmzczbTQRBgHC83nj3ca28dD36nx6fvnzrNNrdp4oibyUmey9fPBezEgWVFuYLdyvlPGaMY4fl1aRS+9pqP5ElAkmcnknRwuO+Nyt5u/ETYfyj9WrpZnmpxn2/Ok1Swn/GvtnH5k4TLue4kNfxoFoprRQv1TzOb8cAIu3+ZD7oD/Hm7XuxzqRUNDtdkuLiTmW5tFxceBXlnXgQTAORSMt2oGezUJJJrK9dFWdEH7Ik4dB29LiESeUEJXd7/dAT3L+1ivlCHr8NEzutXTBvbJPPSdO/AH5wysChwM/1HzCGlmAzOrKxu2eCud6Z2Jke2MwThpUXL6Nn2ZAVFTlNw70bK0iRnGAq9qwHtOmTRpsx1NsHyKRVnNPnoMoK9kc2BjbD4vk5JGV5NkBoEPM4FFnCteJFWOS4ntHEfphQyKaFTWFLw704AJ26ZFx/ZEEi3YyY0O1Dmr4EKTUHA8hUnS6siI0DEHLYog+b28RCRuNXR/iQUpPUEQ+NVht6Lodnjx+GXYgDSFRnq97Ed2pXSlXhUSeGhxYc5sKlNXM5DGLR2TMwfZVPAIi+otGNWy1fEZUKeo4qc4ysI+F8VksLIJfYcD9QYgB/DNPMptWBlsnBIS86xmDMTBo/PWd0LB6VZfdEbJT3V4ABAA5HIzlv9dtdAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-jpg{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNpsU8luUlEY/s4dmMpkWxRopGJNNbiwhk1tItbGtXHr0hcwmvgOdWld6Bu4coXumtREE3ZKu8FgOlC1kIoXtC3jPfdc/8PUIpzkBM7wf+f/hsts24YczuerGUc0moBlYTAYA+i8sbdXtAzjITRtq39kr73s/Gr9DTUYPOeamwvYnHdrdR0SnDebuCbswJGqpX+Uf92Hqm7hzFAG/4TgNr1uCwEJ0trcBC8U0Kb1/PQkHt9JxSLnL6TB+Y2zAIMOJBGLXmtsbEAYBsx8HnqCGKVScAX8uHf5EpqmGXv18VO6VDEe0PXsKABN8+AAgiabmYFNNJTDQ2RUFc8+Z9G0OPR4PKYwvKari0MAgiY/OQGCAajhMNR4nDZMaInrKBGl70SPMScck1NQG3X/CAWLE3/dAWV5hRRVIJxOWNksrP19sFgMqqAebUGYHMI6teq0A9oTVAhqu2sfbYYjsL7lCZ3683gA70T3TK7/B4BNoO020GwB9TpwfAz8LgMtWn/NkV8EHgoB81c7nYwCyBZlEVkHcqMTKFnkmehJTOPvEfCnKi0fAyADJKfXC/h83TaZTJjaa5lANLpOFqAXtlEAorAwO9u5syT5UxLfU0e3o1FMu1x4u7ODYq02BKAMAVSrSNLrK1MhLPj8mNF0vFm+C1ZvwKBwXXE4AGn1WAASazESwUW3BzUSMeJ2o1Aq4sPurvQYSRLwlhRR6mSaYyi0WlpAJrFRx3ouh5/lMt5lv8BLwXp0M4lSpYL17e2uK5wP6lj/c2ZPn2RI+YT8fDvqoyegVLyfG5kBKaQQOfvF2pLc+ifAABiQH3PEc1i/AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-js{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUQ5ODY5Q0NGMTE4MTFFMTlDRjlDN0VBQTY3QTk0MTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUQ5ODY5Q0RGMTE4MTFFMTlDRjlDN0VBQTY3QTk0MTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRDk4NjlDQUYxMTgxMUUxOUNGOUM3RUFBNjdBOTQxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRDk4NjlDQkYxMTgxMUUxOUNGOUM3RUFBNjdBOTQxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoT8zQ8AAAJdSURBVHjadFNbTxNREP52t7S0bktbKFAvTUVaw60YqkExUTD6oD74qC/yD/wp/gh885XEEI0RAyYQUiMpIBGMkYR6o23abi+73e2uc04v1LROMtnZPTPffvPNHMGyLDB7sbJ2ciUSli3U35smkK9t7x9v7n2dD/g8KUkUwWqeP3vKz23NxJGzgwOx0RC6mSgIo+WKuvP56MeUzy2nJEk8PWsGJVVTuhWbpgmHw47FB7d98Wg4mVWK52o1sxOg3Va3PmFp+Q2PdUquaFUM9/vw+O6cP3bxwm46Xwh1ALR3/vL1e+hGjcc9koScUsTSq3coVDQsXJ3wzo5HEs3clgZNMTVdx1T0Ep7cn6//QRQwMhzA6uZHLD5cIFEFSKIU+G8LK+tb0KsGZKcTJoEyP08AbpcLy6sbPKdQrigdAGaDwWxsDH1uGbliCYIgcM8WFPg8Mq5Pjzdyu4jYbCE44EepXMHuwXe+A8x3KKYxYsjvbUzmlPGpBmYdgI1oYjSMbL4Ao1YXMkcM2Dd2xnbAamPQAqg1GORLZdycmYTdJqFKk2DPR3fmwI4zBDrg9RADqxPAbPBif2WTSB584/3/TGegEOit+DRcvQ4OZJi1LgwIQKVCg2i6nb1I7H3Br3QWqT9pBAP9uDY5xjdSM3RqxeoUkfVnEOW8UkLykERTNXjkM7h3Iw6NNvHw6JjuhAhVrba0+QeALozcI9nQR0VvNxJc/ZmxCNGvIBQcpDG6udA22kyW29HC72wu8yG579ZoiSYuR/ly2+y9CA4NceWLmo717T1i5ULqJNtapL8CDACskxPFZRxLwQAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-key{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlZJREFUeNpsU11PE0EUPbM7u/2AtJUWU6qiiSYYo5EmmPDCD9AH46sx8cEnja/+CB989z+Y+MKPgMiDsYQACcbaWBBogYD92t2Zud7ZlQZsbzKZ3bl3zj3n3IwgItjYeDO3MlWme0bjUth8e8/fO2tHzx3XqUEk50uft+Ndnhdmc3SlfNPkVZT8Cy600DoIISvVfKYtlvfX1p66XmoIYsMZdjJQWvEFbbsC/S5g2QhSkKUK7rx6OzvzqLpsovAhaAxA3DUBQn2TUFsl7KwTfm4Z9DoO5LW7uPXi9Wxpfn7ZKF09vyPxX2iWcNRkKGZz0mQWKoNs8AVB6x1yRY2pYnc2LLofuXTxMgAlmlXIfngCxNxEzM+DPv6NQa2BygLgZyX6JT83ngHTN5GAL0WSoUQkSQnXkyBh/k0GegTAaldM20sTKvet+yyhIZApECamL0jUSe3oFChx3TopM4TeEQP2gc6BgGIwb4KGNXRhCkMGxgg2kJeybRiZM45D8W61qEAknSmpHStBhywu0nFVupSCTAcM4ECwqapv+NQ6LS9JGALoMIIoPYDjZiEL1xHtbyO39AQUDaA7R1AH23DSeSA4hv5RG/VAhxomPYP8sw9A4TaC9iHkjUWmrtGvbyC18BLe3GP0m3WW4I5hEBEnPIStXzyuFIxb4EkMEJ79Qa/xHbKxCdM7xeCwzUZOjgEwnuzt7qLz6T3cySmQP43uzjeIiTJM6io6W19B/NLCKMVGCzkCoLR/0lrfOI2fNy/huKC1FTsK/rbGNeMRC8dHpHByfu+vAAMAL/0jvAVZQl0AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-less{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjZERjZENTJGMTE4MTFFMUIwOEVERjQ5MTZEMkVBREUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjZERjZENTNGMTE4MTFFMUIwOEVERjQ5MTZEMkVBREUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNkRGNkQ1MEYxMTgxMUUxQjA4RURGNDkxNkQyRUFERSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNkRGNkQ1MUYxMTgxMUUxQjA4RURGNDkxNkQyRUFERSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl1w97IAAAJhSURBVHjahJNLbxJRFMf/wPAIMIxMkUI7tS0VYqlGDLGhjdKkqyZ24cJFN925de+XcONHaHRj4k7TND6SGo1VWwmp2kSLhlqMDbQ87gzPYcY7k4GgoJ6bmdw598zvnvM/95pUVYVma+svcovx8yMnFZHAMJPJBJfDzq5vpX6+/vD5qo/z7DOMBdo/d26t6jFMJ3iY51jBz4M+LP6wxEw40Gy23qYzB3HO7fpmpZCOmfEfa7Xb4NxOrC4lvbPToe2yKE3K1PdPwNOtHdx79ESfq4qKkijB5/XgevIyHxEC24USmewDqD2ABxubaLRkfW6zMqjWGlh7/ByyAtxYnOPnL0Q2+gGGmKRaw8zUBJaTiS5QOO1FJnuIAM8hciaIWHgi8NcSNt+loVDY8JBXh2ojJAR1HbTSNFMUpV8Dxcjg0nSYBrtBxdLbqI1iheCUh9XXNGurAwCdEkb9QyBSFam9TDfoPZ1LUg1BH28IiwEARTVAQOzcFKRaHZpLoa9avY6L1Gfs0c32t4PU6W2lWsV8LAorw0Cs1nXftYWE3qZGqwWHzYp2zzlgetuolVFvtiDLbRRKFTAWCxx2G/KlMtXFhWPqOzsWHJwBx7rxKv2R7mwFz3lw9/5DLC/M4Us2RwV0g3U58XJnF7dvrsBOoX0Abbej/DFKRMKI30fTVGC32WA2m5H9cQQvhYi0vE/7Wdgczn6ARA9QPBrBszcp/XvpyqxebzQ0Tlsq6llxLhe9bD4cFMr9XdjLHpLv+SLGBYHAYiVu1kNOpAaRTWbCejgiw0zGhFGSK1aw+zXbvfK/BBgAPwADAs5GpGsAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-logo{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAEACAYAAAAjlcdmAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjU2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAg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O4qxDy/KPWcv/tsh82bPxyKRSyH+woXBUiwwNcNIYdO5ZbPVtXWLq6DFPsSQ0C4xgDOZkI2p+CNzskdImGjb+rXXHXbQwhkSfwm9LGpMBERABEQgiwloBNDDxT1706bpDUsfuqmkuuZELKTI52igaX5hBiRmyJgyhI7hatVkFT+PAHLBTP+eZju0C7OxmBQKP476Ydp3tGf7ticC9TNOfeCcc3aZ1NU+IiACIiACIiACYwQkABNwJ5z56BNvbHnhuduRGu4wt2nluFKY/oFccWs6kuimy34UgBTJXJlMP78ogjqblpfStzU2Nlgjo5/611cv/JdpXe0nAiIgAiIgAiLwMgEJwJdZeP7rA7++6cyR0ZFfIK1cNVcLm45q8cBMJxeCf2CgEvEDE1j8JgCHuhnPD35+SONmWjhaynA6SN820N/U/G1M9f7MtK72EwEREAEREAEReDUBCcBXM/H0ypLVq0t3PPHUdwtD5V+CaCliOBPTaWHG3iupqbFCM+utwtJST/1wKvtFAEbh59fX3AQR1zFp3EGnvxO3HBFl+BwwjPVs33r74R/8wJIbjjhiYOI++lsEREAEREAERMA9AQlA98yManzquedmN69cdUtJVfW74B+YZwcxNgwbwxGvshl1ViniB/JvLyXdApCjoAOI59ffssd8RJRhXTDiB0E82rNr5wtFleWnPHjeeZu8cFBdERABERABERCBlwlIAL7MIil/nXrfA+/o2bHt94GqmgMYO9BVWjmscrXDxmBU0Mna4baT6RKAzC7C0T6GdWFWFNNip2/DIo/+5qYWjPwtWfaNr/7dtK72EwEREAEREAERMCMgAWjGyeteee+78befQyM/Ki4LVYxEhoyzW/DA9AukfyD9BN2WdAhA+vfRz4/+fqaFWVPykXYu3N0VHtjT/OMV//vty1B31LS+9hMBERABERABETAnIAFozsrznues2FC++/nlPw1UVZ2dl5dfGIMQNPYPhD9cKVYKlyJsDPPcmpZUCsBoOIzpXoR1wQpfN+fFfMOjsehI17Zt98487G2fuuPU47tNz0/7iYAIiIAIiIAIuCcgAeiemeca57z44gEND/7rDyW1046KDUfy7NXChv6ByEds5xYuhY+gSVq5VAhAO30bfPyYuzeG2H5GBX5+9upeTPf27NqxIThr5qn3nXnmGqO62kkEREAEREAERMATAQlAT/i8Vf74HXe/v7+n8zfFobL62BDDxhiKJxy2CKuEQ/WzrJLqagZF3mdHhvv6rPYN6yddeev4FdJfb+/C92oOO9wqDoX2fuvlf9PPr7MT072NrjKb2OnbAsXWYGdnV7Sj+0v/uuQrt7zcqP4SAREQAREQARFINoF9K4dkH1nt2wTOWraspHVHw/9AcH2zIFAc5DSq6fQphR9WGVuhWbNsQTgZ0qGuLqtz86ZJBeBk+7/0GgXgQQdbmK5+6aWJfzB9W19joxXu6oSn3qsF5MR9nb/t9G2Yvh4eGBzGaOGvFh51xNdvXrTIPBK005C2IiACIiACIiACnghIAHrCl7jKTCvX+PC/rg5UVJ6CIb18ho0xFYKcSg3W1iKjSL0dPoW9Yl2Kvz4kzRgeHIyro0XBIMTlbFsEOllK2C+s0LUG29uNw7rY8fwQ1mUUSrFnx/ZltW9+05l/ed/7muLqlCqJgAiIgAiIgAh4JiAB6BlhYhs4+5lnXtOw6qlbg9Nq34hp4Tw3YWMYNLkMsQMLse1vacEq3MSspQhUViIu4QykbRsa8/PD1rTYYV2K6ee3a1tJZfnp93/mM6tM62o/ERABERABERCB5BCQAEwOV8+tnvzHP38k0tt3XXFl5YwY8uW6SStH/73J/Pq8dMptm/YCD+Q5Dre19mCa+Kv//ubFN3g5vuqKgAiIgAiIgAgkjoAEYOJYJrylU1auDA5u3PQdzOtemF9UGKAQNJ0WTnhnDBscS99WYmGqODrQ1PD7acce88U73v72+OagDY+p3URABERABERABNwRkAB0xyste5+1du3MxkdX/iZYUfG+kZHRfISOMV54kbIOY9SxoAjp2/KRvm33rifLF8w79Z5TT92ZsuPrQCIgAiIgAiIgAsYEJACNUaV/x9MfffSt7Rs23hqsrD6U/nhu/AOT2Xv6+dHvsHdPU0N+nvXfD37xiw8n83hqWwREQAREQAREwBsBCUBv/FJfe3Q076Q/3blkNBy+vCAYrIohbMxILJb6fuCITN9WwLAuvb0DA91dP1x+0Zd/iNA0ZjFh0tJjHVQEREAEREAERIAEJAAz9D44Y9Wqis71G3+EtHBL8kbzCqMu0sp5PWU7nh/Tt43GRnoaG/4y+53HnHvrUUf1eG1X9UVABERABERABFJDQAIwNZyTdpSznl13cPMTj/0uUF19FKaE8+xUbIaBmV13yvbzK7JTuPU17F5fVj/3k3ef/vEXXLejCiIgAiIgAiIgAmklIAGYVvyJO/ip997/3t6mhhuLK6vnxJLgH2jH84Of32DLno6RyPD5D110wW2J671aEgEREAEREAERSCUBCcBU0k7ysZasXl3U+J8NF46OjnynMFhaFg0Peg4bY0/3lgSt4b7eyEBb2y8OOW7RJTcccYR50uIkn7OaFwEREAEREAERcE9AAtA9M9/XOHft2prGx578ZXFF+SmjsVhBjP6BLqeFGfi5AH5+Vn7+aO+uXQ/P/H9vPu2Pixa1+f7k1UEREAEREAEREIEpCUgATokoc3dY/Pzzr2t54qlbSiqr30QRaBo2Zix9W8Dqa2rcWjyt+oz7zzxT6dsy9zZQz0VABERABETgVQQkAF+FJPte+Ohdfzt9qLf3F4XBYK3tHxiNTnqSY+nbAtZQT09ftK/3kocuvODqSXfUiyIgAiIgAiIgAhlNQAIwoy+feedPWbY2FN75zLes/KIv5xcWBKIT0srZfn7I24sVxNHBlqbf17z1fRfcsei1feata08REAEREAEREIFMIiABmElXKwF9XbJuXf3Oxx6/KVBeeQJEYD6bLAiUjPY17n6y9uADT73jpJOUvi0BnNWECIiACIiACPiZgASgn69OEvt2+qOPHzfQ3Hg3FokUxqKxT9x75ml/TeLh1LQIiIAIiIAIiICPCPx/9LZZ0UZyLiQAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-mid{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNpsU01PE1EUPdOZKWUotKUKFLEWkQ1EASGGxGBi4sIVrt27IixN/Cn+CxfVnQsXJiz8IAoqRBGEaMUUWzofnXkz781436QDkjKTyXuZe96595x3rxJFEeTzaKW6dmdpfIoxjuRRFECGn7/4Utvarj/syWgflU5s891qvGoJePJasfBgeSpnW+yEIJVS4DEBx3FzGT2qfvh0tJxOE4mCU0yy8X3BLdODRQTJZ5oMzYaD0UuDePzkbnnx1mjV9/lMp+izBKEIwQMOzvnJGoYhhBDgFKtMjmBl9XZ54WapSjLnknMnEkQYgflCVhKXLt+/dRMy2d5OHdVnPoxeHUtLV8u2w5/S78UzBJwLMC8gAsosIqy9/ga37WNmvgKVKmEkb7JSwI3pIdRq1kBXBZJAUKkb6wd49fIzbJthdn6cIhE0XUWbyP4cmshmdZAE0eUBD6gCN0DtZwM7Xw+RUlVEJCui7CmyPaS94zC06ZMedREERNA6djBWHsS9+9fRS3p9AraOXbhELMlUQju2G2O7JAQENk0XhpHG3MIVlEZzaDbdOKO8jWy/TraGsMmL4L8KTgnIfcfy4JBWeQNp0j10MQtB4EJOg6qFMI/bEH3pGNtF4LOAjHMxO1dGvW4jXzDi7Iw60TB0jJRyONhv4MdunbDneMA6BMPDA6iMFzExcQH9AxkUiwby+QzevtnF2OU8lBT1i8fOa2UO1/FwdGTHE2STHM/14+vlPOz0RxibKPfn9AHXZHBzYx866ZdTKkuVndhHuqenS1h/v4ffvxqyvbUuAtPizZ0Dp7X1fTs+FA9cMnWd4ZG90NOjomVFzeTcPwEGACDGeYddZX86AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-mp3{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnxJREFUeNp0U89PE0EU/ra7XWxpSsFYIbVQf9REFBHkYBRIPJh4wrN3DsZ4MPGP8b/wUCIHEw5EY0w04o9ILcREGmwVgaXbbXdnd2bXNxPahGyczebtzrz3ve99740WRRHkWn5cebu4cH6SMY7e0jRAHr9c3WxsVvcemmbys9yT6+uHJ8oaPefypdPDD5Ymh5w26wMkEho8JtDtuEOZFCrvN/4uJZNGH0T59D58X/C27aFNAL3Xthmsww5GCyN4+uzu+OLtQsUPxPQx6ZMAoQjBAw7O+bEVCMMQgqygs+LFs1h+dGd8bna0QmXO9OL6JYgwAvOFZKKoy3V44CgNfv7Yx8oLH+lUEgvzF8Ydhz+n41snAGRG5gUEwClzhHdvttFxfNyYK0EnJozKK5eGcf1qHo1GOxtjwI+pfvm4g/W1qtJgerYE2SXJSIL9+W0jk0mCShAxDXgQKgbNXxZq35vQKCiKQkSUXdc1+gcch1FHGPmKuIgBCdc66qJQHMG9+1NIpUylxxHtuW6gEiTIu+N4yjdWgty0yTmdNjFzcwKjY0MU7MLt+IjoSad16FoIx3b/A0DZ7FYXnsdpAjUMDOjI5zPgfoBsRodhhGhZHfBBU/nGAGRtxWIOg5lT2NtrI5dL0SB5KJzLodloqXaOEatPGztKq5gG3S5DNjuAK5NjKJfPYKI0okBkSdemCiSgS/rkQNLSePtxBj4LSCwfFtE0krqqX7ZVMnu9XlMXy2l7ME0dzA3iANQyY6vWxC61UY41zTyNcYh6/QCNXQvzi5dR39nHVq1BUyuMGAARsF6tbbe4iKD1r7Om5iFBdmW1SsDflLiuB6sX90+AAQDHAW7dW0YnzgAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-mp4{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnBJREFUeNpsk99r01AUx79psrTrujVtbceabnZs4DYRHSoMh6Dgq77rn+AfoA/+If4Bok+C0CfxVRDBh+I2NqZzrpS1DVvbtU3SJPcm8SSlsJlecsn9dT73nO85V/B9H0H78OLdt/LDlQ1uMYybIAgI9n99OWxoe83nkiz9hDDae330JvxL48O51Xxm/enNtKPbVwAh0Ec6kYpXat9Pnl2GBC02HrjM5Y7h4P8+7FtIFVJ49OrxUnl7ucIdfhv+BIDv+fBcj7p/tXMPrs2RXVTw4OX2UnFTrXCbbY7tpMsA13FDSDAOQ4gJEGUJLs0PPh9CkESsPrmxxEz2lra3rnpAt3G6adgdQhBpmeLkFodNmsjpOPoXBrQTDcmFFNS7i3MRDzzPCw/vva8ikU+COQxm14BBhvJcHLGpGPTOAJxxeLbrRgAkYujBdH4G5oWJWXUW19YL4XqunAMFhnq1BqWYgaY1MAHASQOiU96zKzkU76mwehaOvx6h9uMv7KFN3RopL4oTAI4HRh4wSl399xla+00YbR3yrIzM9SzSqgJJnoKcklGrH08CcJjnBtLLCsSEGGpSWJvHtDKNoFippsJ0ulIsDDUCCATMlBQkNuahEyiZTcLsmFBKaQxaOk53TlHeKkM70AjAooCghBOk9sKtIvqtPqS4FBaRnJSRX8tj2DOh3lFB5Qw2ZNFK5LRo6w4sKt2ggAzywidAMN/9uIPSZglBLDO5FF3mRD3wHE9qVRvoHrUpfn+UEQK0/7ShtwboHJ6jdH8RZxSC57hSVETb7e5/2u0FxqPHJow+8iZ4lYY2QGu3idhIxO7Y7p8AAwALCGZKEPBGCgAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-mpg{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnxJREFUeNpsU0tPE1EU/ubRdlqmnUBboa0UeUQDiUGCC1+JmrhxoXt/gBvXJi74If4AV0Y3sNKF0YUaICqoIfjgVShEiGF4tDOdO/fOeOaSKtie5GZu7pzz3e/c7ztKGIaI4vn9p+/P3h4e4a6Pv6EoQBDiy7P5rc1P1Xt6XP8M5ejXo6UJ+dWbuemeTGdpvNdiNe9YvQLe4Bi4PmTpRmyq8m71rp74BxKF2twIHvAo+f/l1T2Yp0zceHizfOZa/xRnfBRhG4CQqAYioBWeXDyA8Di6ei1ceXC1XBwrTXHPH2vW6ccBBBMI6BsSUEQzakGL6xB0tvjyBxRNxdCtc2Xf8R9TyaWTDOg2TjfVdw6hqIoE9B2GxkEDWlLH7s4ette2kSp0oDRezrQwCIIA3oGHr0/mKMmE53qo23W4+w5S+Q5ohob9X3tgHgO8ULQACC7gMx9mKQP30EW6mEHpYi8xcJEdzMucjfkKcrTfmqmiFYBxCF/Id+gayKJwoQjHdrA5v4HK7Cq44KjZNWpagaqp7QACks0H9znW365ia24DzoEDozOJbH8eVtGShXHTwNracnsG7q6LzsEuaAlNPm9h7DSSVjLyCMkppDI+GS2StQWA1RlKo0X56n2X+6QHkmkDakxF9WMVqWyK+s/BrthYfvWz1Ug+zUDcjMPMm0h3pxEjFma3CbIuCud7oMc0LL1ZgmElpGJtW3B+15HIGNITrMYIlOH7i0U41NrInREylYbu4R5qQbQBaAh95fVKZCnpQCnb9DrWZyrRERS6NDeUw+yHaXh7rt4C4B8y+9vkwn7kwKNRpDoa9aiFKBYnF+RcREqQ2e1m3R8BBgAy9kz9ysCE6QAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-odf{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi5JREFUeNp0UktrU0EU/mbu3FfE1KRRUpWYheALNBURUVy7cy9UkO6KW/+Lbt0IPsFui4gLBbUqFaUuXETUKCYa0jS5yZ2ZO557b5MmTXpgmDPnfOc7jznMGINYPi0de5UvmpORxpjE/kbNqW005DVu8TWw1H758ZfkFgNgJmtyxSPRjJIj0QTW/RDiYGXGb7Dl32/eXrVsd0gSCx9miqC0ooCdp69g5Q/h6OLN0ty5ynIkwzMwUwh2FwMdcbDiCZQXlkqFCpEoPT/wih1YjLInANcD+/Ua9bu3wJlGvrBZCmet2+S6ME5g4oGlZ9A/I70XCDhhDexPNTFmswJBwcnuXkF86VSNZxVu0ukLSGnBcqlnN4HoCQIaIuIv7LUooMOgQ7q75LAAb59B9gCBHSKgqemRr94mMKmD24CfM8nb7THYGQNLpAkUkcb66JyGBFFEWRVL57gFEH5qj8Lxwca2qS3EZaugmzAw24dR/XQgwtsCSBjPIdWbUoE2UJLBnV8Ac/ciWHsK9/glWLnD6K2vgPszsOdOQdfeQ1c/ThKoTgDn9A3KUED/52d45xchZsvorD6Bf/Z60riV3Q9Z/0bbGU1uopYGkfERSQ3VbsMwl0qlqoIARmSoPYXWy0dor79LfBMEEd8jGs/uQ3Yl7PJFNFbuEXiV2riCf88fovXhBbo/vqP3t02/ZYmJFqTkzY160Go9uEMbFK8hR/NrdXtFuUVmnmySVGgO4v4LMAAjRgmO+SJJiQAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-ods{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAetJREFUeNqMUj1IHEEU/i7u7Z23e8tGgneGQPw3hZDkkhQiSuwMQREba4uUgpVlCrvEQhurkCoWqcQQ0oTAaYKNqJygGEwgHCSB6Knn7eXcdX/GmdHVPWYFP3gw78173/vmvYkQQsAwNvckq96UnyIEh7/d4t7uUd/8y+85P+bXSX4grkhI6nJYPW7LrXpBK2YxiSoShhu4Buq1NPofDeqdrZ3Z4cl7D4J3UtA5VyVAlmJoru9Af2ZAp1lcCQ3nqgiuKmbY3l/BH+MnHM9GVLP0Ww3KNA33CQoQQnL834Fj74PUGkANEIkCSSsa8gQqgYTIcB0PVsXB318GInRiCVWCkpRFAs+j5gKlA4t29Ggh4d0t04FKt9PQqF4UFgumSEA8ApeaElilWbYRVy/lsns/N1QBkxtENF4jxPxcgcB1CZVOrvMteK5IQDtJJIGh++PcX9iYwWjXK37+vP0WdYk0Ht99jtX8JywWFkQChw4tc+cZcvlF7rMze+ubbxN40fMalRMDP/6twaiUeK7wlZ0TD0a5hLTWxo2d45KKprqHKJslTsy209s2wnMFBTYNZjc/oLt9gPvLOx+hxVJIKS2YW5pCbSyJTGMK775O8VyBwDJd2LTDl/X5i8v3S7NVw9vJb51tITDEUwEGANCx2/rXEEFFAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-odt{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAepJREFUeNqMkz1II1EQx/+7Ca6JkqyYiJ8cKEpAQbBQFDm0sVOsFBS9wt5KOTgEG5twxVlZ+XEnKNiIghYKxx5nwEpIIXaiSAgKGmMi0d23u8+3T7OaZJEMLG9mmPnN/w1vBUopLPNNhRWXHOyDg0nx82TiJtZPlPVoNpftc2cTotcHtxx06kdXpSQ/BvzKESZzIDmAz6y+NojOjpDMZiqRPIgNoFyWM8DrKUV7axO+gcp4g7AzmquAdVNqOgL2z2I4id1B0wgeygOyt/rLL5buLwAIDgA9dY+L+DkuDQOCrkMgBsRglcMOqAGwIstMg8AkGsuZMNUMRMkLqE+QGloglvlA7uIOAKvZajR0qJkUj/XHe0BTIclVKKlrfKsj9qA8gA6wqSJzPaXlr7ky//tdLEUfawsBjExUFGVWbT7AxSa42H2LMfODmvd3wKb7RAMLYwM8nts8xJ/pEe7/3PmP2eGv3D+9usb35W0bINoA7RmjXSHsH0f5Z/mUSZ0Ir2JmsBtD80s8/rGyzWsLFTD5yUQCbfUBHl9d38LvkdDTXIuHVBo0k+bbt06qO+yAPGXwe/cA4wO9PN44jKDG70GougIzi2tQ00ms7/3lpwnBBgjZ37Kkd1Shht5XzBIFl/ufFtniT/lFgAEAU//g6kvdGBMAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-otp{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAcJJREFUeNqMkssvA1EUxr+ZjkdbrfFKVD12ErYSRELY2fkH+BMsLcQaSwsrSzZi47EjJEQkEhYkFlhYSVtFpdqOqpk717l3jKZmiC+5mZlzv/s795wzCuccQncz3YeRBj4KHz0/RrOZe2NsZPP20o255zQ3EAxzEAC+6uzTw13G4TFQAakA/CWtIYbY0KBOrx7IvwDQqlHV1o3YxKTOvyAUvfQCfqmA3e4ikyS/zRAKvOot7eoSHEgZIHrCfQAfBqBaKQQDKScQAExd8emBANg+2U2CvNMkkgSqBmrCxFB8mujeoJBWwEqARcssKTAJEGrmaGrjqK1zvNknH4BtyxKl2VUpRxmj5W+x73q9AEaZrR/ND1EJluIpS3i9JQiA+a+hSq8HwJjTsLrRaWitPTCOlhEZn5N75sM1qigmlN+dB3u++Qao5W4TtbEXXIsiszGL4PA00itTsu6XnQWo0TjMTAJqfMDx/ryBJcaVzSNSH4fW0Q+rkIf5rsjRiid7yyN7uoXS3Zn0egE0NiORAN9bQ017D1Lri7CLlP2EDr3Rf7C/itzV2bfXA/igLDaRixfngFhSCooH2xVPCWBlwKcAAwBX1suA6te+hAAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-ots{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfZJREFUeNqMUk1rE1EUPS8zmabJdDKB2glEwY9ExJYiBUEQpV25qgtBXfgbpEtXuujKf+AfEKRddOdOGHClbYVCvyKWaijT2mhjphk7Sd7Me76ZONp0EsiBYWbOvfe88+69hHOOAE9f3zTVnDKNHvhlsfqPw/rM0ovyWsRFdXJEpDIyRnSlVz0KSkmvabaJeXSJBEhgAJzTDNybmtUnS5Pmg/lrN07H5NM/f13FoMgpXDSuhiIiK3Qi6LUugX7FAbaPPsJqfIHHKCStqRsXVFPQuZgD9BBxjikSiRq41AAkgCQBzVf0+BWEBX7GBm0xgHHUqk1UbBuEcIydzyCZlOI9YEGuDxwduCCitS3Xh3viCZ4jrcq4PJ6DLHd67tjtuAAXib54dCPVEfQ5XIcik/0/2iDeOYz3ceCxrisMi904y0XiMQFfkB7lg6xFHwFxEqUMV0anUNBLWKm8xd3i4zBWOzmASx0UsiW831mA59Xjm+h7HCOygduXHqJatzA7Poey9QnXjTuoVD/j/sRcmDOWLgqnLC5A2wwST+Pn8T629lahSCo291bwu9XA7vcy3m2+gTaUR14thrk9BXasbdiOjSe3nmPpwys0xSi/HpbDd3bIQC6dx/q3ZbRb/j8BEi3Po5cTJpHI9CBNDEa++GyDBN9/BBgAwfDlCVUQaNAAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-ott{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdFJREFUeNqMU89r02AYfpJ0iVm7EqhVOxw7dDBEdpiCE1RoEZRddvUgbIex/Rs7eehppyF4LOzQu4MxwYp0HgShIuwwUVSCVtl0s13afl+SzzcpyZYmyF74eN583/s+PO+PSEIIeJZdrtQVI19Cgmk/Ph39bpllXq82g7sgLxVcyKNZpIx8Uj5u5zSjc9Gov8ZihCRC8D+7On4JczevGeTGSEIC4ctKJtB1DTPXi1iCCEkIm1EFlC2Em0iwtWfinXkIzjiO0jljtDC5TtflGIGUQMB+mfja/oPv2Rx9MMjpMdJxOXyXTwkcwIkewfqQ1QtQNB385zcI14FrtQexsSb6SRysZ4Fbf+F6eHwATc9gJGNAm5iCTL5n/LCVRGADNoeaGoHqyaXj5gqQlTODovcwNk5Aj6wXqV8eCo7EDhMonEHpW+dZC7gUG98D3geo7vkb01h9cAvPdt76OGy1xntUd3bjUxAk3+l2sHJ/FgtrT0MUJNfDSm0bjQ/72Hzxxo+NK+h3B7XRNO4UrwymQtMIkdTBU0m+sBOayLsn8Ka78mQDjx/e87HXPkb1+UsfP37+AmZ1fP/suknBb6nefVQXjl06TxMlJfWKNWr+Kv8TYAAkUueexJF47QAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-pdf{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmhJREFUeNp0U0trU0EYPTP35qYxaW6TlDapNKWGbgo2FkF8rARB6rboXusf0F/hyq2U4krFqugqSBeuAyL4SERBstHa0iR9JKZJ7mvu+M0tqZGkH3x8987jzDnnm2FSSqh4ns0VU1ybFzj674Wa3uWiWbfsFQb+jrGj8Xvbm0HlvYVRxhJprpmTlGmum+OMm5uNPZNbtjk3l82ey8++8oW4Jv/H/wdA456g2kvH99FyHNiuAz2dwflbN8YW8zMK5Go/CMfQkAhpGsyQgRCtlpE4jIULyC9fHzu7MPPEl/5ib6WOE0JJNRiHHg6j86mMjw/2gG4bkbY4PW4Yj2j64skA5FTHdaEMPiAJszt1sK0d4suJmY4k0+IDDGRfqmh0u5gejQc+fG8eYCIahRQCEfgQnIuhEkgtONE+dGxYxEDj1DhiEycZ+1YXdUpHCqTMJIYyEES5aXXQsi2kYlGEia5GtHVKn+amPBeCutPgfLALPuVu+xDVPw2EQyFEjHDghbpYNm1yKVVnYjTOerepn4E6XQmLGSPkPkOXWATMSDcjQEkAaqOu6+i/rccALtFL53LI3r0Nq1ZD4/MXZJaWYFer+PXiJc6s3IEgY3+uPYZHTAcAHM+DTE8gnM1CSyaCulv+GrRy8uYyElcu4XfhLVpkpNtn/DGA5Uu0abFH36WnzzCayWAkmYJvWeCkfb9SwY+NDbSoOx4bYqJF8rZqVRRXV/HhzWtUSmWwmWl0RmN4v76OUqGASrmMOkntSHF8MOs954dT08W248wzYsJDOujRBAaqqikTpRo/qqd0/dv97c3Lat9fAQYA4z8bX9nTsb8AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-php{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhNJREFUeNqMkltrE0EUx//ZbDaXNrvZzdIkbYOXGgxYQlCK2IIY6EufxGdB8Av44AdR8AP44JOPBR+Ego0PClUKTTXQSmkTYtOkmubSJrQ1e3H2yJSEJNIDs3PmP+f89pyZcdm2DcdWvn7LzkxFHmCIra7nm9ulg8yLZ09yXON55Dgjt1PM2iPs0+aW/frdh8bzV2/SvQBnCLiEqcFxLKSSodlrU9leiGPihWePBkgeEZO6ShC2dCAZNuf6ADb+ldQ5PUPx4BCFcgXfdwq4Ph1Dtd5CZi4Nw7SQiMdCXkl6yVIy/QBWgcU+yx/XsLK2cdHndqlK/lZxH/OpJO7fnsWY3z/YAq+g0TmHpoUH2vB5PXi8RD9Fo10aAmDJTgWyIuOupmK38rsPcOvqJO33XWEvwLJsmKxHRVEwf/MKWl/yUMf8mIloWN8rw+sP0D6PHQmYuzGNgCRiMZVA17IQV4OIaTI8buH/AJMFd02Tkp05PO4jnWvc57EDAINt7u1X8Pb9KgI+Lxbv3cFR8xjx6AQ+b+Txs/qL9KePlih2CMBCq92hg2qzt1AoV7H5YxdhdqhHzRbgcpFeqdUplpvQW4FhmAixZ/sws4BoWCM/qmsE5XqE3dDQCrqGAYWdejqZgK6GUD8+IV9VghBFN1RZJv3sT5diBwC15gncggCPJKF0WCPN8dun55jQdVpz3Ynl9leAAQAJhiGatD9AOgAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-png{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmtJREFUeNpsU9tOE1EUXXPp0CAUWmJbC04xBANNTF+kKhG8fID6aqL/gPEj9E0lIf6Dj30HL03wxQtVIC0QKrWxNG1Dk9Z2Oj1zxn1m0oIZTnIyZ8/ee+211z5Hsm0bYg29fLGpxWIJWBYGS5IA8ncKhT9Wvf4Yqprtu+w3q85X7f9QxseD/pmZMZsxN9fnc5JNw0ACGGv6tPSvyvEDKEoWZ5Y8OHHObKpucw4B0t3agnl4CJPs2YkQVu4s61ORaBqMJc8CDBiIRhhVM9bXYdVqYAcH8M3NgS0tQQsFcfdKHEbvlr6WyaR/V6uPKPy7B4DT7lUq4MUipMlJ2MPDUKtVfKZ2nn/5BoNbkONxXeb8LYXe/A9AJLNWCxgdhZJagDI9DZg9qIkEytRSkdqTSFQtGILSbgc8LViM+tc0yPfukzIyOJ359k9YR0eQdB2KmBbpwXoM3Dod1SkD+scpEapCI5DdpsJhIJcjajQZagcjI+5oLe4VkeQnyiZgdIH2X6BJ7dSqQLfrggjw0AQwP+/GegCIHppNoFAgEMO1RZKo7BQgRi3yN05cnwdA0BQMAgF3C6pnbuNg92M9AFT1diSCh6kb+FGvo2MxnBB9ocZxp4Mns1cde213B81e7xwAcl4jkaa0IUSjUdLJwkL0Ej6VSvArCt7l81iku6GrKnYEU89VJlSJRmR0Dax+fI9suYxSo4HlWIw6M3FBlnD9YhiXabyOsOeIqG7TzDeIYo6EDGp+ZPb2kKKqH8h+mkxiI5/D1/19J3bwYPvPWXq2skkiJVxesqt0XzghpKM8nRVV2Lv2q9eLIvSfAAMAaacnllcFBmYAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-ppt{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkhJREFUeNpsU11rE0EUPTM7ySZpmzT9DNamWAtFfSiCigr+AxF9zKtv/hvf/Aki+FEi6ov4ItWHPGiwiBUKoUqqTUJImmR3M7Mz3t0kNe1m4LIwc+65595zlxljEJzdR5uf5nLmsvZx6gSvtd9W9bjhF7jg5dH9nRc/wq8YXaTSJptb0xklx7IZoKUEz1zJ2DUU69/37vFYrDxegJ9U0lC+AoIIVGg9CL+vIObP48KDQn7x0sWiVnJrnEDg7KGk+i/Ac4iUM/R7BsmrSSxtXMfa3X7el8+Kjf3KfUJ+iRJQw4w0Tc8BRyWGRAZY3rBR/VlC+XED2ayDhZyXl03+hNA3TxNQshlGLAnE44zCIL1goXZwiMNvB1i6zbC0KuAsxNITWwgNMYPeLVJiFEO9ArjHAivrAjNzBr4f4vwIgdGD4YUACsZCE8AtYGWT5jCsGQw5wEYJzP/pj5RwYTA1b07eQmfZ8P0sgdaM2FlYwWkMgMpl6NQAO33GKM0wsQWflkh1uqGVmVWblsiDkQyqxwfag35SqcktaEWTUTHYNx4iGU/C29+BvX4Lpu/C7zYgFjegSY63WySsHyXwpYHU00ieu0bAOuJbBTArBkiXKiaAmTzcvRJUV9E8rOgqBwqlY8ASs/AadbRLb8CzeTjVClqft6FdB17tL7yeCbFRBYoLr6vR/PiSEl5BZJaBD0/R2nkOZqfQ2fsKt+0SEQ+GLSIEUvJm+6jbah2+pS2aon+4g/afd4SYJVuA7vvXdC/IHQtSoTnK+yfAAIEaId1m+vudAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-psd{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqxJREFUeNpsU01ME0EYfbtdKKWGtoItRWgJHApCBE2I0YuoiSaaeDJeOJh41YN3TfTixcRwMfEk8eDJGA+Eg0YTTRRMg02KKFooCBbTlkJLS7f7P+u3K9Xo8iWT3Zn55s173/uGM00TVlwZfzJztD92iKO5ouvQGQPHcQDN380vlDPr65fdLj4Oa41i9sFt+ytgN7o7woGOrqgvvpLBaF8vWj1NUAwGTVNRM3mf5vU/zaU+XySQuTqIFXz9hxmGLkoS7r+YxvVnrzGzlgXPDOzUZPT4m3Dt/KlIuH9oUjXYEHZZ/wOgGQZi4TZcGI5hLb+FO++TSOSKcLtcMA0dI0EPrp4+HtnfG5skiUecDGwQE2MjAwiGWlFVNDz+tIyCokJhPKYSX7Gdz2I01hOJdnY9rJ/7UwPGTEiqjtbmJtw4MYx78S/4Wa3h5UoOYwPdIOp2Xi/t18rlFgcDw6o+ydiWVRwOBnCpL0oOAMmNEhLZIgSeoxwGSWcERon/M9DoBknTIdNQNAMnO4PIVGpIFXcwndlA2OtGc4MAxml27p4AIulWSIa9QVadiYSoJxhqBJivKgh5ad3k9gaw6JdlDaqq7q5wINY4F22HaLHSDZQkBW72O9cBYFEviBIURQH7a7MN0uDisUW12ZZcaGlmdq4DwCqeTo1zNtZuW7hUqGIw7MNqSUS2ImNsKEpSdEwt5lGhfQdAkQBEoub3NNrDJfAIeBuRrcrY5xGQ2RFJAjl00I8PCckJUCB9q1URBnk38XEJEuk41tmGwZAf66s1VOh2keqwoUnYpFxHH4iKIixkN3HzVQKP3iQR/5GDKMuYmE3h+fx3MHqh1sMafztHLuiCg0FAk0uFdLqcpGY5QEXbTC/j7mIaVjc18DxufUtBJ/vcggs+3ijVz/0SYABsJHPUtu/OYwAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-py{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlVJREFUeNpsUktvEmEUPTPzTUFmgJK2UqXQFG3pA6OBLrQxamJcaYwuu3Dp0l9iXLvVtRuDpgt3JIYaTVSaxtRHsJq2xEJBHgXmifebMhECXzKZme+ee+65516h2+2Cn2cb2VwyHl12//vP2/zOQaF4uD7GWN69e/LogfNm7kUsPBFaXYwHMeK0OlpQEJApHJTuykzK98dE98O0bLM/UNgr4v32Dj1fwSQRt9dSsfmZcMa0rIv9ODaqYrPVxuPnL1Cu1aEbJu7fvIZUIo4bqeVYRzcyv/8c3SPYpwECt/dmu4ON3Ed4TymI+hQc1ZqoE+F+uQLDsnHlwkKMscJTgl4eJOi9fxZLePNhGx6ZQRRFqH4VjZaGSv0Y6cQcJLpra0ZguIWegqDiw7lYBBZV6xiGk9DQDLzK5bEyF4Hi9VLMsoYI7J6Es5PjeHjnOl5ubqHaaJGBEkzbxplQAKIgDmBHekDTgI+qKKqKLvNApgmEgyquLs1CoFn2Y4cIeLJpkjoCLkWnUSIF3JxISIUsCjAoxhWNJLBIJs3YeXj/08oYZkOKY65HllE/bkMmY504YUd40HUq2JSSyW6iVPmLiXE/ZMYQCU+hXK3h1toqdNN0sEObyKtqtDQ6kXDwcadDS2TBryp4nX2HxXjsJK6bDnZIAZem6Tp5YMMmicn5OC4lztNWtvB9cg+hQABtWjKL2jH/T3GgBcYDXEE6mcDM6SlaJAGMWkivLBC54ZgniZaDHSI4rNSqn7/t1vgkGJPwZXffSeCjk2iUWz9+nSTQN8e6ef8EGAClUi/qoiOc3wAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-qt{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnVJREFUeNpsU8tu00AUPU5sp41NkzRxpfSZqi0VIIQqEEJUZYXECvbwCWxYsuBD+ABUFrDrCnWBQEJdIWigBSr6pqRJ1ebhxrE9M7aZmSrQ4o505fHMnXPPPWdGiaIIYrx89GKpNDdxmXkU3aEoCsT+z8W1Sm21+jCpJctQTvaerj+TX7WbnJ+0cpfuX8mQtn8GgJ4AZtIFY2Hz3foDVRcgyt+cRHcS0IARh+D/8G0PpmVi7smd0dLs+AIjwTVEiANEYYQwCHlEZyJgIQKfoX84g9uPZ0cHZ4YWmE9nuufU0wABCSSImMsWEgqSuoqA/39/swZFTWLy7vQo7dDnfPvWWQa8GuOV3IYLJXmyzDzG2/ChZ3pwbHdQ267BKJoYuj7SF2MQhiF8LuDK/Gf0DKTBKINz1IbTbEMzU1ANDW7LAfEIQKIgBsBFlAx6LYOz6MAcvoDCtAVGGPKlAiIu/F55F33FDA6W93EOAOMaMOl7biKPwRtD8Foetj5sYPfTDtxjl1f3Ubo5jkQieQ4ACSUD2iE4XDpAdbUiW9D7UsiN9WNkZgxajwbd0LGzt3keAJPUc1N5SVeENT0Ao2BKV6QzwlZeRBSKAYhe3aYHcZWn7l1EfjyPypcK9LQGa8qCvW9j9+MvaasQOHaRhGWdhsNLR8hwodYWf6B4tYjDjSOovRqq32rSYq/lytw4A77o1V2ERiAtzY5kkUrrsH+3QF2KY87ArTtQuQ6nAf4x6FCV1D001+vYersBM2vA4y1Rm2D7/Rac/TZIw4d/6MrcGAPf9htN0miJh7Lyuoyvr8rQeP9iVJcrSKgJ+TrFcyYebXTP/RFgAFQobmIOBxbsAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-rar{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnpJREFUeNpsUktPE1EU/u68OgylZXi0hZACQU1LEKKCMcat7jTRnQsXxsQtv4E/4M74P1iriUaNCw1FgxpjCJQKKAU60+m8mJnrmSll4XCTc8+959zz3e88GOcc8aq9evChOHl/lvMoubvWX/z4+BwTlbvw7bXdg8b7h6LE1gGW+O88CRMt4XTlR6/rYxce5Xv3jlHH19fPkBu+gWy5mlcFb3Wn/umeKOEMJF5C7xCFbtA9dRXjFoYKGiTRAlPGUV1aKU9O3VwNQ74A8DQAIZxqAuAhBPIMFYpQVAVB4CPSZjEzv1weH5tbDQN+JQ2Abu488mnzIbAAA3o/VK2PwDJo7r5Fy7ZRuvi4PFS6+qIXdVYD8Jg6BUcuOD8BozSLlRWyicgVKkTMQWwUlFF0Ooe5FIPk57BD7G0SiywyjD8bCDyHsOkeeeR3SUxEkROmU6BfQYFJMHfhWXV8efkUrb13VPMTsrcTQSzxZ/+n0GVA6EGbSGdgG9vo15fg2nFgbO8k70SRdd+mahDT81vUxTZRlJBRMsjq89C0EXCvSf7TIBZ136YZUJEiE7LgJ2dN01BZuE0dkIhxE7KcQTK1QUj+cwAEyrPZ+IydzRoyah+mLy2isbWBweESJEnB9q+1RM9Ub9GQOWkABg8HjRr2d9Yh0hTlBlRsfn+D4vg0BvUC9rZqECUJuk7Tzr1zahCYlB6HJAREPwfbbMBzLBzsbUKVI0qBgQkc+SxgWUYaIAqOpKwKXJ6bgGlaaDV/YvHaFNrtDsKTfVSrJeqIg/bRNwjclFIALeP3saybhu8SC4VBHwnhBXXIKocYRXD9QzBi4Xgchmkd9+L+CTAAMqwy+ZzluBgAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-rb{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAixJREFUeNqEUktvElEU/mag5f2yJhXLwxIt0kiqsVEXujP+A925cu1Pce3WtXVtYuJCF7KtTY0NrVQIpRVKeXTkMcO9F8+9ZVooJJ5kcmbmfOe733fO1YbDIWS8+/g1dycVX7W/xyO3vdsuVKqvnE7HZ230783rlyo7bVBicSGyfjsVwozomVbIPe/c+FmsPHfoRKJd1HT7hXHBZjVbA4aA14NnD9bC2VR8gwuxPi5Sx39Cp+M0XUP0ahhP1jLhW7HFD4zze3b93ILtXYyyVKlR8/5hFbnvO9gtlrGSjOF+OpXkYviWyo8mCS4R6bqO4p86vm3v4fC4DrPfw4unj1XN6JvBaQtjChzUXK43sVU4wNFJA43Tv/B73edQwTmfIhAjCVL6UdPAj1IVFSKhCdAcAI9rnjBiAjtBYEu3GEeh1sKJ0YXR68sVIujzIhzwY8DEBHZqiLRKkicQDfvABxaiQTc4Y/C65pCOXwcjcmlvJgHtlwi4epYifiQWgmoLZwPW6HQG07LgcOgKO0UglAKOTt/E+09fwAiUWU7QAE9xUK3jbvomsispZVHMVEDSZdHo9rCZ/4VIMKAu0XGjpU7d2S8hk0pCELHEzrjKnCQOYJoD+Dxu1RyiwUm5LaMDo9NFt2cqDLvY4oQFp/QpfT/MrmI5FkWebt+NpWto0j2QmQkOjZ9hpwhqjXZzM/+7LU+cc7lRrjXh8/lVLRK5ovLWXglOsiOxdt8/AQYAzv8qbmu6vgEAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-rtf{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe5JREFUeNqEU01PE0EYfnZmd5FSvgLYFuwWt9EgHyEaox68eDJevHvwJ/hTPHv1N/QgZ2NC4g3kUAQKFKGhjVKqRrvbnRlnht262FHfy+y8877PPM8z71pCCKh4/ebt+rJfXEz26Vjf2mnsN5rPKKWbVpx7+eK5Xu2kyMtNTd5d8MdhiJ9BOO7atFI9ajy1UyAqSPIRMR6ZmoNehNHMMB7fX/UWvEKFMbYKE8DfQnAhwRmmJkbx6M6S5+WmK2Evup2c9yUk2nnKA0XVcSiGXAe1k5beP1i+4RFCXqnPywB/AKVzK34RjHNYlgVKCH50w7EBBogbTa/AVM5SgBdn0gc2AMDjPsbFPz2xye9asweS6n+NTbG8BCCfUtLjff2WoVnVpAH6z6hMUtJE3EykYfpF4vUiL3QNS7FMeSAQRBHW3r1Hq91B+VoBQRji4+ExFsvz6Hz7jm7Yw5OH92AcJKW9G4SoHhzhy/lXbB98Qmm2oCXN5WawsV2TACEoJXqwTKOsb3BtR2ucmZxANpPB8JUhyPnHWDaDpfJ1eZFALzJJ4MKO5MEtv4TSXB7V/br8iQLMz+almRZWbvoo5q9qRlxwewCgeXbe3qrVO5ZkUD/9jJGRLPaOm6COi92TU1DbxYe9umRD0DrrtJO+XwIMABWp9nS+FgaoAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-sass{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDNDMTBBM0JGMTE5MTFFMTg3N0NFOTIyMTQ2QzhBNkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDNDMTBBM0NGMTE5MTFFMTg3N0NFOTIyMTQ2QzhBNkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowM0MxMEEzOUYxMTkxMUUxODc3Q0U5MjIxNDZDOEE2RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowM0MxMEEzQUYxMTkxMUUxODc3Q0U5MjIxNDZDOEE2RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po72XUcAAAJcSURBVHjahFJdTxNBFD1bykc/ttvdtttWGgI0bYrUgDZoNYqRJ014kMRXHvwB/hQTH/wFhMREJfFBQxBjhMRIFEQSCAlQxKYGggiU3e3HbnfX2bFt1EU9k9m9mblz5p4zlzFNExYmpue/jmTSZw5PZAl1MAwDT0c7O72wvPdudeNakPNtOZ0tsM7cvzdOc5yN5LDAsTFRAJks/kC2PxFRVe39Si6f4byez62EpAEH/gNN18F53Ri/Ocxf7OtdLMpKT42s/ZPg1cISJp/P0tg0TBzLCoK8D7eHh4RkLLJ4cCz12AjMXwgez8yhqtVo3NbqRKlcxcSL16gZwJ2Ry8KVc8kZO0HdTKlURn+8G6PD2SZhLMQj96WAiMAh2RXFYKI78lcJcx9WYBCycICnpNbojUWpD5Y0C4Zh2D0w6hWc70uQZC+IWfQZrXF0IsHvY+meBd08haAhoVMMQFJKWF7PNZM+klhRyogGhbqxOIXAMOtEwGAqDqVcgbVkkE+5UsEAWavf0az2t0ZqvK2qabh6IU3joizDwTgwej1LdVfJXkdbK8mt2QkayO99A0/0trQ46I1lVcX+UREhnsP34yLp1AD1xibBMuntpzU8mJyi3Tc1O4+l9U06n7x8Q/8PHz1DrrALt8tlr0CrkbJMHTop9Sk5sLa1g8L+ARJdnShKClY3tunN69t5iGLYTlCtakjFY7gxNABdN3B37BaqqoYT8pyX0in4ORbRkIA46YlDRbUTbBZ2Jb/Pw4qiKFnapcpPo9pdbrg8DjAOBsFgELJmsGs7eWkkc5bu/xBgAHkWC6UPADTOAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-scss{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkM4QjYyNDVGMTE4MTFFMTlBREZCNDNEM0ExMTk0MUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkM4QjYyNDZGMTE4MTFFMTlBREZCNDNEM0ExMTk0MUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQzhCNjI0M0YxMTgxMUUxOUFERkI0M0QzQTExOTQxQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQzhCNjI0NEYxMTgxMUUxOUFERkI0M0QzQTExOTQxQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkf1yeMAAAJbSURBVHjahFNdTxNBFD0tLULpB91uodVWPmorUIxo0VSiNSExMYYHE33l0Ud/in+C+OSjYgjRGDBRCKJIUkIEWi0WKlja0ul22+5219lJ26gLeiezuXvn7rnnnrlrUFUVms3Mvd2bjIyezRVLBA0zGAzo6jhjm1te+7EU37rFO+w7JlMbtG+ePJ5mOaZmci/nsPl6ONBtw18WDQc9tZq0sp7YjTisXV/NFKRpRvzHpHodDqsF03djzuvDg6vHJWFAprF/Arxe/oins6+YryoqCiUBvNOO+7FrXMjnWc0WyIAOQP0N4Nn8IqqSzPx2swllsYqZl28gK8DDyRvcxKXQvB6gISYpiwgH+jEVi7YAfW4nEqk0PJwDofNejAX7Pae2sPhhHQoF63U5Gai2Bn1epoPWmmaKoug1UBoMrgwHabIVVCx2jdrKFwm67TZ2plldPQGg2cK5HheIUMbaZqKV9In6giDCy3MNYXECgKI2gICxoQAEsQItpNCHWKngMo01arTY/jFIzbutShJuXh1Fm9FImYiM7tTtKOtbO+toN9Nc+fQ5SGUOIVYl7HzPIH2YRZ0y2KZ+sVzBHn2v1mpMGx0DTaR3nzfwfGEJdybGkdo/wEigDyvxLzg4yiESvojZhfd49OAeLJ2degaSLIPOO6vwgiYaaRErTRREEdn8MeJbSVZ5M7nLdNExqFLaQwEfFfACQn1+HBWKSKb3MT4Sgstuh9vVDa+bQ4DORE6o6RlspzMk9TOPfr+fiLJCLFYr3TZSKNcI7+aJwWQmPM+TkqRg49tu65f/JcAAMwMas6WUKd8AAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-sql{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAh5JREFUeNp8kctrE1EUxr+ZyXMkoa1NBROaSkpTBE23PhZ25cql2y5duvAPUdGFS1FxIRRBXZlFQ9GVdDENIhGJxkDsw2mneZnM83ruNZlOmNoDhzlzz3d/9zv3Sowx8Ch/qlYK2XM3cEJsbH0+qjV/rd6/u6aN18b7RMFT+9aosP/Ex+0ae/puw7j36PlKEMAzctKJ3aGFamMHjV0d+wcGitkMrpWWp6hVIciEk2MAOwbUWjosx0UiFoWqJpGMx5DNzODq5aIPoa82AWBg/lyKLMH1PMp/a9XvLXLzG1cuFlBaWpiKxaIPSLY6CaC93ggQjyiQZRkeQSzLRovGaPciWLt5faSWEBoh6KBvOhiaNga0+Y9pwaFxvu7rfp8F5pWDt+qNMp2IijHGwddWCvN+33/CoAOP5nVdT9SdoQ1JkggiQ6Yvr7V60+9z7akA2gfH9cRF8hO5F5Ve4lQAF9uuK+qFsylkzsQxrcaQm04hdWkR83Mzfp9rQ3fAFzu9Ph6+WMfjl6/pGBdb2jbKmx8QlRjWy5vkyhUZBPgOeGNHN9AbDLGUz6He2hVj3Ll9C8/evsdgaMK0HV8bcmDTU0UUBYXcedR+NLGnH0I3jvDk1Rsy46FP4C/1BtrdntCGHNiOAzWZgEKQ5Qt5lIqLojbaXSQTcRy2OwT4SZqk0IYAOgkVWUE+lxX/zb0DpFNpkTzmZmfFtzewhHYcfwUYAMZmVaZQlLFHAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-tga{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnxJREFUeNp0U89PE0EU/ra725K22ILRGipb22pMG6JcSEQTbUIwnozxpBcvepeEP0KPogcT/wlNT17kIKbEmChFUYKGVtL0R2gLtNCl3Z1Z3+zSAlonmezOe/O+973vvZEsy4JYnqdPMu6RkSQYQ29JEkB+PZcrslrtPhQl23VZc8/tr9I1yMHg0EA8HrBM04lVFAhoY38fSSDQVN3pfKV8G7KcxZHl6v1xblqU3eLc3p2VFZjr6+gQgwsnhzGTuq6Nhs6kYZqXjwL0GFhEl3U60OfnwWs1GGtrUKNRsKkpeIIBpKIRtI1J7cX7hXRhc/MOhXw5DkCZGG2zXAajzFIoBMvng1ypIKOqmP30GW3OIEcimovzlxRy5RgAFwDEAIODkCcmIMdiQLsNdWwMZdJlg8pzEUt1aBhKq3XinxKYqF9yQbqRIqsMy+0Gyy47bKgUWXSLtDENE5wdtuqQATm50F1VnPbRGeEw8HXZbiV8fsDvI9ldju9vADAyihLEbrWAZhOoVp3z6iqBUiB1A4nEfwCEsbkL/M4TgE5n5jDx+oTEzp1d8m9tC8H6MaAB0imzx0NU/WKUYE+loEyawDBo2ui6TGfT6ANAxrvx87gYCGCxXEKVJvCWFsG3eh1vN/J4OD6Od4UC8o0G3TX7TGLHwI9iEQmvF9X6Fh7F4/iYy+GcLOMSlfEgGsP0qdNOmX0BiGKpVkV1bw/1nW2b/gCpf1PTcI+Y7eg6ps+G4bG4PR99SjAVo9HE4q+fKNE0vl5awuSohjeijbRefVjAtUgEQRK7Yhi9OKn7nKWZxxlSPWl3QwgnaIrW8QMhD542vUbx/W49m7sq4v4IMABOqi3Ej7bAEAAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-tgz{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNpsU1trE0EYPbMzSTfdtInFtkkpiaXVWou2FRUEn/so6JugL/oH/Af+B1988if40jcFERQURNBSQdDWlLQN2lsue8neZsZvc7FoOrDszM75znfOmVmmtUYyvry++36yfOeS1qqzDtvH2P76ApPlW3Drb2sHex/uccHWAdbZX30kO2+B3siN3zhTnHuQ66+95i423jzFzOVljBdKOZNHazvVT7e5wF+SZBj9iZJ+3J11mbW2kR8T4LwFli5i4fqTUvnczTUp9RLtDhKgJx0q4dEwWAxrREKICHEsoYYXMXvlcWmquLgmY71yCkG/c0AkARgLMZpnMDMpGNzEYe0dGp6HwvmHpbHC1Wf9MnFCkHQOyYEPzSJwQ2B65Tm5NZG3Fshim6wbMNJn4bpHowMKtIqo2COgR2IcAptwjvcgo6i77igjEmVDqbY8xQJ1VwRULhiBI6+G9Zf3cbTziuzIDkmHSNqECTFgQScEcYuc2NA8TcdYwXD+GkK/TYVN+u72WrIudiAD8o6oAR2RRCmQMjis3CIy1iSpPySCXhFTXeyAgh4BR+JVw8pauLi0Cp4yCX9A90FQhnSBYtnF/k+Q+HYam9itfIZB3QvT8zj8XSW5EhNTs9ivbSLwPUzPLNPJBIMEKnaQYg6aB9+RGR5F5VsNgnNKXMI1NdJGG5WfHzFVLJ7k8c8xUngpVodlDSGbFYj8Y4yMpOG09lHf3yIFPzA3fwHZTAQVtU4JUTeFDrdgDdlI8wAz5Qy2KxswReI7QODZcOr0ZH3q2hIDBI7zq16tuk3FNPxAI4wN+pkoccYoE4YJU5EdUtM4Qst26v26PwIMAKj3P/2YUKgYAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-tiff{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmRJREFUeNp0UktPE1EU/qYzHWstlrYJNcWUElyUJsaNGh9B0g1Lo0v9Ey78EbrVxBhXuHShm25YGBJRQpAYBDEWpaEPEhksdVpbyjzveO4MfZDCTWbauefc736PIziOA77OPH2yJCcSGdg2uksQAKofFou/7VrtASRpvVNynj13f6XOhjg8HAlMTIQdy/LO+v3uYUPTkAHCTb+cK+0pdyGK6+hbvu4/xiyHbncYAwfR19ZgbG/DoO9LsSgeTd9JXoxfyMG2rvQDdBlwIZauQ5ufh12twioU4E+nYU1NIRCNIDs+Bt28mXzx8VNuZ796j9q/DgAwomwqClilAmF0FE4wCInAlkjO4y+r0JgNX2os6XPYS2q/cQyAcQatFjA0BPH6NYipccAwIGUy2CVJFZInkKlyJAqx3T4/IMGmJkeWIWSz5KgI5pdhb3yDXS5DSCYh8rTID8s0wexeVD0GtMd85KkkefFxUfE47M1NokbJkByEQl6tL+ouAI+MUwbFhnYbaJKc/Sqg0x4H4eDRGDA56fUOABA9/GsCpaIHwr8FOhQ823O5RfW66tUGADhNy3RNRDjcN41HLxdQ8J6jYTsOQLfOJBK4f+s2/uoathoNGKT1MtFeVHZxdWTEZfEq/wMKl3rCJOIzTV6ADs2R5ulYDDNkYjp0DhrF+zCVgkw31+v1UxjQZkNV0SADd2o1MIuc9gmY+/kLxb0/UFoHePd9A1qzeUoKpilx9xcLWzgg+u/zeVfuQqkM9bCN1ysrWKXxdtPgvScwUAm58XZ52W16QyPtifRUzi588GbEi1ztHPsvwAC4uC9qhnsZvwAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-txt{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeJJREFUeNp8UrtOG1EQPfsyXiyzBguIJSyChZBBEFCKpKHLo6egpErNn8CHgH8gkZIiTSIXLhJAWCgkoMgRMSiRBSK29z4y9+I1d/HCrFb3MTPnnjkzlpQSynY+fP70fGF2gQuByCz6lfdd9Uurfvrrjes6762eb3tzQ69uFJwPsqOPC+MBEmxxphi4tlU5OGmsOzaBWLc+O9oIIVhScidkyGZ8vH62nHtSKlaI4cse6TjAfSaFBBcco0EWqyvzubmpyQrj/FXk75cQaSEMeMXU8xykPA/Hjd/6/LRcyjEpt2i7HAe4A2TeLZWKUOJaVLxj27j813EHGKCXaAJExu/4BOdiAED08riQD2riOrexyRoYc3CvsAbLGAAjZga7vgZG23WMCdBvoxKJc36TRBlMiaa2JByjNqqD8qkYc1pjDK7abey+/YhrWlfKswhpiCR96aEU9o5+QE3g2ovVWDm2Sc22bBQm8vrVpbkS9r+doPr1EOWZaQ0yFoxg2PcREosEAI4uvZhJpzFMP+cSXRbq+043RManez+tNWKMI6GN0g0Z04HFR+NoNC/0yx717efZOSbzY3AcR4Op2AGA5p/W31r9e0vNgSrh9OwCrpeCkqvZuqTybnpRqx/r2CjvvwADAJC/7lzAzQmwAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-wav{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAApFJREFUeNpsU1tPE0EYPXtpKbX0wqUQKVQMFdIXQBNCQBs06KP+B8ODGh+Mf4b/4IsGE54kxhcMBrkp7YOQgBRvSKG73fvsrt8Otoask0xmd+b7zpxzvm8E3/cRjPkniyulW0NFy2JoDkEAguOlpXJ9p3L8MBqVl4O9YHxae8pXuRlcGO7KPLhfTDVUqwUgigJMy4Whm6lEXHjxYf3XnByRN0QB/2KaH7btMlUxoRJAcyqKhdOaht7+DJ49n+2cvTnwynXcsb+kLwJ4rgfmMDDGWqvneXCZS9ND7mov5h9ND85M9y86Dpto5rUkuJ4Py3YDJpy6QGJPayqB+Njf+43XL220t0cwOZkfrNXsBUqZugDA6CbLdAiAwaek1ZU9LmP8Rh6S78GsGxjOp9FdzKJaVZIhBgGASzK21w/wbrnCk8euX+EMAjaaZuPHdwUdHVFYluuGPGCORwwYjg5rqOwccRk+3Ux0IEvntmsNG4ZmUayL/wAwKHUNfZfTKN0ZRaw9Cof8qJ/pMAyHy5KkAMTksSEJtnMenM7EMVMawbejMzJRh67bXEYiIXEAVTW50SEAhzqwfqrBcXx4VOhYm4RsNgHbsJFOyZTsQ1MN+hcohoUlkFiMT+TQFpMwXOjGpXgE+XwGk1N5pFJtKNCequgYGupCRBbCDOp0KBJc4VoP3dyBONW8uydBgBHUThqQKCk3mEZ/LoUG+RBioJO7VarAwEAntjYPiUUW9Hh4b2R7k9j98hN37xWx8fGAt3eIAdVMLn+uUv+b2KReSCZjZJiB9bV9jIz2ofr1BKvvd7G9dRC80lae0HzOt+cWVnrSKDrMJykifwNBpCgE/UAllEXufmDu8Zlffvvm8XSQ90eAAQA0pF7c08o4PAAAAABJRU5ErkJggg==');background-repeat:no-repeat;background-size:contain}.ipfs-xls{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmxJREFUeNpsU0trFEEQ/mamZ3Y2+0zIC2MmITEkUYgERFQErx5E8KTi1b/h79A/4SW3nCNeYggBYZVEMU/y3N3Z7M7OTD/G6lk2ruw20zRdU/XV91VVG0mSQK/3n1a/jky6d6Xs3G8WXS+Pw5N6LXjLLGuna/78oZKerGsYKtrDE16uJGL1L9gEOOcYd2dL1fNwrbL//aXN7J1efPMmkUqEFAk0A0VZNbFEaQCBscIkXj975y3NLq9xye8PBkAniHOFph+j2eC4rsdoB4LsFubGl/Hq8RtvYWpxTQi52o1jvWiGYaRZL0/auDgOkC/Z8BYL2Pqxidp1FZkhoDxpeaXA/Ujuj/4HoOxKKjiOiek7RUShRNQWaNYFQuMafrYCxiw4ozZKfqbYJ0EvRdl1DQyyTs8XCNTA6UELMwvDyLpZWIZNNlNLlQOK2LMJRJ+5AkuZ1S7CFFzJzk56GnUjQWlYkqCoBWFbonEVYcLLA4dNnB624GQsDBWIgfZJEgxkoChzSFWvn4VpQemDm2VwXQsXJwF1h6c+gxlQ5jgSiEUEt0wdIe7tMES+nEG2aCLiJMOIIWIr9e0DEELAMUrwRuchVAyTKimUwO75Jm6VF3Bv7imOaj+xd7UFKVS/BPJF1b/E4tgTrE49J60O5kceoNqowiuuYKa8ghHXA48U9MT2AQgyRvTThE30bQiaSGa4yLMJNFo+Dq/2cHt4CYlwyFf2S6BHwwrMw/avDbR5C1k7h1YQ4KH3Amf+AcZyEbZPv9CItzQD1l9EbtYOjv74v/d3O9RMPTDrsEwGIWN8q2yk7XNYRs9JrRv3V4ABADSGR6eQ0/NQAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-xlsx{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNpsU8tqFEEUPVXdPY/ueWZIoiYZiSYKYhJc6EbduHOhgijo3t/wH1z6B0JAhOyMILhxo4kJGk1ASTAxwWF0Mpp5dHc9vFUzYwidaoqmq+8959xzbzGtNcx69PTS26ETmQtS9r4Hy/xv7MW7jV+th5yzVcaYPX/++It9u4NAv+CVR6tBUUTqMJsDcRzjZOZM8W9ZLKx+/XDb4e5/kH5In0lpIYWGUaC0YTZnBCAEKoVR3L36oDo7NbsglZwbqD6iQKOXFMcKUVfBkBAoQhlD5xxMDp/HrSv3q1JgYW3z0x0KXzkCYJaRZljru23aHWTzLiamAyytv0O9UYdf5PArqlppBfMUfu4oALErqZBKcUxMFRCHEp0DgW5Lo4N9NIN1dF0XXsVFOUyPJTzo+WBANDidjp8tgHGG3c0DnJ4uIRf4cOCBaW5KjY8xkZL72xpJ9QcFz5bVqHUJGHZL2YtNmKi06YCyiVFb4s/vEKMTAf1p4edOG6mMi1zR6wEpdUwX+vLDtkCzHoK7ptcM6ayLmGajvtex4PliyoIkFRjmUEASelB2rXQRSfjUCT9PlWpmW21iTGzCAyEkUixPRqXhe2V4zKczbdmybgkpJ0cGOuA6Y2MTCsKoi5HsNK7N3MN+uwYaWbxYfoLLkzdxcew6lrYWaZhm8PHHG3zffp1UwJSHz9vvkU8PodbcQYYYS5lxYkxTkGdVDQdV1Js1qPgYD6JIuIE7gsXVefIhIuM05k7dwMbeMmh87a18ufIMaVYyprrJLgje2Nr+1tzYXANnDnr3zRhHj37Vvy2wpXHtNAd5/wQYAD6WMuT2CwoVAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-xml{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAilJREFUeNqMks1PE0EYxh+g3W2t1G0sEqyISynUFJsSOShNwCamiYZED3LgIkcuxoN/iCZePZiYGD2aGD+i0F5KMChxlVaakAK2ykcAt+WzdLu7zkxo3WZL4pu8mXfmeeY3885ug67roPFh5nvc62m9hjoR+5LMp7MrkYf370qVtco+VtCUFpbj+jGR+JbWn76OyQ8ePwsZATQb8R/hanZgINgj9IqeuBFCw1Kt9OMBnNWCs24XwkG/QKYUEiGjVAPQof/rq0783pShET3ULQo8xz0iS5FaANmrHQH2DoqY+DSLSz6RzecWlnD9ymU47LYjd4O5BXqDTG4FM3NpTEkpdJ5rw0AowLRMbhUfp58gTOaD/UHmNQPI6YmvKWRX1zESHUJ/oBs2nmPa+Mgw0ZIM3tZyGoJwygzQNB2jNyJIZX7iB0lpPoM70UGmPX8zCU+rG8NDVxHwdiC5mKsPUFUN/gvtLLf39sFzVqaN3YrC6TjBauqhXhNA1TQoqloV7Da+pjZq1FsXUCamF29j6LvYhf3iISamZ3Fv9DZevouhRzzPfOG+3hpA9U9UyioOlTJ7pFeTCQS6RGzIebyf+oz5pSzWtmSW1EO9phvQ00slBRt/8qR3DoWdXbiczUiTzd52D+tdLmyTB14mx1rMAKVcRpEATjrsuElee/HXGmnFRyBOGD30C/nEDjNgs7CDpsYmnHG3YPegBCvHs9oYfm8nG9dJa5X4K8AAQzQX4KSN3wcAAAAASUVORK5CYII=');background-repeat:no-repeat;background-size:contain}.ipfs-yml{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdxJREFUeNqMUl1rE0EUPbM7m5Y0Zptu21AwWwhYpfSDFh+kvvRd8N0Hf4I/xWdf/Q158F0QoQ+CVsFKaLSQpt/dpmvztTOzzky6cetOpWcZZvbO3MO5514SxzEU3r57/3GpWllM/tP4sL3TarROXuSo/SWJvX71Uu80Cfhlr/T4UdWFAVfdnmsTUtvdP35OUyQKVnJgXDBTcj9icAsTeLax7j/052qM81UjwW1QJXEhMF0qYnN90fdnvdogYmvJPU0/VBApD4hcDrWRcyikfB17srzgW7b9Rh1vEvxDlI4tVytaBSEEtmWh0xsUMwpwnWjqAlcxogiHd1wiQyCu87iI/+sJtf6+NXsgpd7FWCMB50KvkYMGMbLdZgLlfj+K9K4+FnFQ2x7WntIs50AbmiGwLILt+k+EvzvSNIHzdigdJ/AmXQRhiHv5POSwYmG+cqPVo0HqDxj8uTK2vn1Hfa+JmdIkvtZ/4fOPXU3WPDpFeNWVyUKryCiIGMN4zsH98gym3CIcOTwT+XHdXrdQQHAZotE8kBPpSqPNHtBOr48HUmLOcXRJT9dWNMGYJFby91pHOAvaykSaITg+bwefdhrteDRTMSwyrFCgI88E056Hy+4Ah2cXQZL3R4ABALUe7fqXWFN6AAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}.ipfs-zip{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm9JREFUeNpsk0tv00AUhc+MY6dOmgeFJg1FoVVpUWlFC0s2IFF1jxBbhKj4BSxYdscPYcEmQmIDq0gsERIViy4TpD7VFzF1Ho5je2a4thOqNhlp5Mz4zudzzp0wpRTC8fPrk0/TC6+fDtYicLH97T1Kc2vQDcs+rH3eUAxVznn0fn1DRM8E+iOdv5ct3XmZG6yVlNj6solUbgVTt0q5FGtX6vXqC6VklTE+KAO/OODHSIQPRQpsXC+kkEz2ELA0ystv84tLzyucsbWByisAGf+QAS2CCDRRLMJMmxC+i8C4jdLCm/zM7OOKFGptcO6/BTpJ0yeQB0Y+mfKQuZZG0jQgeRbW8Xdomobs9LN8scc+UPHNy4Dwq8IljotIIQEm59/RoSyM1CKkXKZNBm7kIVgyM6wgAnSgRK9vqQfHPiMFDHqyFVsLR9Cm0o4YzoAASrSjCelQfRPb1Vc4qn0EY5L2W9GEaBLcxQgFHpGbkMIDJ69e+wjJ8VXqRgKid0r7ftQdxkRs9SqA2kgAm14SSIQh9uhuLGPMnKJs/5KquL1x0N0RCsizigoDaLqBdHoMiyvrlBsHVx1wphD4BCewoqxGKKDwAgtOy8JufYuk+5golGGaGZwc1sIGoDz3AOPZSVLaHgVwydoJDM1H4DbQODughB3YpOD44HfoHgnu4e7So0uAi0stHLJ3Aud8B9bpHu6vPoSu9TtDl6tUuoFiIYOgu0+158MKmOxomtyD3Qi/3MTR7i8K0EDG1GHO5DE3X4DvNahZlJOwEkOATvdPc2//hx3mXJ5lFJaF8K8bStd0YGfnOJbMGex21x6c+yfAAOlIPDJzr7cLAAAAAElFTkSuQmCC');background-repeat:no-repeat;background-size:contain}\n.narrow {width: 0px;}\n.padding { margin: 100px;}\n#header {\n  background: #000;\n}\n#logo {\n  height: 25px;\n  margin: 10px;\n}\n.ipfs-icon {\n  width:16px;\n}\n";

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fileType = __webpack_require__(117);

var mime = __webpack_require__(118);

var detectContentType = function detectContentType(path, chunk) {
  var fileSignature; // try to guess the filetype based on the first bytes
  // note that `file-type` doesn't support svgs, therefore we assume it's a svg if path looks like it

  if (!path.endsWith('.svg')) {
    fileSignature = fileType(chunk);
  } // if we were unable to, fallback to the `path` which might contain the extension


  var mimeType = mime.lookup(fileSignature ? fileSignature.ext : path);
  return mime.contentType(mimeType);
};

module.exports = detectContentType;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var toBytes = function toBytes(s) {
  return _toConsumableArray(s).map(function (c) {
    return c.charCodeAt(0);
  });
};

var xpiZipFilename = toBytes('META-INF/mozilla.rsa');
var oxmlContentTypes = toBytes('[Content_Types].xml');
var oxmlRels = toBytes('_rels/.rels');

module.exports = function (input) {
  var buf = input instanceof Uint8Array ? input : new Uint8Array(input);

  if (!(buf && buf.length > 1)) {
    return null;
  }

  var check = function check(header, options) {
    options = Object.assign({
      offset: 0
    }, options);

    for (var i = 0; i < header.length; i++) {
      // If a bitmask is set
      if (options.mask) {
        // If header doesn't equal `buf` with bits masked off
        if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
          return false;
        }
      } else if (header[i] !== buf[i + options.offset]) {
        return false;
      }
    }

    return true;
  };

  var checkString = function checkString(header, options) {
    return check(toBytes(header), options);
  };

  if (check([0xFF, 0xD8, 0xFF])) {
    return {
      ext: 'jpg',
      mime: 'image/jpeg'
    };
  }

  if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return {
      ext: 'png',
      mime: 'image/png'
    };
  }

  if (check([0x47, 0x49, 0x46])) {
    return {
      ext: 'gif',
      mime: 'image/gif'
    };
  }

  if (check([0x57, 0x45, 0x42, 0x50], {
    offset: 8
  })) {
    return {
      ext: 'webp',
      mime: 'image/webp'
    };
  }

  if (check([0x46, 0x4C, 0x49, 0x46])) {
    return {
      ext: 'flif',
      mime: 'image/flif'
    };
  } // Needs to be before `tif` check


  if ((check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) && check([0x43, 0x52], {
    offset: 8
  })) {
    return {
      ext: 'cr2',
      mime: 'image/x-canon-cr2'
    };
  }

  if (check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) {
    return {
      ext: 'tif',
      mime: 'image/tiff'
    };
  }

  if (check([0x42, 0x4D])) {
    return {
      ext: 'bmp',
      mime: 'image/bmp'
    };
  }

  if (check([0x49, 0x49, 0xBC])) {
    return {
      ext: 'jxr',
      mime: 'image/vnd.ms-photo'
    };
  }

  if (check([0x38, 0x42, 0x50, 0x53])) {
    return {
      ext: 'psd',
      mime: 'image/vnd.adobe.photoshop'
    };
  } // Zip-based file formats
  // Need to be before the `zip` check


  if (check([0x50, 0x4B, 0x3, 0x4])) {
    if (check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], {
      offset: 30
    })) {
      return {
        ext: 'epub',
        mime: 'application/epub+zip'
      };
    } // Assumes signed `.xpi` from addons.mozilla.org


    if (check(xpiZipFilename, {
      offset: 30
    })) {
      return {
        ext: 'xpi',
        mime: 'application/x-xpinstall'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.text', {
      offset: 30
    })) {
      return {
        ext: 'odt',
        mime: 'application/vnd.oasis.opendocument.text'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.spreadsheet', {
      offset: 30
    })) {
      return {
        ext: 'ods',
        mime: 'application/vnd.oasis.opendocument.spreadsheet'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.presentation', {
      offset: 30
    })) {
      return {
        ext: 'odp',
        mime: 'application/vnd.oasis.opendocument.presentation'
      };
    } // https://github.com/file/file/blob/master/magic/Magdir/msooxml


    if (check(oxmlContentTypes, {
      offset: 30
    }) || check(oxmlRels, {
      offset: 30
    })) {
      var sliced = buf.subarray(4, 4 + 2000);

      var nextZipHeaderIndex = function nextZipHeaderIndex(arr) {
        return arr.findIndex(function (el, i, arr) {
          return arr[i] === 0x50 && arr[i + 1] === 0x4B && arr[i + 2] === 0x3 && arr[i + 3] === 0x4;
        });
      };

      var header2Pos = nextZipHeaderIndex(sliced);

      if (header2Pos !== -1) {
        var slicedAgain = buf.subarray(header2Pos + 8, header2Pos + 8 + 1000);
        var header3Pos = nextZipHeaderIndex(slicedAgain);

        if (header3Pos !== -1) {
          var offset = 8 + header2Pos + header3Pos + 30;

          if (checkString('word/', {
            offset: offset
          })) {
            return {
              ext: 'docx',
              mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            };
          }

          if (checkString('ppt/', {
            offset: offset
          })) {
            return {
              ext: 'pptx',
              mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            };
          }

          if (checkString('xl/', {
            offset: offset
          })) {
            return {
              ext: 'xlsx',
              mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };
          }
        }
      }
    }
  }

  if (check([0x50, 0x4B]) && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) && (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
    return {
      ext: 'zip',
      mime: 'application/zip'
    };
  }

  if (check([0x75, 0x73, 0x74, 0x61, 0x72], {
    offset: 257
  })) {
    return {
      ext: 'tar',
      mime: 'application/x-tar'
    };
  }

  if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) && (buf[6] === 0x0 || buf[6] === 0x1)) {
    return {
      ext: 'rar',
      mime: 'application/x-rar-compressed'
    };
  }

  if (check([0x1F, 0x8B, 0x8])) {
    return {
      ext: 'gz',
      mime: 'application/gzip'
    };
  }

  if (check([0x42, 0x5A, 0x68])) {
    return {
      ext: 'bz2',
      mime: 'application/x-bzip2'
    };
  }

  if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
    return {
      ext: '7z',
      mime: 'application/x-7z-compressed'
    };
  }

  if (check([0x78, 0x01])) {
    return {
      ext: 'dmg',
      mime: 'application/x-apple-diskimage'
    };
  }

  if (check([0x33, 0x67, 0x70, 0x35]) || // 3gp5
  check([0x0, 0x0, 0x0]) && check([0x66, 0x74, 0x79, 0x70], {
    offset: 4
  }) && (check([0x6D, 0x70, 0x34, 0x31], {
    offset: 8
  }) || // MP41
  check([0x6D, 0x70, 0x34, 0x32], {
    offset: 8
  }) || // MP42
  check([0x69, 0x73, 0x6F, 0x6D], {
    offset: 8
  }) || // ISOM
  check([0x69, 0x73, 0x6F, 0x32], {
    offset: 8
  }) || // ISO2
  check([0x6D, 0x6D, 0x70, 0x34], {
    offset: 8
  }) || // MMP4
  check([0x4D, 0x34, 0x56], {
    offset: 8
  }) || // M4V
  check([0x64, 0x61, 0x73, 0x68], {
    offset: 8
  }) // DASH
  )) {
    return {
      ext: 'mp4',
      mime: 'video/mp4'
    };
  }

  if (check([0x4D, 0x54, 0x68, 0x64])) {
    return {
      ext: 'mid',
      mime: 'audio/midi'
    };
  } // https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska


  if (check([0x1A, 0x45, 0xDF, 0xA3])) {
    var _sliced = buf.subarray(4, 4 + 4096);

    var idPos = _sliced.findIndex(function (el, i, arr) {
      return arr[i] === 0x42 && arr[i + 1] === 0x82;
    });

    if (idPos !== -1) {
      var docTypePos = idPos + 3;

      var findDocType = function findDocType(type) {
        return _toConsumableArray(type).every(function (c, i) {
          return _sliced[docTypePos + i] === c.charCodeAt(0);
        });
      };

      if (findDocType('matroska')) {
        return {
          ext: 'mkv',
          mime: 'video/x-matroska'
        };
      }

      if (findDocType('webm')) {
        return {
          ext: 'webm',
          mime: 'video/webm'
        };
      }
    }
  }

  if (check([0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]) || check([0x66, 0x72, 0x65, 0x65], {
    offset: 4
  }) || check([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], {
    offset: 4
  }) || check([0x6D, 0x64, 0x61, 0x74], {
    offset: 4
  }) || // MJPEG
  check([0x77, 0x69, 0x64, 0x65], {
    offset: 4
  })) {
    return {
      ext: 'mov',
      mime: 'video/quicktime'
    };
  } // RIFF file format which might be AVI, WAV, QCP, etc


  if (check([0x52, 0x49, 0x46, 0x46])) {
    if (check([0x41, 0x56, 0x49], {
      offset: 8
    })) {
      return {
        ext: 'avi',
        mime: 'video/x-msvideo'
      };
    }

    if (check([0x57, 0x41, 0x56, 0x45], {
      offset: 8
    })) {
      return {
        ext: 'wav',
        mime: 'audio/x-wav'
      };
    } // QLCM, QCP file


    if (check([0x51, 0x4C, 0x43, 0x4D], {
      offset: 8
    })) {
      return {
        ext: 'qcp',
        mime: 'audio/qcelp'
      };
    }
  }

  if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
    return {
      ext: 'wmv',
      mime: 'video/x-ms-wmv'
    };
  }

  if (check([0x0, 0x0, 0x1, 0xBA]) || check([0x0, 0x0, 0x1, 0xB3])) {
    return {
      ext: 'mpg',
      mime: 'video/mpeg'
    };
  }

  if (check([0x66, 0x74, 0x79, 0x70, 0x33, 0x67], {
    offset: 4
  })) {
    return {
      ext: '3gp',
      mime: 'video/3gpp'
    };
  } // Check for MPEG header at different starting offsets


  for (var start = 0; start < 2 && start < buf.length - 16; start++) {
    if (check([0x49, 0x44, 0x33], {
      offset: start
    }) || // ID3 header
    check([0xFF, 0xE2], {
      offset: start,
      mask: [0xFF, 0xE2]
    }) // MPEG 1 or 2 Layer 3 header
    ) {
        return {
          ext: 'mp3',
          mime: 'audio/mpeg'
        };
      }

    if (check([0xFF, 0xE4], {
      offset: start,
      mask: [0xFF, 0xE4]
    }) // MPEG 1 or 2 Layer 2 header
    ) {
        return {
          ext: 'mp2',
          mime: 'audio/mpeg'
        };
      }

    if (check([0xFF, 0xF8], {
      offset: start,
      mask: [0xFF, 0xFC]
    }) // MPEG 2 layer 0 using ADTS
    ) {
        return {
          ext: 'mp2',
          mime: 'audio/mpeg'
        };
      }

    if (check([0xFF, 0xF0], {
      offset: start,
      mask: [0xFF, 0xFC]
    }) // MPEG 4 layer 0 using ADTS
    ) {
        return {
          ext: 'mp4',
          mime: 'audio/mpeg'
        };
      }
  }

  if (check([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41], {
    offset: 4
  }) || check([0x4D, 0x34, 0x41, 0x20])) {
    return {
      ext: 'm4a',
      mime: 'audio/m4a'
    };
  } // Needs to be before `ogg` check


  if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], {
    offset: 28
  })) {
    return {
      ext: 'opus',
      mime: 'audio/opus'
    };
  } // If 'OggS' in first  bytes, then OGG container


  if (check([0x4F, 0x67, 0x67, 0x53])) {
    // This is a OGG container
    // If ' theora' in header.
    if (check([0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61], {
      offset: 28
    })) {
      return {
        ext: 'ogv',
        mime: 'video/ogg'
      };
    } // If '\x01video' in header.


    if (check([0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00], {
      offset: 28
    })) {
      return {
        ext: 'ogm',
        mime: 'video/ogg'
      };
    } // If ' FLAC' in header  https://xiph.org/flac/faq.html


    if (check([0x7F, 0x46, 0x4C, 0x41, 0x43], {
      offset: 28
    })) {
      return {
        ext: 'oga',
        mime: 'audio/ogg'
      };
    } // 'Speex  ' in header https://en.wikipedia.org/wiki/Speex


    if (check([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20], {
      offset: 28
    })) {
      return {
        ext: 'spx',
        mime: 'audio/ogg'
      };
    } // If '\x01vorbis' in header


    if (check([0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73], {
      offset: 28
    })) {
      return {
        ext: 'ogg',
        mime: 'audio/ogg'
      };
    } // Default OGG container https://www.iana.org/assignments/media-types/application/ogg


    return {
      ext: 'ogx',
      mime: 'application/ogg'
    };
  }

  if (check([0x66, 0x4C, 0x61, 0x43])) {
    return {
      ext: 'flac',
      mime: 'audio/x-flac'
    };
  }

  if (check([0x4D, 0x41, 0x43, 0x20])) {
    return {
      ext: 'ape',
      mime: 'audio/ape'
    };
  }

  if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
    return {
      ext: 'amr',
      mime: 'audio/amr'
    };
  }

  if (check([0x25, 0x50, 0x44, 0x46])) {
    return {
      ext: 'pdf',
      mime: 'application/pdf'
    };
  }

  if (check([0x4D, 0x5A])) {
    return {
      ext: 'exe',
      mime: 'application/x-msdownload'
    };
  }

  if ((buf[0] === 0x43 || buf[0] === 0x46) && check([0x57, 0x53], {
    offset: 1
  })) {
    return {
      ext: 'swf',
      mime: 'application/x-shockwave-flash'
    };
  }

  if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
    return {
      ext: 'rtf',
      mime: 'application/rtf'
    };
  }

  if (check([0x00, 0x61, 0x73, 0x6D])) {
    return {
      ext: 'wasm',
      mime: 'application/wasm'
    };
  }

  if (check([0x77, 0x4F, 0x46, 0x46]) && (check([0x00, 0x01, 0x00, 0x00], {
    offset: 4
  }) || check([0x4F, 0x54, 0x54, 0x4F], {
    offset: 4
  }))) {
    return {
      ext: 'woff',
      mime: 'font/woff'
    };
  }

  if (check([0x77, 0x4F, 0x46, 0x32]) && (check([0x00, 0x01, 0x00, 0x00], {
    offset: 4
  }) || check([0x4F, 0x54, 0x54, 0x4F], {
    offset: 4
  }))) {
    return {
      ext: 'woff2',
      mime: 'font/woff2'
    };
  }

  if (check([0x4C, 0x50], {
    offset: 34
  }) && (check([0x00, 0x00, 0x01], {
    offset: 8
  }) || check([0x01, 0x00, 0x02], {
    offset: 8
  }) || check([0x02, 0x00, 0x02], {
    offset: 8
  }))) {
    return {
      ext: 'eot',
      mime: 'application/octet-stream'
    };
  }

  if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
    return {
      ext: 'ttf',
      mime: 'font/ttf'
    };
  }

  if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
    return {
      ext: 'otf',
      mime: 'font/otf'
    };
  }

  if (check([0x00, 0x00, 0x01, 0x00])) {
    return {
      ext: 'ico',
      mime: 'image/x-icon'
    };
  }

  if (check([0x00, 0x00, 0x02, 0x00])) {
    return {
      ext: 'cur',
      mime: 'image/x-icon'
    };
  }

  if (check([0x46, 0x4C, 0x56, 0x01])) {
    return {
      ext: 'flv',
      mime: 'video/x-flv'
    };
  }

  if (check([0x25, 0x21])) {
    return {
      ext: 'ps',
      mime: 'application/postscript'
    };
  }

  if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
    return {
      ext: 'xz',
      mime: 'application/x-xz'
    };
  }

  if (check([0x53, 0x51, 0x4C, 0x69])) {
    return {
      ext: 'sqlite',
      mime: 'application/x-sqlite3'
    };
  }

  if (check([0x4E, 0x45, 0x53, 0x1A])) {
    return {
      ext: 'nes',
      mime: 'application/x-nintendo-nes-rom'
    };
  }

  if (check([0x43, 0x72, 0x32, 0x34])) {
    return {
      ext: 'crx',
      mime: 'application/x-google-chrome-extension'
    };
  }

  if (check([0x4D, 0x53, 0x43, 0x46]) || check([0x49, 0x53, 0x63, 0x28])) {
    return {
      ext: 'cab',
      mime: 'application/vnd.ms-cab-compressed'
    };
  } // Needs to be before `ar` check


  if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
    return {
      ext: 'deb',
      mime: 'application/x-deb'
    };
  }

  if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
    return {
      ext: 'ar',
      mime: 'application/x-unix-archive'
    };
  }

  if (check([0xED, 0xAB, 0xEE, 0xDB])) {
    return {
      ext: 'rpm',
      mime: 'application/x-rpm'
    };
  }

  if (check([0x1F, 0xA0]) || check([0x1F, 0x9D])) {
    return {
      ext: 'Z',
      mime: 'application/x-compress'
    };
  }

  if (check([0x4C, 0x5A, 0x49, 0x50])) {
    return {
      ext: 'lz',
      mime: 'application/x-lzip'
    };
  }

  if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
    return {
      ext: 'msi',
      mime: 'application/x-msi'
    };
  }

  if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
    return {
      ext: 'mxf',
      mime: 'application/mxf'
    };
  }

  if (check([0x47], {
    offset: 4
  }) && (check([0x47], {
    offset: 192
  }) || check([0x47], {
    offset: 196
  }))) {
    return {
      ext: 'mts',
      mime: 'video/mp2t'
    };
  }

  if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
    return {
      ext: 'blend',
      mime: 'application/x-blender'
    };
  }

  if (check([0x42, 0x50, 0x47, 0xFB])) {
    return {
      ext: 'bpg',
      mime: 'image/bpg'
    };
  }

  if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
    // JPEG-2000 family
    if (check([0x6A, 0x70, 0x32, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jp2',
        mime: 'image/jp2'
      };
    }

    if (check([0x6A, 0x70, 0x78, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jpx',
        mime: 'image/jpx'
      };
    }

    if (check([0x6A, 0x70, 0x6D, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jpm',
        mime: 'image/jpm'
      };
    }

    if (check([0x6D, 0x6A, 0x70, 0x32], {
      offset: 20
    })) {
      return {
        ext: 'mj2',
        mime: 'image/mj2'
      };
    }
  }

  if (check([0x46, 0x4F, 0x52, 0x4D, 0x00])) {
    return {
      ext: 'aif',
      mime: 'audio/aiff'
    };
  }

  if (checkString('<?xml ')) {
    return {
      ext: 'xml',
      mime: 'application/xml'
    };
  }

  if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], {
    offset: 60
  })) {
    return {
      ext: 'mobi',
      mime: 'application/x-mobipocket-ebook'
    };
  } // File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)


  if (check([0x66, 0x74, 0x79, 0x70], {
    offset: 4
  })) {
    if (check([0x6D, 0x69, 0x66, 0x31], {
      offset: 8
    })) {
      return {
        ext: 'heic',
        mime: 'image/heif'
      };
    }

    if (check([0x6D, 0x73, 0x66, 0x31], {
      offset: 8
    })) {
      return {
        ext: 'heic',
        mime: 'image/heif-sequence'
      };
    }

    if (check([0x68, 0x65, 0x69, 0x63], {
      offset: 8
    }) || check([0x68, 0x65, 0x69, 0x78], {
      offset: 8
    })) {
      return {
        ext: 'heic',
        mime: 'image/heic'
      };
    }

    if (check([0x68, 0x65, 0x76, 0x63], {
      offset: 8
    }) || check([0x68, 0x65, 0x76, 0x78], {
      offset: 8
    })) {
      return {
        ext: 'heic',
        mime: 'image/heic-sequence'
      };
    }
  }

  if (check([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return {
      ext: 'ktx',
      mime: 'image/ktx'
    };
  }

  return null;
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(119);

var extname = __webpack_require__(121).extname;
/**
 * Module variables.
 * @private
 */


var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */

exports.charset = charset;
exports.charsets = {
  lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null); // Populate the extensions/types maps

populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset(type) {
  if (!type || typeof type !== 'string') {
    return false;
  } // TODO: use media-typer


  var match = EXTRACT_TYPE_REGEXP.exec(type);
  var mime = match && db[match[1].toLowerCase()];

  if (mime && mime.charset) {
    return mime.charset;
  } // default text/* to utf-8


  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8';
  }

  return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */


function contentType(str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false;
  }

  var mime = str.indexOf('/') === -1 ? exports.lookup(str) : str;

  if (!mime) {
    return false;
  } // TODO: use content-type or other module


  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime);
    if (charset) mime += '; charset=' + charset.toLowerCase();
  }

  return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */


function extension(type) {
  if (!type || typeof type !== 'string') {
    return false;
  } // TODO: use media-typer


  var match = EXTRACT_TYPE_REGEXP.exec(type); // get extensions

  var exts = match && exports.extensions[match[1].toLowerCase()];

  if (!exts || !exts.length) {
    return false;
  }

  return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */


function lookup(path) {
  if (!path || typeof path !== 'string') {
    return false;
  } // get the extension ("ext" or ".ext" or full path)


  var extension = extname('x.' + path).toLowerCase().substr(1);

  if (!extension) {
    return false;
  }

  return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */


function populateMaps(extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana'];
  Object.keys(db).forEach(function forEachMimeType(type) {
    var mime = db[type];
    var exts = mime.extensions;

    if (!exts || !exts.length) {
      return;
    } // mime -> extensions


    extensions[type] = exts; // extension -> mime

    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i];

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source);
        var to = preference.indexOf(mime.source);

        if (types[extension] !== 'application/octet-stream' && (from > to || from === to && types[extension].substr(0, 12) === 'application/')) {
          // skip the remapping
          continue;
        }
      } // set the extension -> mime


      types[extension] = type;
    }
  });
}

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */
module.exports = __webpack_require__(120);

/***/ }),
/* 120 */
/***/ (function(module) {

module.exports = {"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true},"application/atsc-held+xml":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/cbor":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["ecma","es"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true},"application/fhir+json":{"source":"iana","compressible":true},"application/fhir+xml":{"source":"iana","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true},"application/mmt-usd+xml":{"source":"iana","compressible":true},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","compressible":true},"application/msc-mixer+xml":{"source":"iana","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana"},"application/news-groupinfo":{"source":"iana"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana"},"application/nss":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p2p-overlay+xml":{"source":"iana","compressible":true},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana"},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","compressible":true},"application/pidf-diff+xml":{"source":"iana","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true},"application/route-s-tsid+xml":{"source":"iana","compressible":true},"application/route-usd+xml":{"source":"iana","compressible":true},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana"},"application/ttml+xml":{"source":"iana","compressible":true},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true},"application/urc-targetdesc+xml":{"source":"iana","compressible":true},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["keynote"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana"},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana"},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","compressible":true},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"apache","extensions":["der","crt","pem"]},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true},"application/xcap-caps+xml":{"source":"iana","compressible":true},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana"},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana"},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana"},"image/avcs":{"source":"iana"},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana","compressible":false},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shex":{"extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana"},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vp8":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;

  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];

    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  } // if the path is allowed to go above the root, restore leading ..s


  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
} // Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.


var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

var splitPath = function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}; // path.resolve([from ...], to)
// posix version


exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd(); // Skip empty and invalid entries

    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  } // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)
  // Normalize the path


  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');
  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}; // path.normalize(path)
// posix version


exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/'; // Normalize the path

  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }

  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
}; // posix version


exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
}; // posix version


exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }

    return p;
  }).join('/'));
}; // path.relative(from, to)
// posix version


exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;

    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;

    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;

  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];

  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2]; // TODO: make this comparison case-insensitive on windows?

  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }

  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }

  return res;
} // String.prototype.substr - negative index don't work in IE8


var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map